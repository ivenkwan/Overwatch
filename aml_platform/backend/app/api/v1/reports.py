from fastapi import APIRouter, Depends, HTTPException
from app.core import auth
from app.db.session import get_db

router = APIRouter()

@router.get("/monthly")
async def get_monthly_report(
    current_user: dict = Depends(auth.get_current_user_with_scope("DEPARTMENT_HEAD")),
    db=Depends(get_db)
):
    """
    Generate KPIs and Case Management metrics for the Department Head dashboard.
    """
    cursor = db.cursor()
    try:
        # Aggregated Status Counts
        cursor.execute("SELECT status, COUNT(*) FROM ag_catalog.alerts GROUP BY status")
        status_counts = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Senior Investigator Approvals (Checkers)
        cursor.execute(
            """
            SELECT u.username, COUNT(a.id) 
            FROM ag_catalog.alerts a
            JOIN public.users u ON a.checker_id = u.id
            WHERE a.status = 'CLOSED'
            GROUP BY u.username
            """
        )
        checker_metrics = [{"investigator": row[0], "approved_cases": row[1]} for row in cursor.fetchall()]
        
        return {
            "status_metrics": status_counts,
            "checker_metrics": checker_metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
