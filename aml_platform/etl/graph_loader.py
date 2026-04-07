import os
import logging
import psycopg2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aml-graph-builder")

# ==========================================
# PHASE 3: GRAPH CONSTRUCTION PIPELINE
# ==========================================

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        database="aml_platform",
        user="aml_admin",
        password=os.getenv("DB_PASSWORD", "aml_secure_api_password")
    )

def get_super_nodes(cur):
    """
    Fetches the super-nodes from the relational database.
    """
    cur.execute("SELECT node_id FROM ag_catalog.super_nodes;")
    return [row[0] for row in cur.fetchall()]

def promote_fiat_to_graph(cur, super_nodes):
    """
    Translates tabular SCREENED fiat elements into openCypher MERGE commands.
    """
    cur.execute("SELECT transfer_id, sender_account, receiver_account, amount_usd, transaction_timestamp FROM ag_catalog.staging_fiat_raw WHERE status = 'SCREENED';")
    records = cur.fetchall()
    
    for record in records:
        transfer_id, sender, receiver, amount, timestamp = record
        sender_lbl = "SuperNode" if sender in super_nodes else "Entity"
        rec_lbl = "SuperNode" if receiver in super_nodes else "Entity"

        cypher = f"""
        SELECT * FROM cypher('aml_network', $$
            MERGE (s:{sender_lbl} {{id: '{sender}', system: 'FIAT'}})
            MERGE (r:{rec_lbl} {{id: '{receiver}', system: 'FIAT'}})
            CREATE (s)-[t:Transfer {{
                amount_usd: {amount},
                timestamp: '{timestamp}',
                ref_id: '{transfer_id}'
            }}]->(r)
        $$) as (v agtype);
        """
        cur.execute(cypher)
        
    cur.execute("UPDATE ag_catalog.staging_fiat_raw SET status = 'GRAPHED' WHERE status = 'SCREENED';")
    logger.info(f"Promoted {len(records)} FIAT records to graph.")

def promote_crypto_to_graph(cur, super_nodes):
    """
    Translates Tabular SCREENED crypto elements into openCypher MERGE commands.
    """
    cur.execute("SELECT tx_hash, sender_wallet, receiver_wallet, volume_usd, network, asset_id, transaction_timestamp FROM ag_catalog.staging_crypto_raw WHERE status = 'SCREENED';")
    records = cur.fetchall()
    
    for record in records:
        tx_hash, sender, receiver, amount, network, asset, timestamp = record
        sender_lbl = "SuperNode" if sender in super_nodes else "Entity"
        rec_lbl = "SuperNode" if receiver in super_nodes else "Entity"

        cypher = f"""
        SELECT * FROM cypher('aml_network', $$
            MERGE (s:{sender_lbl} {{id: '{sender}', system: '{network}'}})
            MERGE (r:{rec_lbl} {{id: '{receiver}', system: '{network}'}})
            CREATE (s)-[t:Transfer {{
                amount_usd: {amount},
                asset: '{asset}',
                timestamp: '{timestamp}',
                ref_id: '{tx_hash}'
            }}]->(r)
        $$) as (v agtype);
        """
        cur.execute(cypher)
        
    cur.execute("UPDATE ag_catalog.staging_crypto_raw SET status = 'GRAPHED' WHERE status = 'SCREENED';")
    logger.info(f"Promoted {len(records)} CRYPTO records to graph.")

def run_graph_promotion():
    logger.info("=== Starting Graph Construction Pipeline ===")
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Load AGE extension and set search path
        cur.execute("LOAD 'age';")
        cur.execute("SET search_path = ag_catalog, public;")
        
        super_nodes = get_super_nodes(cur)
        promote_fiat_to_graph(cur, super_nodes)
        promote_crypto_to_graph(cur, super_nodes)
        
        conn.commit()
    finally:
        cur.close()
        conn.close()
        
    logger.info("=== Graph Construction Completed ===")

if __name__ == "__main__":
    run_graph_promotion()

