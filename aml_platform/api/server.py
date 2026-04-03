from fastapi import FastAPI, Depends, Request, HTTPException
import logging
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

# Initialize API
app = FastAPI(title="AML Platform Engine API", version="1.0")

# Setup strict audit logging
logging.basicConfig(level=logging.INFO)
audit_logger = logging.getLogger("aml_api_audit_log")

# ==========================================
# PHASE 5: RBAC & AUDIT COMPLIANCE
# ==========================================

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        database="aml_platform",
        user="aml_admin",
        password="secure_password_123",
        cursor_factory=RealDictCursor
    )

def verify_rbac(request: Request):
    """
    Mocks JWT decoding and Role-Based Access Control logic.
    For this demo, we use a simple header check.
    """
    token = request.headers.get("Authorization")
    if not token or token != "Bearer compliance_analyst_token":
        raise HTTPException(status_code=403, detail="Unrecognized or missing compliance token")
    
    return {"user_id": "aml_investigator_44", "role": "SENIOR_ANALYST"}

def log_audit_action(user: dict, action: str, target: str):
    timestamp = datetime.datetime.now().isoformat()
    audit_logger.info(f"AUDIT LOG | TIME: {timestamp} | USER: {user['user_id']} | ACTION: {action} | TARGET_DATA: {target}")

# ==========================================
# PHASE 5: ANALYST UI ENDPOINTS
# ==========================================

@app.get("/api/v1/alerts")
def get_prioritized_alerts(user: dict = Depends(verify_rbac)):
    log_audit_action(user, "VIEW_ALERTS_WORKSPACE", "all_open_alerts")
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM ag_catalog.alerts WHERE status = 'OPEN' ORDER BY severity DESC;")
        alerts = cur.fetchall()
        return {"status": "success", "data": alerts}
    finally:
        cur.close()
        conn.close()

@app.get("/api/v1/graph/explore/{entity_id}")
def explore_subgraph(entity_id: str, depth: int = 1, user: dict = Depends(verify_rbac)):
    log_audit_action(user, "GRAPH_EXPANSION_QUERY", f"Entity:{entity_id} | TraversalDepth:{depth}")
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("LOAD 'age';")
        cur.execute("SET search_path = ag_catalog, public;")
        
        # Simple localized graph extraction
        cypher = f"""
        SELECT * FROM cypher('aml_network', $$
            MATCH (a {{id: '{entity_id}'}})-[t:Transfer*1..{depth}]-(b)
            RETURN a, t, b
        $$) as (a agtype, t agtype, b agtype);
        """
        cur.execute(cypher)
        results = cur.fetchall()
        
        # Translation to Cytoscape format simplified
        nodes = [{"data": {"id": entity_id, "label": entity_id}}]
        edges = []
        seen_nodes = {entity_id}
        
        for row in results:
            # AGE returns complex AgType objects
            # For this MVP we just push IDs
            pass 
            
        return {"status": "success", "raw_traversal": results}
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

