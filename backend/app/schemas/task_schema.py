from datetime import datetime, date
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user_schema import UserResponse


class TaskStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"


class TaskPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class TaskBase(BaseModel):
    """Base task fields shared across schemas."""
    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, description="Detailed task description")
    status: TaskStatus = Field(default=TaskStatus.PENDING, description="Task status")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority level")
    due_date: Optional[date] = Field(None, description="Task due date (YYYY-MM-DD)")


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    pass


class TaskUpdate(BaseModel):
    """Schema for updating an existing task (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[date] = None


class TaskStatusUpdate(BaseModel):
    """Schema for updating only the status of a task."""
    status: TaskStatus = Field(..., description="New task status")


class TaskResponse(TaskBase):
    """Schema for task response objects."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskDetailResponse(TaskResponse):
    """Schema for detailed task with joined owner information."""
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


class TaskListResponseData(BaseModel):
    """Schema for paginated task listing."""
    tasks: List[TaskResponse]
    total: int
    page: int
    limit: int


class TaskStatsResponseData(BaseModel):
    """Schema for dashboard summary metrics."""
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int
    high_priority_tasks: int
    overdue_tasks: int
