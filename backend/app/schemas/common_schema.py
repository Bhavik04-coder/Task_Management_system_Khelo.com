from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """
    Standard generic API response schema adhering to the API contract:
    {
        "success": True/False,
        "message": "Human readable message",
        "data": { ... }
    }
    """
    success: bool
    message: str
    data: Optional[T] = None


class ErrorResponse(BaseModel):
    """
    Standard error response schema:
    {
        "success": False,
        "message": "Error description",
        "errors": [ ... ] or None
    }
    """
    success: bool = False
    message: str
    errors: Optional[Any] = None
