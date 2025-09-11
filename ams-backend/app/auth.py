from fastapi import APIRouter, HTTPException, Request
from .database import (
    get_user_collection,
    get_password_hash,
    verify_password,
    create_user,
    get_user_by_email
)
router = APIRouter()

@router.post("/register")
async def register_user(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    phone = data.get("phone")
    batch = data.get("batch")
    department = data.get("department")
    if not all([email, password, first_name, last_name, phone, batch, department]):
        raise HTTPException(status_code=400, detail="All fields required")
    if await get_user_by_email(email):
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = await create_user({
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
        "phone": phone,
        "batch": batch,
        "department": department,
        "registrationDate": data.get("registrationDate")
    })
    return {"message": "User registered", "user": {"email": new_user["email"]}}

@router.post("/login")
async def login_user(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    user = await get_user_by_email(email)
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "message": "Login successful",
        "user": {
            "email": user["email"],
            "firstName": user.get("first_name", ""),
            "lastName": user.get("last_name", ""),
            "batch": user.get("batch", ""),
            "department": user.get("department", ""),
        }
    }