from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserUpdate
from app.helpers.password_helper import hash_password


class UserService:
    """
    Service handling user profile retrieval and updates.
    """

    @staticmethod
    def get_user_profile(user: User) -> User:
        """Returns the current user profile."""
        return user

    @staticmethod
    def update_user_profile(
        db: Session,
        current_user: User,
        update_data: UserUpdate
    ) -> User:
        """
        Updates the profile of the authenticated user.
        
        :param db: Database session.
        :param current_user: Currently authenticated User.
        :param update_data: Validated UserUpdate schema.
        :return: Updated User instance.
        """
        if update_data.name is not None:
            current_user.name = update_data.name.strip()

        if update_data.email is not None:
            new_email = update_data.email.lower().strip()
            if new_email != current_user.email:
                # Check if new email is already taken by another account
                existing = db.query(User).filter(
                    User.email == new_email,
                    User.id != current_user.id
                ).first()
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="This email address is already in use by another account."
                    )
                current_user.email = new_email

        if update_data.password is not None and update_data.password.strip():
            current_user.password_hash = hash_password(update_data.password)

        db.commit()
        db.refresh(current_user)
        return current_user
