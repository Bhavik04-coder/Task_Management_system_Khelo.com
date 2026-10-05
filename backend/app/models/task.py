from typing import Optional, TYPE_CHECKING
from datetime import date
from sqlalchemy import BigInteger, Integer, String, Text, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User

# Enum values for Task Status and Priority
TASK_STATUSES = ("Pending", "In Progress", "Completed")
TASK_PRIORITIES = ("Low", "Medium", "High")


class Task(Base, TimestampMixin):
    """
    SQLAlchemy ORM Model representing the 'tasks' database table.
    """
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        primary_key=True,
        autoincrement=True,
        index=True
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    status: Mapped[str] = mapped_column(
        SQLEnum(*TASK_STATUSES, name="task_status_enum", native_enum=False, length=50),
        default="Pending",
        nullable=False,
        index=True
    )
    priority: Mapped[str] = mapped_column(
        SQLEnum(*TASK_PRIORITIES, name="task_priority_enum", native_enum=False, length=50),
        default="Medium",
        nullable=False,
        index=True
    )
    due_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
        index=True
    )
    user_id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # N:1 Relationship - Task belongs to User
    user: Mapped["User"] = relationship(
        "User",
        back_populates="tasks"
    )

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title='{self.title}', status='{self.status}', priority='{self.priority}', user_id={self.user_id})>"
