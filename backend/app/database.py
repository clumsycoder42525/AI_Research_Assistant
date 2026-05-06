from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# We use SQLite as a fallback if DATABASE_URL is not set
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app_v2.db")

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def apply_migrations():
    """Apply Alembic migrations programmatically."""
    from alembic.config import Config
    from alembic import command
    import os
    
    # Path to the backend directory where alembic.ini is
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    alembic_cfg = Config(os.path.join(base_dir, "alembic.ini"))
    
    print("Checking database migrations...")
    try:
        # Run the upgrade
        command.upgrade(alembic_cfg, "head")
        print("Database migrations applied successfully.")
        return True
    except Exception as e:
        print(f"Alembic migration failed: {e}. Attempting fallback...")
        return sync_schema_fallback()

def sync_schema_fallback():
    """Manual fallback to add missing columns if Alembic fails."""
    from sqlalchemy import inspect, text
    inspector = inspect(engine)
    
    try:
        # Check 'chats' table for 'project_id'
        columns = [c['name'] for c in inspector.get_columns('chats')]
        if 'project_id' not in columns:
            print("Fallback: Adding project_id to chats table...")
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE chats ADD COLUMN project_id INTEGER REFERENCES projects(id)"))
                conn.commit()
            print("Fallback successful.")
        return True
    except Exception as e:
        print(f"Fallback sync failed: {e}")
        return False
