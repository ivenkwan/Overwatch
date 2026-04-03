from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.services import pii_service
from app.core import auth
from app.db.session import get_db

router = APIRouter()

@router.get("/")
async def get_alerts(
    current_user: dict = Depends(auth.get_current_user),
    status: str = 'OPEN',
    limit: int = 100,
    db=Depends(get_db)
):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM ag_catalog.alerts WHERE status = %s LIMIT %s", (status, limit))
    cols = [desc[0] for desc in cursor.description]
    alerts = [dict(zip(cols, row)) for row in cursor.fetchall()]
    return pii_service.mask_pii(alerts, current_user["role"])

@router.get("/{alert_id}")
async def get_alert_detail(
    alert_id: int,
    current_user: dict = Depends(auth.get_current_user),
    db=Depends(get_db)
):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM ag_catalog.alerts WHERE id = %s", (alert_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    cols = [desc[0] for desc in cursor.description]
    alert = dict(zip(cols, row))
    
    if current_user["role"] in ["SENIOR_INVESTIGATOR", "DEPARTMENT_HEAD"]:
        await auth.log_unmasking_event(current_user["id"], "ALERT", str(alert_id))
        
    return pii_service.mask_pii(alert, current_user["role"])

@router.post("/{alert_id}/assign")
async def assign_alert(alert_id: int, current_user: dict = Depends(auth.get_current_user), db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE ag_catalog.alerts SET assigned_to = %s, status = 'INVESTIGATING' WHERE id = %s AND status = 'OPEN'", (current_user["id"], alert_id))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=400, detail="Cannot assign: Alert is not OPEN or doesn't exist.")
    return {"status": "assigned"}

@router.post("/{alert_id}/propose-close")
async def propose_close(alert_id: int, notes: str, current_user: dict = Depends(auth.get_current_user), db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE ag_catalog.alerts SET status = 'PENDING_APPROVAL', maker_id = %s, resolution_notes = %s WHERE id = %s AND assigned_to = %s", (current_user["id"], notes, alert_id, current_user["id"]))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=400, detail="Cannot propose close: Not assigned to you.")
    return {"status": "proposed"}

@router.post("/{alert_id}/approve")
async def approve_close(alert_id: int, current_user: dict = Depends(auth.get_current_user_with_scope("SENIOR_INVESTIGATOR")), db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT maker_id FROM ag_catalog.alerts WHERE id = %s AND status = 'PENDING_APPROVAL'", (alert_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=400, detail="Alert not pending approval.")
    
    maker_id = str(row[0])
    if str(current_user["id"]) == maker_id:
        raise HTTPException(status_code=403, detail="Maker cannot be Checker.")
        
    cursor.execute("UPDATE ag_catalog.alerts SET status = 'CLOSED', checker_id = %s WHERE id = %s", (current_user["id"], alert_id))
    db.commit()
    return {"status": "approved"}

@router.post("/{alert_id}/reject")
async def reject_close(alert_id: int, notes: str, current_user: dict = Depends(auth.get_current_user_with_scope("SENIOR_INVESTIGATOR")), db=Depends(get_db)):
    if not notes or len(notes.strip()) < 5:
        raise HTTPException(status_code=400, detail="Mandatory notes required for rejection.")
        
    cursor = db.cursor()
    cursor.execute("UPDATE ag_catalog.alerts SET status = 'INVESTIGATING', checker_notes = %s WHERE id = %s AND status = 'PENDING_APPROVAL'", (notes, alert_id))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=400, detail="Alert not pending approval.")
    return {"status": "rejected"}
