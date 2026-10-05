from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.schemas.auth_schema import UserLogin
from app.helpers.password_helper import hash_password, verify_password
from app.helpers.jwt_helper import create_access_token


class AuthService:
    """
    Service containing authentication, registration, and credential validation logic.
    """

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Queries the database for an existing user with the provided email."""
        return db.query(User).filter(User.email == email.lower().strip()).first()

    @staticmethod
    def register_user(db: Session, user_data: UserCreate) -> User:
        """
        Validates email uniqueness, hashes password, and persists new user to the database.
        """
        normalized_email = user_data.email.lower().strip()
        existing_user = AuthService.get_user_by_email(db, normalized_email)

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )

        # Hash the plain-text password using bcrypt
        hashed_password = hash_password(user_data.password)

        new_user = User(
            name=user_data.name.strip(),
            email=normalized_email,
            password_hash=hashed_password
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """
        Validates user credentials against stored bcrypt hash.
        
        :raises HTTPException: 401 Unauthorized on invalid email or password.
        """
        user = AuthService.get_user_by_email(db, email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    @staticmethod
    def login_user(db: Session, login_data: UserLogin) -> Dict[str, Any]:
        """
        Handles login authentication and JWT token creation.
        """
        user = AuthService.authenticate_user(db, login_data.email, login_data.password)
        
        # Build token payload with user ID ('sub') and email
        token_payload = {
            "sub": str(user.id),
            "email": user.email,
            "name": user.name
        }
        access_token = create_access_token(data=token_payload)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
