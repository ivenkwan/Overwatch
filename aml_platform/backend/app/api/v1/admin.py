from fastapi import APIRouter, Depends, HTTPException, status
from app.core import auth
from app.schemas.user import UserCreate, UserOut
from app.db.session import get_db

router = APIRouter()

@router.post("/users", response_model=UserOut)
async def create_user(
    user_in: UserCreate,
    current_user: dict = Depends(auth.get_current_user_with_scope("ADMIN")),
    db=Depends(get_db)
):
    """
    Create a new user. Only available to ADMINs.
    """
    hashed_password = auth.get_password_hash(user_in.password)
    
    cursor = db.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO public.users (username, email, hashed_password, role)
            VALUES (%s, %s, %s, %s)
            RETURNING id, username, email, role, is_active, created_at
            """,
            (user_in.username, user_in.email, hashed_password, user_in.role)
        )
        new_user = cursor.fetchone()
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")
        
    return {
        "id": new_user[0],
        "username": new_user[1],
        "email": new_user[2],
        "role": new_user[3],
        "is_active": new_user[4],
        "created_at": new_user[5]
    }
