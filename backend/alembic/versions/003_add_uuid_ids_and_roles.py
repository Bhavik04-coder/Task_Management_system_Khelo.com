"""replace integer identifiers with UUIDs and add user roles

Revision ID: 003_add_uuid_ids_and_roles
Revises: 002_create_tasks_table
"""
from typing import Sequence, Union
import uuid

from alembic import op
import sqlalchemy as sa

revision: str = "003_add_uuid_ids_and_roles"
down_revision: Union[str, None] = "002_create_tasks_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    connection = op.get_bind()
    users = connection.execute(sa.text(
        "SELECT id, name, email, password_hash, created_at, updated_at FROM users"
    )).mappings().all()
    tasks = connection.execute(sa.text(
        "SELECT id, title, description, status, priority, due_date, user_id, "
        "created_at, updated_at FROM tasks"
    )).mappings().all()

    user_ids = {row["id"]: str(uuid.uuid4()) for row in users}
    task_ids = {row["id"]: str(uuid.uuid4()) for row in tasks}

    op.drop_table("tasks")
    op.drop_table("users")

    op.create_table(
        "users",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", sa.String(20), nullable=False, server_default="user"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_role", "users", ["role"], unique=False)

    op.create_table(
        "tasks",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="Pending"),
        sa.Column("priority", sa.String(50), nullable=False, server_default="Medium"),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    for name, column in (
        ("ix_tasks_id", "id"),
        ("ix_tasks_status", "status"),
        ("ix_tasks_priority", "priority"),
        ("ix_tasks_due_date", "due_date"),
        ("ix_tasks_user_id", "user_id"),
    ):
        op.create_index(name, "tasks", [column], unique=False)

    for row in users:
        connection.execute(sa.text(
            "INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) "
            "VALUES (:id, :name, :email, :password_hash, 'user', :created_at, :updated_at)"
        ), {
            "id": user_ids[row["id"]],
            "name": row["name"],
            "email": row["email"],
            "password_hash": row["password_hash"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        })
    for row in tasks:
        connection.execute(sa.text(
            "INSERT INTO tasks (id, title, description, status, priority, due_date, user_id, "
            "created_at, updated_at) VALUES (:id, :title, :description, :status, :priority, "
            ":due_date, :user_id, :created_at, :updated_at)"
        ), {
            "id": task_ids[row["id"]],
            "title": row["title"],
            "description": row["description"],
            "status": row["status"],
            "priority": row["priority"],
            "due_date": row["due_date"],
            "user_id": user_ids[row["user_id"]],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        })


def downgrade() -> None:
    raise NotImplementedError("Downgrading UUID identifiers would lose identifier values.")
