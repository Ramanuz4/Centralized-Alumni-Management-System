import json
import hashlib
import os
from datetime import datetime
from typing import Dict, Any

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError:
    print("Missing dependencies. Install with: pip install fastapi uvicorn")
    exit(1)

app = FastAPI(title="Alumni Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_FILE = "users.txt"

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    batch: str
    department: str
    password: str
    registrationDate: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def load_users() -> Dict[str, Dict[str, Any]]:
    users = {}
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line:
                        user = json.loads(line)
                        users[user['email']] = user
        except Exception as e:
            print(f"Error reading users: {e}")
    return users

def save_user(user: Dict[str, Any]) -> bool:
    try:
        with open(USERS_FILE, 'a', encoding='utf-8') as f:
            f.write(json.dumps(user) + '\n')
        return True
    except Exception as e:
        print(f"Error saving user: {e}")
        return False

@app.get("/")
async def root():
    return {"message": "Alumni Management System Backend", "status": "running"}

@app.post("/auth/login")
async def login(request: LoginRequest):
    users = load_users()
    user = users.get(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user['password'] != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "message": "Login successful",
        "email": user['email'],
        "name": f"{user['firstName']} {user['lastName']}"
    }

@app.post("/auth/register")
async def register(request: RegisterRequest):
    users = load_users()
    if request.email in users:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    user_data = {
        "firstName": request.firstName,
        "lastName": request.lastName,
        "email": request.email,
        "phone": request.phone,
        "batch": request.batch,
        "department": request.department,
        "password": hash_password(request.password),
        "registrationDate": request.registrationDate,
        "createdAt": datetime.now().isoformat()
    }
    if not save_user(user_data):
        raise HTTPException(status_code=500, detail="Failed to create user")
    return {"message": "Registration successful", "email": request.email}

@app.get("/users")
async def get_users():
    users = load_users()
    safe_users = []
    for email, user in users.items():
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        safe_users.append(safe_user)
    return {"users": safe_users, "total": len(safe_users)}

@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now().isoformat()}

if __name__ == "__main__":
    print("Starting Alumni Management System Backend...")
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w') as f:
            pass
        print(f"Created {USERS_FILE}")
    print("Backend starting at http://127.0.0.1:8000")
    print("API docs at http://127.0.0.1:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)