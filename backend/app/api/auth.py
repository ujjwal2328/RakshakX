"""
Authentication & Authorization API
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import settings

router = APIRouter()
security = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


# ── Schemas ──────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: "UserProfile"


class UserProfile(BaseModel):
    id: str
    username: str
    full_name: str
    email: str
    role: str
    role_display: str
    organization: str
    subsidiary: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ── Demo Users (replace with DB in production) ──────────────

DEMO_USERS = {
    "admin": {
        "id": "USR-001",
        "username": "admin",
        "password_hash": hash_password("admin123"),
        "full_name": "Dr. Rajesh Kumar",
        "email": "admin@cmpdi.co.in",
        "role": "system_admin",
        "role_display": "System Administrator",
        "organization": "CMPDI",
        "subsidiary": None,
        "department": "IT & Systems",
        "designation": "Chief Manager (Systems)",
    },
    "geologist": {
        "id": "USR-002",
        "username": "geologist",
        "password_hash": hash_password("geo123"),
        "full_name": "Dr. Priya Sharma",
        "email": "priya.sharma@cmpdi.co.in",
        "role": "geologist",
        "role_display": "Senior Geologist",
        "organization": "CMPDI",
        "subsidiary": "SECL",
        "department": "Geology",
        "designation": "Senior Geologist (Exploration)",
    },
    "mining_eng": {
        "id": "USR-003",
        "username": "mining_eng",
        "password_hash": hash_password("mine123"),
        "full_name": "Sh. Vikram Singh",
        "email": "vikram.singh@secl.co.in",
        "role": "mining_engineer",
        "role_display": "Mining Engineer",
        "organization": "CIL",
        "subsidiary": "SECL",
        "department": "Mining Operations",
        "designation": "Deputy Manager (Mining)",
    },
    "tech_officer": {
        "id": "USR-004",
        "username": "tech_officer",
        "password_hash": hash_password("tech123"),
        "full_name": "Sh. Anil Patel",
        "email": "anil.patel@ncl.co.in",
        "role": "technical_officer",
        "role_display": "Technical Officer",
        "organization": "CIL",
        "subsidiary": "NCL",
        "department": "Technical Services",
        "designation": "Manager (Technical)",
    },
    "analyst": {
        "id": "USR-005",
        "username": "analyst",
        "password_hash": hash_password("data123"),
        "full_name": "Smt. Meera Iyer",
        "email": "meera.iyer@cmpdi.co.in",
        "role": "data_analyst",
        "role_display": "Data Analyst",
        "organization": "CMPDI",
        "subsidiary": None,
        "department": "Data Analytics",
        "designation": "Senior Analyst",
    },
    "reviewer": {
        "id": "USR-006",
        "username": "reviewer",
        "password_hash": hash_password("rev123"),
        "full_name": "Sh. Suresh Reddy",
        "email": "suresh.reddy@cmpdi.co.in",
        "role": "report_reviewer",
        "role_display": "Report Reviewer",
        "organization": "CMPDI",
        "subsidiary": None,
        "department": "Quality & Review",
        "designation": "General Manager (Review)",
    },
    "management": {
        "id": "USR-007",
        "username": "management",
        "password_hash": hash_password("mgmt123"),
        "full_name": "Sh. Deepak Verma",
        "email": "deepak.verma@cil.co.in",
        "role": "management",
        "role_display": "Director (Technical)",
        "organization": "CIL",
        "subsidiary": None,
        "department": "Management",
        "designation": "Director (Technical)",
    },
    "admin_officer": {
        "id": "USR-008",
        "username": "admin_officer",
        "password_hash": hash_password("adm123"),
        "full_name": "Smt. Kavita Nair",
        "email": "kavita.nair@coal.gov.in",
        "role": "admin_officer",
        "role_display": "Administrative Officer",
        "organization": "Ministry of Coal",
        "subsidiary": None,
        "department": "Administration",
        "designation": "Under Secretary",
    },
}


# ── Helpers ──────────────────────────────────────────────────

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency to extract and validate current user from JWT."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        username: str = payload.get("sub")
        if username is None or payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        user = DEMO_USERS.get(username)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ── Routes ───────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Authenticate user and return JWT tokens."""
    user = DEMO_USERS.get(request.username)
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token_data = {"sub": user["username"], "role": user["role"]}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserProfile(
            id=user["id"],
            username=user["username"],
            full_name=user["full_name"],
            email=user["email"],
            role=user["role"],
            role_display=user["role_display"],
            organization=user["organization"],
            subsidiary=user.get("subsidiary"),
            department=user.get("department"),
            designation=user.get("designation"),
        ),
    )


@router.post("/refresh")
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Refresh an expired access token."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        username = payload.get("sub")
        user = DEMO_USERS.get(username)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        token_data = {"sub": username, "role": user["role"]}
        return {"access_token": create_access_token(token_data), "token_type": "bearer"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")


@router.get("/me", response_model=UserProfile)
async def get_profile(user: dict = Depends(get_current_user)):
    """Get current user profile."""
    return UserProfile(
        id=user["id"],
        username=user["username"],
        full_name=user["full_name"],
        email=user["email"],
        role=user["role"],
        role_display=user["role_display"],
        organization=user["organization"],
        subsidiary=user.get("subsidiary"),
        department=user.get("department"),
        designation=user.get("designation"),
    )
