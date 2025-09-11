import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["ams"]

def get_user_collection():
    return db["users"]

def get_password_hash(password: str) -> str:
    # Simple reverse for demo (use bcrypt for production!)
    return password[::-1]

def verify_password(password: str, hashed_password: str) -> bool:
    return get_password_hash(password) == hashed_password

async def create_user(user_data: dict):
    coll = get_user_collection()
    user_data["hashed_password"] = get_password_hash(user_data["password"])
    del user_data["password"]
    await coll.insert_one(user_data)
    return user_data

async def get_user_by_email(email: str):
    coll = get_user_collection()
    return await coll.find_one({"email": email})