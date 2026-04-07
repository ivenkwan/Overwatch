import os
import logging
import json
import psycopg2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aml-cypher-rule-engine")

# ==========================================
# PHASE 4: OPENCYPHER RULE TEMPLATES
# ==========================================

from typologies import TYPOLOGIES

def get_db_connection():
    # Production: Use Environment Variables
    return psycopg2.connect(
        host="localhost",
        port=5432,
        database="aml_platform",
        user="aml_admin", 
        password=os.getenv("DB_PASSWORD", "aml_secure_api_password")
    )

def execute_rules_and_sink_alerts():
    logger.info("Starting OpenCypher Rule Engine evaluation...")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("LOAD 'age';")
        cur.execute("SET search_path = ag_catalog, public;")
        
        for rule in TYPOLOGIES:
            logger.info(f"Executing Rule Strategy: {rule['name']}")
            try:
                cur.execute(rule["query"])
                hits = cur.fetchall()
                
                if hits:
                    logger.warning(f"Engine fired {len(hits)} alerts for {rule['name']}")
                    for hit in hits:
                        entity_id = hit[0]
                        tx_hashes = hit[1]
                        # Evidentiary Sink
                        cur.execute(
                            "INSERT INTO ag_catalog.alerts (alert_type, severity, trigger_entity, related_transactions) VALUES (%s, %s, %s, %s)", 
                            (rule['name'], rule['severity'], str(entity_id), json.dumps(tx_hashes))
                        )
            except Exception as e:
                logger.error(f"Rule {rule['name']} failed: {str(e)}")
                conn.rollback() # Don't halt entire engine for one bad rule
                continue
        
        conn.commit()
    finally:
        cur.close()
        conn.close()
                
    logger.info("Rule Engine evaluation complete.")

if __name__ == "__main__":
    execute_rules_and_sink_alerts()

