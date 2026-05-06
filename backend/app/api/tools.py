from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..services.llm_service import llm_service
from ..services.tool_service import tool_service
from .auth import get_current_user
from typing import List

router = APIRouter()

@router.post("/{tool_id}/chat", response_model=schemas.ToolChatMsgOut)
async def tool_chat(
    tool_id: str,
    request: schemas.ToolChatReq,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Log user message
    user_msg = models.ToolChatMessage(
        user_id=current_user.id,
        tool_id=tool_id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    
    # Execute tool logic
    response_content = await tool_service.execute_tool_chat(tool_id, request.message)
    
    # Log assistant message
    assist_msg = models.ToolChatMessage(
        user_id=current_user.id,
        tool_id=tool_id,
        role="assistant",
        content=response_content
    )
    db.add(assist_msg)
    db.commit()
    db.refresh(assist_msg)
    
    return assist_msg

@router.get("/{tool_id}/history", response_model=List[schemas.ToolChatMsgOut])
def get_tool_history(
    tool_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    history = db.query(models.ToolChatMessage).filter(
        models.ToolChatMessage.user_id == current_user.id,
        models.ToolChatMessage.tool_id == tool_id
    ).order_by(models.ToolChatMessage.created_at.asc()).all()
    return history

@router.post("/paraphrase", response_model=schemas.ParaphraseRes)
def paraphrase_text(
    request: schemas.ParaphraseReq, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        paraphrased = llm_service.paraphrase(request.text, request.tone)
        log = models.ParaphrasedContent(
            user_id=current_user.id,
            original_text=request.text,
            paraphrased_text=paraphrased,
            tone=request.tone
        )
        db.add(log)
        db.commit()
        return schemas.ParaphraseRes(original_text=request.text, paraphrased_text=paraphrased, tone=request.tone)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect", response_model=schemas.AIDetectRes)
def detect_ai(
    request: schemas.AIDetectReq, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        detection_data = llm_service.ai_detection(request.text)
        log = models.AIDetectionLog(
            user_id=current_user.id,
            text=request.text,
            score=detection_data.get("score", 0.0),
            explanation=detection_data.get("explanation", "")
        )
        db.add(log)
        db.commit()
        return schemas.AIDetectRes(
            text=request.text, 
            score=detection_data.get("score", 0.0), 
            explanation=detection_data.get("explanation", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
