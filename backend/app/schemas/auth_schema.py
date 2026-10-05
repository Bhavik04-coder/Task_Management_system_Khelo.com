from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.user_schema import UserResponse


class UserLogin(BaseModel):
    """Schema for user login credentials."""
    email: EmailStr = Field(..., description="User's registered email")
    password: str = Field(..., description="User password")


class TokenResponseData(BaseModel):
    """Data payload returned upon successful login."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class RegisterResponseData(BaseModel):
    """Data payload returned upon successful registration."""
    user: UserResponse
