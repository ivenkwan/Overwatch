from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.services import pii_service
from app.core import auth
from app.db.session import get_db
import asyncpg

router = APIRouter()

@router.get("/feed")
async def get_monitoring_feed(
    current_user: dict = Depends(auth.get_current_user),
    limit: int = 150,
    db: asyncpg.Connection = Depends(get_db)
):
    # Fetch real-time ledgers sorted by txn_date desc
    query = """
        SELECT txn_hash, customer_num, counterparty_id, txn_date, txn_ref_no, 
               txn_country, txn_currency, txn_currency_amount, txn_amount_in_hkd, 
               cdi_code, txn_type 
        FROM core.transactions
        ORDER BY txn_date DESC 
        LIMIT $1
    """
    rows = await db.fetch(query, limit)
    feed = [dict(row) for row in rows]
    return pii_service.mask_pii(feed, current_user["role"])

@router.get("/")
async def get_alerts(
    current_user: dict = Depends(auth.get_current_user),
    status: str = 'OPEN',
    limit: int = 100,
    db: asyncpg.Connection = Depends(get_db)
):
    query = "SELECT * FROM core.transactions LIMIT $1" # Dummy implementation using core.transactions since ag_catalog.alerts doesn't exist
    rows = await db.fetch(query, limit)
    alerts = [dict(row) for row in rows]
    return pii_service.mask_pii(alerts, current_user["role"])

@router.get("/{alert_id}")
async def get_alert_detail(
    alert_id: str,
    current_user: dict = Depends(auth.get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    query = "SELECT * FROM core.transactions WHERE txn_hash = $1"
    row = await db.fetchrow(query, alert_id)
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert = dict(row)
    
    if current_user["role"] in ["SENIOR_INVESTIGATOR", "DEPARTMENT_HEAD"]:
        await auth.log_unmasking_event(current_user["id"], "ALERT", str(alert_id))
        
    return pii_service.mask_pii(alert, current_user["role"])

@router.post("/{alert_id}/assign")
async def assign_alert(alert_id: str, current_user: dict = Depends(auth.get_current_user), db: asyncpg.Connection = Depends(get_db)):
    # Dummy mock
    return {"status": "assigned"}

@router.post("/{alert_id}/propose-close")
async def propose_close(alert_id: str, notes: str, current_user: dict = Depends(auth.get_current_user), db: asyncpg.Connection = Depends(get_db)):
    # Dummy mock
    return {"status": "proposed"}

@router.post("/{alert_id}/approve")
async def approve_close(alert_id: str, current_user: dict = Depends(auth.get_current_user_with_scope("SENIOR_INVESTIGATOR")), db: asyncpg.Connection = Depends(get_db)):
    return {"status": "approved"}

@router.post("/{alert_id}/reject")
async def reject_close(alert_id: str, notes: str, current_user: dict = Depends(auth.get_current_user_with_scope("SENIOR_INVESTIGATOR")), db: asyncpg.Connection = Depends(get_db)):
    if not notes or len(notes.strip()) < 5:
        raise HTTPException(status_code=400, detail="Mandatory notes required for rejection.")
    return {"status": "rejected"}
