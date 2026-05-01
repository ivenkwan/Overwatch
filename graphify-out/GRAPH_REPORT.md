# Graph Report - .  (2026-05-01)

## Corpus Check
- 121 files · ~169,902 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 201 nodes · 188 edges · 21 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `daily_update_job()` - 6 edges
2. `get_auth()` - 5 edges
3. `mask_pii()` - 5 edges
4. `run_graph_promotion()` - 5 edges
5. `UserBase` - 4 edges
6. `run_t1_batch_job()` - 4 edges
7. `main()` - 4 edges
8. `ErrorBoundary` - 4 edges
9. `get_db_connection()` - 4 edges
10. `lifespan()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `test_junior_masking()` --calls--> `mask_pii()`  [INFERRED]
  aml_platform\tmp\test_pii.py → aml_platform\backend\app\services\pii_service.py
- `test_senior_unmasking()` --calls--> `mask_pii()`  [INFERRED]
  aml_platform\tmp\test_pii.py → aml_platform\backend\app\services\pii_service.py
- `lifespan()` --calls--> `init_db_pool()`  [INFERRED]
  aml_platform\backend\app\main.py → aml_platform\backend\app\db\session.py
- `lifespan()` --calls--> `close_db_pool()`  [INFERRED]
  aml_platform\backend\app\main.py → aml_platform\backend\app\db\session.py
- `Authenticate user and return JWT token.     Uses PostgreSQL DB to read user cred` --uses--> `Token`  [INFERRED]
  aml_platform\backend\app\api\v1\auth.py → aml_platform\backend\app\schemas\user.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (20): BaseModel, Config, Token, TokenData, UserBase, UserCreate, UserOut, assign_role() (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (8): get_current_user(), get_current_user_with_scope(), log_audit_event(), log_unmasking_event(), Decode JWT and return user info., Scope-based RBAC enforcement., Audit Trail.      Sinks to log file or DB asynchronously., Compliance-critical: Log whenever a Senior Investigator views raw PII.

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (6): lifespan(), close_db_pool(), DatabaseState, get_db(), init_db_pool(), Dependency injection wrapper yielding an asyncpg connection from the pool.

### Community 3 - "Community 3"
Cohesion: 0.2
Nodes (8): cleaned_ledger_data(), IngestConfig, load_relational_tables(), Reads the raw CSV file and performs basic column renaming and typing., Cleans counterparty names, hashes PKs, and formats columns., Loads normalized data into PostgreSQL core schema, raw_ledger_data(), Config

### Community 4 - "Community 4"
Cohesion: 0.33
Nodes (8): get_db_connection(), get_super_nodes(), promote_crypto_to_graph(), promote_fiat_to_graph(), Fetches the super-nodes from the relational database., Translates tabular SCREENED fiat elements into openCypher MERGE commands., Translates Tabular SCREENED crypto elements into openCypher MERGE commands., run_graph_promotion()

### Community 5 - "Community 5"
Cohesion: 0.44
Nodes (7): check_file_availability(), daily_update_job(), get_db_connection(), load_csv_to_postgres(), rename_to_ok(), update_graph_model(), verify_data_load()

### Community 7 - "Community 7"
Cohesion: 0.32
Nodes (6): mask_pii(), mask_value(), Apply masking logic to a specific field value., Recursively mask PII in dictionaries or lists based on user role.     Only SENIO, test_junior_masking(), test_senior_unmasking()

### Community 8 - "Community 8"
Cohesion: 0.43
Nodes (6): get_db_connection(), normalize_crypto_txn(), normalize_fiat_swift(), Simulates parsing messy TradFi SWIFT payloads into the relational     staging_fi, Simulates parsing Web3/Crypto block explorer API or Node RPC data (e.g. UTXO/Acc, run_t1_batch_job()

### Community 9 - "Community 9"
Cohesion: 0.6
Nodes (5): complete_task(), deploy_process(), get_active_task(), get_auth(), start_case_process()

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (4): explore_graph(), get_network(), Returns generic network topology using Apache AGE for the Unified Workspace., Explore the Apache AGE graph around a target entity.

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (4): get_daily_kpis(), get_monthly_report(), Generate KPIs and Case Management metrics for the Department Head dashboard., Retrieve the latest Daily AML KPIs from the datamart for the Governance MIS dash

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (2): get_neighborhood(), Fetches a subgraph centered around entity_id up to 'depth' hops away.

### Community 14 - "Community 14"
Cohesion: 0.7
Nodes (4): ensure_schema_exists(), load_sql_bulk(), main(), run_command()

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (1): ErrorBoundary

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (2): Check-Services(), Wait-For-Http()

### Community 17 - "Community 17"
Cohesion: 0.83
Nodes (3): drop_and_recreate_data(), main(), run_command()

### Community 18 - "Community 18"
Cohesion: 0.83
Nodes (3): handleAction(), loadCaseDetails(), loadCases()

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (2): compute_daily_kpi(), setup_schema()

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (2): execute_rules_and_sink_alerts(), get_db_connection()

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (2): fetchUsers(), handleCreateUser()

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (2): Projects relational PostgreSQL tables into Apache AGE Graph., update_age_graph()

## Knowledge Gaps
- **27 isolated node(s):** `Provisions a user in Keycloak and maps them to the local `app_users` table`, `Get all users mapped to the current tenant.`, `Fetch predefined roles that an admin can assign to a user.`, `Map a role to a user internally.`, `Returns generic network topology using Apache AGE for the Unified Workspace.` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 13`** (5 nodes): `graph_service.py`, `get_full_network()`, `get_neighborhood()`, `parse_agtype()`, `Fetches a subgraph centered around entity_id up to 'depth' hops away.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (5 nodes): `ErrorBoundary.tsx`, `ErrorBoundary`, `.componentDidCatch()`, `.getDerivedStateFromError()`, `.render()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (4 nodes): `Check-Services()`, `manage_aml_services.ps1`, `Teardown-And-Rebuild()`, `Wait-For-Http()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (3 nodes): `daily_kpi_mart.py`, `compute_daily_kpi()`, `setup_schema()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (3 nodes): `rule_engine.py`, `execute_rules_and_sink_alerts()`, `get_db_connection()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (3 nodes): `page.tsx`, `fetchUsers()`, `handleCreateUser()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (3 nodes): `Projects relational PostgreSQL tables into Apache AGE Graph.`, `update_age_graph()`, `graph_projection.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `mask_pii()` (e.g. with `test_junior_masking()` and `test_senior_unmasking()`) actually correct?**
  _`mask_pii()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Provisions a user in Keycloak and maps them to the local `app_users` table`, `Get all users mapped to the current tenant.`, `Fetch predefined roles that an admin can assign to a user.` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._