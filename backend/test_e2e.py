"""
Task Management System - End-to-End System Integration & Verification Test Suite
Tests all layers: Routes -> Controllers -> Services -> ORM Models -> Database -> JWT Security
"""
import sys
from datetime import date, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.base import Base
from app.database.database import get_db

# 1. Initialize in-memory SQLite database
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
Base.metadata.create_all(bind=test_engine)
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def run_e2e_tests():
    print("=" * 70)
    print("RUNNING FULL-STACK TASK MANAGEMENT SYSTEM E2E VERIFICATION SUITE")
    print("=" * 70)

    # TEST 1: Health Check Endpoint
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    assert res.json()["success"] is True
    print("[PASS] 1. Health Check Endpoint (/health)")

    # TEST 2: User Registration (User 1)
    user1_payload = {
        "name": "Sarah Connor",
        "email": "sarah@cyberdyne.com",
        "password": "ResistancePassword2026!"
    }
    res = client.post("/api/auth/register", json=user1_payload)
    assert res.status_code == 201, f"Registration failed: {res.text}"
    user1_data = res.json()["data"]["user"]
    assert user1_data["email"] == user1_payload["email"]
    assert "password_hash" not in user1_data, "Sensitive password_hash leaked!"
    print(f"[PASS] 2. User Registration (id={user1_data['id']}, email={user1_data['email']})")

    # TEST 3: Duplicate Email Prevention
    res = client.post("/api/auth/register", json=user1_payload)
    assert res.status_code == 400, "Duplicate email should return 400 Bad Request"
    print("[PASS] 3. Duplicate Email Prevention (400 Bad Request)")

    # TEST 4: User Login & JWT Issuance
    res = client.post("/api/auth/login", json={
        "email": user1_payload["email"],
        "password": user1_payload["password"]
    })
    assert res.status_code == 200, f"Login failed: {res.text}"
    login_data = res.json()["data"]
    token1 = login_data["access_token"]
    assert login_data["token_type"] == "bearer"
    assert len(token1) > 20
    headers1 = {"Authorization": f"Bearer {token1}"}
    print("[PASS] 4. User Login & Signed JWT Token Issuance")

    # TEST 5: Get Current User Profile (Protected Route)
    res = client.get("/api/users/me", headers=headers1)
    assert res.status_code == 200
    assert res.json()["data"]["user"]["name"] == user1_payload["name"]
    print("[PASS] 5. Protected Profile Retrieval (GET /api/users/me)")

    # TEST 6: Update User Profile
    res = client.put("/api/users/me", json={"name": "Sarah Connor (Leader)"}, headers=headers1)
    assert res.status_code == 200
    assert res.json()["data"]["user"]["name"] == "Sarah Connor (Leader)"
    print("[PASS] 6. Profile Update (PUT /api/users/me)")

    # TEST 7: Register & Login Secondary User (For Multi-Tenant Isolation Testing)
    user2_payload = {
        "name": "John Connor",
        "email": "john@cyberdyne.com",
        "password": "FutureLeaderPassword!"
    }
    client.post("/api/auth/register", json=user2_payload)
    token2 = client.post("/api/auth/login", json={
        "email": user2_payload["email"],
        "password": user2_payload["password"]
    }).json()["data"]["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}
    print("[PASS] 7. Secondary User Registered & Authenticated")

    # TEST 8: Create Multiple Tasks for User 1
    today = date.today()
    tomorrow = (today + timedelta(days=1)).isoformat()
    yesterday = (today - timedelta(days=1)).isoformat()

    tasks_to_create = [
        {"title": "Deploy FastAPI Backend", "description": "Configure MySQL and Alembic migrations", "status": "In Progress", "priority": "High", "due_date": tomorrow},
        {"title": "Build React Dashboard", "description": "Implement Tailwind CSS components and metrics", "status": "Pending", "priority": "High", "due_date": tomorrow},
        {"title": "Write API Documentation", "description": "Export Postman collection and README", "status": "Completed", "priority": "Low", "due_date": yesterday},
        {"title": "Overdue Security Audit", "description": "Review JWT secret and password hashing", "status": "Pending", "priority": "Medium", "due_date": yesterday},
    ]

    created_task_ids = []
    for t_data in tasks_to_create:
        res = client.post("/api/tasks", json=t_data, headers=headers1)
        assert res.status_code == 201, f"Task creation failed: {res.text}"
        created_task_ids.append(res.json()["data"]["task"]["id"])
    print(f"[PASS] 8. Seeded {len(created_task_ids)} Tasks for User 1")

    # TEST 9: Multi-Tenant Data Isolation
    user2_tasks = client.get("/api/tasks", headers=headers2).json()["data"]["tasks"]
    assert len(user2_tasks) == 0, "User 2 should see 0 tasks owned by User 1"
    
    # User 2 attempting to access User 1's task should return 404
    unauthorized_task_access = client.get(f"/api/tasks/{created_task_ids[0]}", headers=headers2)
    assert unauthorized_task_access.status_code == 404, "User 2 must not be able to read User 1 task"
    print("[PASS] 9. Multi-Tenant User Isolation Enforced (404 on cross-user access)")

    # TEST 10: Task Filtering by Status & Priority
    pending_res = client.get("/api/tasks?status=Pending", headers=headers1).json()["data"]["tasks"]
    assert len(pending_res) == 2
    high_res = client.get("/api/tasks?priority=High", headers=headers1).json()["data"]["tasks"]
    assert len(high_res) == 2
    print("[PASS] 10. Dynamic Filtering by Status and Priority")

    # TEST 11: Free-Text Search
    search_res = client.get("/api/tasks?search=Alembic", headers=headers1).json()["data"]["tasks"]
    assert len(search_res) == 1
    assert search_res[0]["title"] == "Deploy FastAPI Backend"
    print("[PASS] 11. Keyword Search in Title and Description")

    # TEST 12: Dashboard Summary Analytics (COUNT Aggregations)
    stats = client.get("/api/tasks/stats", headers=headers1).json()["data"]["stats"]
    assert stats["total_tasks"] == 4
    assert stats["pending_tasks"] == 2
    assert stats["in_progress_tasks"] == 1
    assert stats["completed_tasks"] == 1
    assert stats["high_priority_tasks"] == 2
    assert stats["overdue_tasks"] == 1
    print(f"[PASS] 12. Dashboard Analytics Aggregation verified: {stats}")

    # TEST 13: ORM Join with User (GET /api/tasks/{id})
    single_task = client.get(f"/api/tasks/{created_task_ids[0]}", headers=headers1).json()["data"]["task"]
    assert single_task["user"]["email"] == user1_payload["email"]
    print(f"[PASS] 13. Single Task with Eager ORM Join (Owner: {single_task['user']['name']})")

    # TEST 14: Patch Task Status (Atomic Update)
    patch_res = client.patch(f"/api/tasks/{created_task_ids[1]}/status", json={"status": "Completed"}, headers=headers1)
    assert patch_res.status_code == 200
    assert patch_res.json()["data"]["task"]["status"] == "Completed"
    print("[PASS] 14. Atomic Status Patching (PATCH /api/tasks/{id}/status)")

    # TEST 15: Delete Task
    del_res = client.delete(f"/api/tasks/{created_task_ids[0]}", headers=headers1)
    assert del_res.status_code == 200
    assert client.get(f"/api/tasks/{created_task_ids[0]}", headers=headers1).status_code == 404
    print("[PASS] 15. Task Deletion (DELETE /api/tasks/{id})")

    # TEST 16: Unauthenticated Request Rejection
    unauth = client.get("/api/tasks")
    assert unauth.status_code in (401, 403), "Protected route without header must be rejected"
    print("[PASS] 16. Security Guard: Unauthenticated requests rejected")

    # TEST 17: User Logout
    logout_res = client.post("/api/auth/logout", headers=headers1)
    assert logout_res.status_code == 200
    print("[PASS] 17. User Session Logout (POST /api/auth/logout)")

    print("=" * 70)
    print("ALL 17 INTEGRATION & SECURITY TESTS PASSED PERFECTLY!")
    print("=" * 70)


if __name__ == "__main__":
    run_e2e_tests()
