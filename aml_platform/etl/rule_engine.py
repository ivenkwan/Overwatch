import logging
import json
import psycopg2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aml-cypher-rule-engine")

# ==========================================
# PHASE 4: OPENCYPHER RULE TEMPLATES
# ==========================================

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        database="aml_platform",
        user="aml_admin",
        password="secure_password_123"
    )

CYPHER_CIRCULAR_FLOW = """
SELECT * FROM cypher('aml_network', $$
    MATCH p = (a:Entity)-[t:Transfer*2..5]->(a:Entity)
    RETURN a.id AS entity_id, relationships(p)
$$) as (entity_id agtype, tx_hashes agtype);
"""

CYPHER_SMURFING = """
SELECT * FROM cypher('aml_network', $$
    MATCH (a:Entity)-[t:Transfer]->(b:Entity)
    WHERE t.amount_usd < 10000 
    WITH a, b, count(t) as tx_count, sum(t.amount_usd) as total_usd, collect(t.ref_id) as tx_hashes
    WHERE tx_count >= 3 AND total_usd >= 10000
    RETURN a.id AS entity_id, tx_hashes
$$) as (entity_id agtype, tx_hashes agtype);
"""

CYPHER_RAPID_MOVEMENT = """
SELECT * FROM cypher('aml_network', $$
    MATCH (a:Entity)-[t1:Transfer]->(mule:Entity)-[t2:Transfer]->(b:Entity)
    WHERE t1.amount_usd >= 5000 
      AND t2.amount_usd >= (t1.amount_usd * 0.90)
    RETURN mule.id AS entity_id, [t1.ref_id, t2.ref_id] AS tx_hashes
$$) as (entity_id agtype, tx_hashes agtype);
"""

def execute_rules_and_sink_alerts():
    logger.info("Starting OpenCypher Rule Engine evaluation...")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    rules = [
        {"name": "CIRCULAR_TRANSACTION", "query": CYPHER_CIRCULAR_FLOW, "severity": "CRITICAL"},
        {"name": "SMURFING_STRUCTURING", "query": CYPHER_SMURFING, "severity": "HIGH"},
        {"name": "RAPID_MOVEMENT_MULE", "query": CYPHER_RAPID_MOVEMENT, "severity": "HIGH"}
    ]
    
    try:
        cur.execute("LOAD 'age';")
        cur.execute("SET search_path = ag_catalog, public;")
        
        for rule in rules:
            logger.info(f"Executing Rule Strategy: {rule['name']}")
            cur.execute(rule["query"])
            hits = cur.fetchall()
            
            if hits:
                logger.warning(f"Engine fired {len(hits)} alerts for {rule['name']}")
                for hit in hits:
                    entity_id = hit[0]
                    tx_hashes = hit[1]
                    cur.execute(
                        "INSERT INTO ag_catalog.alerts (alert_type, severity, trigger_entity, related_transactions) VALUES (%s, %s, %s, %s)", 
                        (rule['name'], rule['severity'], str(entity_id), json.dumps(tx_hashes))
                    )
        
        conn.commit()
    finally:
        cur.close()
        conn.close()
                
    logger.info("Rule Engine evaluation complete.")

if __name__ == "__main__":
    execute_rules_and_sink_alerts()

