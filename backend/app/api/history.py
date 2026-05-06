from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas
from .auth import get_current_user

router = APIRouter()

@router.get("/chats", response_model=List[schemas.ChatListOut])
def get_user_chats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    chats = db.query(models.Chat).filter(models.Chat.user_id == current_user.id).order_by(models.Chat.created_at.desc()).all()
    return chats

@router.get("/chats/{chat_id}", response_model=schemas.ChatDetailOut)
def get_chat_details(
    chat_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat
