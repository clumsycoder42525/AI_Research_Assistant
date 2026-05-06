from app import models, schemas, auth_utils
from app.database import SessionLocal, engine, Base

import traceback

try:
    print("Connecting to DB")
    db = SessionLocal()
    
    print("Querying users")
    users = db.query(models.User).all()
    print(f"Users found: {len(users)}")
    
    print("Attempting to hash password")
    pw = auth_utils.get_password_hash("pass123")
    print(f"Hashed: {pw}")
    
    print("Creating new user")
    user = models.User(username="python_test", email="pt@test.com", hashed_password=pw)
    db.add(user)
    db.commit()
    print("Done!")
except Exception as e:
    traceback.print_exc()
