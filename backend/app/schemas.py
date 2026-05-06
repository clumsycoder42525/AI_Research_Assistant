from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

# --- Auth Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Reference Schema ---
class ReferenceOut(BaseModel):
    title: str
    url: str
    snippet: str = ""

# --- Chat & Report Schemas ---
class MessageBase(BaseModel):
    role: str
    content: str
    is_report: bool = False
    
class ChatCreateReq(BaseModel):
    prompt: str
    chat_id: Optional[int] = None
    mode: Optional[str] = "deep"
    generate_report: bool = False

class ReportOut(BaseModel):
    summary: str
    key_points: str
    applications: str
    conclusion: str
    citations: Optional[List[str]] = []
    depth_level: str

class MessageOut(MessageBase):
    id: int
    report: Optional[ReportOut] = None
    class Config:
        from_attributes = True

class ChatListOut(BaseModel):
    id: int
    title: str
    created_at: datetime
    class Config:
        from_attributes = True

class ChatDetailOut(ChatListOut):
    messages: List[MessageOut]
    
# --- Tool Schemas ---
class ParaphraseReq(BaseModel):
    text: str
    tone: Optional[str] = "Casual"

class ParaphraseRes(BaseModel):
    original_text: str
    paraphrased_text: str
    tone: str

class AIDetectReq(BaseModel):
    text: str

class AIDetectRes(BaseModel):
    text: str
    score: float
    explanation: str

class ChatResponse(BaseModel):
    id: int
    messages: List[MessageOut]
    report: Optional[ReportOut] = None
    references: Optional[List[ReferenceOut]] = []

class ToolChatReq(BaseModel):
    message: str

class ToolChatMsgOut(BaseModel):
    role: str
    content: str
    created_at: datetime
    class Config:
        from_attributes = True
