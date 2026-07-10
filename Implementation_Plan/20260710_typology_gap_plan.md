# Typology Detection — Gap Analysis & Materialized Build Plan

**Date:** 2026-07-10
**Trace origin:** graphify communities `C32 Cypher Rule Engine` ↔ `C3 AML Spec: Detection & Controls` ↔ `C25 AML Detection Typologies` ↔ `C1 Implementation Plans / Repo Scan`
**Question answered:** How do the detection rules, spec typologies, and planned-but-unimplemented typologies actually connect — and what gaps remain?

---

## 1. The path through the graph — and where the graph's story breaks

The graph (community hubs + "surprising connections") reported the rule engine implements **3 typologies** (Circular Flow, Smurfing, Rapid Movement) and that **Peeling Chain** and **High-Velocity Layering** were *inferred/planned* (semantically-similar edges back to the base typologies).

**Code reality** ([aml_platform/etl/typologies.py](../aml_platform/etl/typologies.py)):

| Rule in code | Status |
|---|---|
| `CIRCULAR_TRANSACTION` (Circular Flow) | Implemented ✓ |
| `SMURFING_STRUCTURING` (Smurfing) | Implemented ✓ |
| `PEELING_CHAIN` | Implemented ✓ — marked "(New)" |
| `HIGH_VELOCITY_LAYERING` | Implemented ✓ — marked "(New)" |
| **Rapid Movement / Mule Funneling** | **DROPPED ✗** — mandated by [AML_spec.md](../AML_spec.md) L31 and built per [20260402.md](./20260402.md) §4, but absent from current code |

**Conclusion:** The graph's "planned-but-unimplemented" inference was *inverted*. The two typologies it flagged as merely planned (Peeling Chain, High-Velocity Layering) **are** in the code; the real gaps are (a) a **regression** — Rapid Movement was removed — and (b) a large **spec-vs-code shortfall** against the v5 requirements. The graph missed this because extraction was split across chunks and the code community (C32) never got cross-linked to the spec community (C3/C25).

**Bridge nodes on the path:** `tme-engine` (v5 Squad A, the Transaction Monitoring Engine that *should* own these rules) → `Cypher Rule Engine` / `rule_engine.py` → `typologies.py` → `AML_spec.md` → `Implementation_Plan/20260402.md`.

---

## 2. Gap analysis

### 2a. v5-mandated detection scenarios vs. implemented

v5 spec §15.1 ([Project-Overwatch-Full-Requirements-Specification.md](../docs/new_v5_spec/Project-Overwatch-Full-Requirements-Specification.md) L1676–1691) defines a **14-scenario pre-seeded library**. Coverage today:

| v5 Scenario | Category | Mode | Implemented? | Notes |
|---|---|---|---|---|
| `SCN_STRUCT_FIAT_01` | Structuring | BATCH | **Partial** | Smurfing rule exists but uses flat USD 10k, not HKD 120k CTR + 30-day window |
| `SCN_STRUCT_SC_01` | Structuring (stablecoin) | BATCH | **No** | No HKD 8k Travel-Rule threshold |
| `SCN_LAYER_RAPID_01` | Layering | REALTIME | **Partial** | Peeling/High-Velocity touch layering but not "24h roundtrip, 3+ hops" |
| `SCN_TRAVEL_RULE_01` | Travel Rule Breach | REALTIME | **No** | Not in rule engine |
| `SCN_SANCTIONS_RT_01` | Sanctions Evasion | REALTIME | **Partial** | OFAC relational exact-match only; no 85% fuzzy, not in AGE |
| `SCN_BLOCKCHAIN_RISK_01` | Blockchain Risk | REALTIME | **No** | Needs `ba_risk_score` |
| `SCN_UNHOSTED_WALLET_01` | Unhosted Wallet | BATCH | **No** | |
| `SCN_VELOCITY_01` | Velocity | REALTIME | **No** | Needs 90-day behavioural baseline |
| `SCN_HIGHVAL_01` | High Value | REALTIME | **No** | |
| `SCN_DORMANT_01` | Dormant Account | BATCH | **No** | |
| `SCN_PEP_01` | PEP Monitoring | BATCH | **No** | |
| `SCN_MIXER_EXPOSURE_01` | Mixer/Darknet | BATCH | **No** | Needs wallet baseline |
| `SCN_PROFILE_MISMATCH_01` | Profile Mismatch | BATCH | **No** | |
| `SCN_CROSS_RAIL_LAYER_01` | Cross-Rail Layering | BATCH | **No** | **Headline gap** — the v5 differentiator |

**Coverage: ~2 fully, ~3 partial, ~9 absent.** The platform's stated reason for existing — *cross-rail* laundering detection — has zero rule coverage.

### 2b. Regression
- **Rapid Movement / Mule Funneling** (single entity forwarding >90% of incoming funds within a window) — in v1 spec and the 20260402 build, gone from `typologies.py`. Not equivalent to High-Velocity Layering (fan-out→fan-in through *multiple* mules).

### 2c. Scaffolding / infrastructure gaps (block all the above)

1. **Alert schema drift.** [01-init.sql](../aml_platform/init-scripts/01-init.sql) L67–76 `alerts` table has only `(alert_type, severity, trigger_entity, related_transactions, status, created_at, resolved_at)`. v5 converged model wants `scenario_category` enum, `rail`, `ml_typology`, time window, and links to behavioural baselines. **Every new scenario has nowhere to record its category/rail.**
2. **No scenario-config abstraction.** Thresholds (10000, 0.95, 0.80, 3600s, mule_count≥3) are hardcoded inside Cypher strings. No `SCN_*` identity, no per-rail/per-window parameters, no tuning surface.
3. **No production scheduling.** `execute_rules_and_sink_alerts()` is invoked only by demo scripts ([run_demo_demo.py](../aml_platform/etl/run_demo_demo.py) L105, [reload_env_and_demo.py](../aml_platform/etl/reload_env_and_demo.py) L101). No Dagster T+1 batch asset, no realtime ingestion hook. v5 wants nightly BATCH (00:00–06:00 HKT) + REALTIME rules.
4. **No tests.** No `test_typologies.py` / `test_rule_engine.py` (STR module has tests; rules don't). Regressions like the dropped Rapid Movement rule went undetected.

---

## 3. Materialized build plan

Sequenced so each phase is independently shippable and unblocks the next. Target files are concrete.

### Phase 0 — Stabilize scaffolding (do first; everything depends on it)
- [ ] **0.1** Migrate `alerts` schema to v5: add `scenario_code`, `scenario_category` (enum), `rail`, `ml_typology`, `window_start`/`window_end`, `behavioural_input_ref`. New init script `init-scripts/04-alert-schema-v5.sql` (additive `ALTER TABLE`; keep back-compat columns).
- [ ] **0.2** Introduce a scenario registry: `aml_platform/etl/scenarios.py` — each entry = `{code, name, category, rail, mode, query|strategy, params, severity}`. Refactor `typologies.py` rules into this registry with stable `SCN_*` codes. `rule_engine.py` iterates the registry instead of `TYPOLOGIES`.
- [ ] **0.3** Parameterize Cypher thresholds via `params` (read from env / a `scenario_config` table) so tuning doesn't require code edits.
- [ ] **0.4** Add `test_rule_engine.py` + `test_typologies.py` with synthetic graph fixtures (seed a known circular / smurfing / peeling pattern, assert the expected alert). **Acceptance:** the Rapid-Movement regression is caught if re-introduced.
- [ ] **0.5** Write `typologies.py` → `scenarios.py` migration so existing 4 rules keep firing under the new registry (green tests).

### Phase 1 — Close the regression + highest-value typologies
- [ ] **1.1** Re-implement **Rapid Movement** (`SCN_RAPID_MVMT_01`): entity forwarding ≥90% of incoming funds within a window. Restore the 20260402 behaviour under the new registry.
- [ ] **1.2** Implement **Cross-Rail Layering** (`SCN_CROSS_RAIL_LAYER_01`): stablecoin inflow → fiat outflow within 48h, same beneficial owner. Requires the unified party/UBO graph edge (fiat account ↔ wallet via beneficial owner). This is the v5 headline — prioritize.
- [ ] **1.3** Implement **Rapid Layering realtime** (`SCN_LAYER_RAPID_01`): 24h roundtrip, 3+ hops (distinct from fan-out/fan-in).
- [ ] **1.4** Add fixtures + tests for 1.1–1.3.

### Phase 2 — Behavioural / baseline scenarios (T+1 batch)
- [ ] **2.1** **Structuring fiat + stablecoin** windows: 30-day rolling window, HKD 120k CTR (fiat) / HKD 8k Travel-Rule (stablecoin) thresholds. Replace the flat USD-10k Smurfing rule.
- [ ] **2.2** **Velocity** (`SCN_VELOCITY_01`): 3× count or 5× amount vs 90-day `customer_behaviour_baseline`. Needs the baseline table populated by the ETL.
- [ ] **2.3** **Dormant reactivation** (`SCN_DORMANT_01`): 12+ months dormant → large movement.
- [ ] **2.4** **Profile mismatch** (`SCN_PROFILE_MISMATCH_01`): actual vs `party.expected_txn_profile`.

### Phase 3 — Stablecoin / blockchain scenarios
- [ ] **3.1** **Blockchain risk** (`SCN_BLOCKCHAIN_RISK_01`, realtime): `ba_risk_score > 70`. Requires wallet-analytics adapter feed.
- [ ] **3.2** **Unhosted wallet** (`SCN_UNHOSTED_WALLET_01`): monthly volume > HKD 50k.
- [ ] **3.3** **Mixer/darknet exposure** (`SCN_MIXER_EXPOSURE_01`): >0 exposure in 90d.
- [ ] **3.4** **Travel Rule breach** (`SCN_TRAVEL_RULE_01`) and **fuzzy sanctions** (`SCN_SANCTIONS_RT_01`, 85% match) — promote from relational exact-match to AGE/fuzzy.

### Phase 4 — Graph-analytic typologies (beyond pairwise Cypher)
- [ ] **4.1** **Betweenness-centrality facilitation** detection (intermediary accounts in layering chains).
- [ ] **4.2** **Louvain community** detection for smurfing rings / coordinated mule networks.
- [ ] **4.3** Formal **cycle detection** as a named scenario (generalizes Circular Flow with window/rail).

### Phase 5 — Scheduling, observability, tuning loop
- [ ] **5.1** Wire BATCH scenarios into a **Dagster T+1 asset** (nightly 00:00–06:00 HKT) and REALTIME scenarios into the **ingestion hook**.
- [ ] **5.2** Alert-severity routing + dedupe across scenarios (one entity, multiple SCN hits → one case).
- [ ] **5.3** Tuning surface: scenario precision/recall dashboard; feedback from L2 outcomes → threshold adjustment (ties to v5 "Continuous Improvement & HITL" diagram, community 66).
- [ ] **5.4** Re-run `graphify --update` after Phase 1–2 land so the code↔spec communities finally link and the "surprising connections" reflect reality rather than drift.

---

## 4. Priority call

If only one phase ships first, it is **Phase 0 + 1.2 (Cross-Rail Layering)**: the scaffolding makes every later scenario cheap, and Cross-Rail Layering is the single scenario that justifies the platform's existence ("entirely invisible to siloed monitoring systems" — v5 spec). Rapid Movement (1.1) is a same-day fix and should ride along to close the regression.
