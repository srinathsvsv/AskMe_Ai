from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db

from app.models.user import User

from app.schemas.auth import (
    RegisterSchema,
    LoginSchema,
    TokenResponse
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# REGISTER
@router.post("/register")
async def register(
    payload: RegisterSchema,
    db: AsyncSession = Depends(get_db)
):
    try:
        # CHECK EMAIL
        existing_email = await db.execute(
            select(User).where(
                User.email == payload.email
            )
        )

        if existing_email.scalar_one_or_none():
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # CHECK USERNAME
        existing_username = await db.execute(
            select(User).where(
                User.username == payload.username
            )
        )

        if existing_username.scalar_one_or_none():
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )

        # CREATE USER
        user = User(
            username=payload.username,
            email=payload.email,
            hashed_password=hash_password(
                payload.password
            )
        )

        db.add(user)

        await db.commit()

        await db.refresh(user)

        return {
            "message": "User registered successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )


# LOGIN
@router.post(
    "/login",
    response_model=TokenResponse
)
async def login(
    payload: LoginSchema,
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(
            select(User).where(
                User.email == payload.email
            )
        )

        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not verify_password(
            payload.password,
            user.hashed_password
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        access_token = create_access_token({
            "sub": str(user.id),
            "role": user.role
        })

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )