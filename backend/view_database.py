"""
Simple script to view database contents
Run: python view_database.py
"""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "task_management.db"

def view_database():
    """Display all data from the database"""
    
    if not DB_PATH.exists():
        print("❌ Database not found!")
        print(f"Expected location: {DB_PATH}")
        return
    
    print("=" * 80)
    print(f"📊 DATABASE: {DB_PATH}")
    print(f"📁 Size: {DB_PATH.stat().st_size / 1024:.2f} KB")
    print("=" * 80)
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Access columns by name
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"\n📋 Tables in database: {', '.join(tables)}\n")
    
    # Display USERS table
    print("=" * 80)
    print("👥 USERS TABLE")
    print("=" * 80)
    cursor.execute("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC")
    users = cursor.fetchall()
    
    if users:
        print(f"\n{'ID':<5} {'Name':<20} {'Email':<30} {'Created At':<20}")
        print("-" * 80)
        for user in users:
            print(f"{user['id']:<5} {user['name']:<20} {user['email']:<30} {user['created_at']:<20}")
        print(f"\n✅ Total Users: {len(users)}")
    else:
        print("\n⚠️  No users found. Register a user in the app first!")
    
    # Display TASKS table
    print("\n" + "=" * 80)
    print("📝 TASKS TABLE")
    print("=" * 80)
    cursor.execute("""
        SELECT t.id, t.title, t.status, t.priority, t.due_date, 
               u.name as user_name, t.created_at 
        FROM tasks t 
        LEFT JOIN users u ON t.user_id = u.id 
        ORDER BY t.created_at DESC
    """)
    tasks = cursor.fetchall()
    
    if tasks:
        print(f"\n{'ID':<5} {'Title':<25} {'Status':<12} {'Priority':<10} {'User':<15} {'Due Date':<12}")
        print("-" * 100)
        for task in tasks:
            print(f"{task['id']:<5} {task['title'][:24]:<25} {task['status']:<12} "
                  f"{task['priority']:<10} {task['user_name']:<15} {str(task['due_date'] or 'N/A'):<12}")
        print(f"\n✅ Total Tasks: {len(tasks)}")
    else:
        print("\n⚠️  No tasks found. Create a task in the app first!")
    
    # Statistics
    print("\n" + "=" * 80)
    print("📊 STATISTICS")
    print("=" * 80)
    
    cursor.execute("SELECT COUNT(*) as count FROM users")
    user_count = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM tasks")
    task_count = cursor.fetchone()['count']
    
    cursor.execute("SELECT status, COUNT(*) as count FROM tasks GROUP BY status")
    status_stats = cursor.fetchall()
    
    print(f"\n👥 Total Users: {user_count}")
    print(f"📝 Total Tasks: {task_count}")
    
    if status_stats:
        print("\n📈 Tasks by Status:")
        for stat in status_stats:
            print(f"   • {stat['status']}: {stat['count']}")
    
    conn.close()
    print("\n" + "=" * 80)
    print("✅ Database inspection complete!")
    print("=" * 80)

if __name__ == "__main__":
    try:
        view_database()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
