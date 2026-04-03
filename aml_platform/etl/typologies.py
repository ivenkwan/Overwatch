# ==========================================
# OPENCYPHER RULE TEMPLATES (PRODUCTION)
# ==========================================

# 1. Circular Flow (Existing)
# Detects 2-5 hop cycles back to origin
CYPHER_CIRCULAR_FLOW = """
SELECT * FROM cypher('aml_network', $$
    MATCH p = (a:Entity)-[t:Transfer*2..5]->(a:Entity)
    RETURN a.id AS entity_id, relationships(p)
$$) as (entity_id agtype, tx_hashes agtype);
"""

# 2. Smurfing / Structuring (Existing)
# Multiple transfers below $10k summing to >= $10k
CYPHER_SMURFING = """
SELECT * FROM cypher('aml_network', $$
    MATCH (a:Entity)-[t:Transfer]->(b:Entity)
    WHERE t.amount_usd < 10000 
    WITH a, b, count(t) as tx_count, sum(t.amount_usd) as total_usd, collect(t.ref_id) as tx_hashes
    WHERE tx_count >= 3 AND total_usd >= 10000
    RETURN a.id AS entity_id, tx_hashes
$$) as (entity_id agtype, tx_hashes agtype);
"""

# 3. Peeling Chain (New)
# Sequence of transfers where amounts decrease slightly (peeling 5-15%)
# Pattern: A -> B (peel) + A -> C (change), C -> D (peel) + C -> E (change)...
CYPHER_PEELING_CHAIN = """
SELECT * FROM cypher('aml_network', $$
    MATCH p = (a:Entity)-[t:Transfer*3..6]->(n:Entity)
    WHERE ALL(idx IN range(0, size(relationships(p))-2) 
          WHERE (relationships(p)[idx+1]).amount_usd < (relationships(p)[idx]).amount_usd * 0.95
          AND (relationships(p)[idx+1]).amount_usd > (relationships(p)[idx]).amount_usd * 0.80)
    RETURN a.id AS entity_id, relationships(p)
$$) as (entity_id agtype, tx_hashes agtype);
"""

# 4. High-Velocity Layering (New)
# Rapid fan-out -> fan-in consolidation
CYPHER_HIGH_VELOCITY_LAYERING = """
SELECT * FROM cypher('aml_network', $$
    MATCH (source:Entity)-[t1:Transfer]->(mule:Entity)-[t2:Transfer]->(sink:Entity)
    WHERE t2.timestamp - t1.timestamp < 3600
      AND t2.amount_usd >= (t1.amount_usd * 0.98)
    WITH source, sink, count(mule) as mule_count, collect(t1.ref_id) + collect(t2.ref_id) as tx_hashes
    WHERE mule_count >= 3
    RETURN source.id AS entity_id, tx_hashes
$$) as (entity_id agtype, tx_hashes agtype);
"""

TYPOLOGIES = [
    {"name": "CIRCULAR_TRANSACTION", "query": CYPHER_CIRCULAR_FLOW, "severity": "CRITICAL"},
    {"name": "SMURFING_STRUCTURING", "query": CYPHER_SMURFING, "severity": "HIGH"},
    {"name": "PEELING_CHAIN", "query": CYPHER_PEELING_CHAIN, "severity": "HIGH"},
    {"name": "HIGH_VELOCITY_LAYERING", "query": CYPHER_HIGH_VELOCITY_LAYERING, "severity": "CRITICAL"}
]
