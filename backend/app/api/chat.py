from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response, JSONResponse
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..services.llm_service import llm_service
from ..services.export_service import ExportService
from .auth import get_current_user
import traceback

router = APIRouter()

@router.post("/")
def chat_endpoint(
    request: schemas.ChatCreateReq, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    try:
        if request.chat_id:
            chat = db.query(models.Chat).filter(models.Chat.id == request.chat_id, models.Chat.user_id == current_user.id).first()
            if not chat:
                raise HTTPException(status_code=404, detail="Chat not found")
        else:
            chat = models.Chat(title=request.prompt[:50] + "...", user_id=current_user.id)
            db.add(chat)
            db.commit()
            db.refresh(chat)

        user_msg = models.Message(chat_id=chat.id, role="user", content=request.prompt)
        db.add(user_msg)
        db.commit()

        references = []
        report_out = None

        if request.generate_report:
            report_data = llm_service.generate_report(request.prompt)
            
            assist_msg = models.Message(
                chat_id=chat.id, 
                role="assistant", 
                content="I have compiled a detailed research report based on your request.",
                is_report=True
            )
            db.add(assist_msg)
            db.commit()
            
            # Delete old report if exists
            old_report = db.query(models.Report).filter(models.Report.chat_id == chat.id).first()
            if old_report:
                db.delete(old_report)
                db.commit()
            
            def to_str(val):
                if isinstance(val, list):
                    return "\n".join([str(v) for v in val])
                return str(val) if val is not None else ""

            new_report = models.Report(
                chat_id=chat.id,
                summary=to_str(report_data.get("summary", "")),
                key_points=to_str(report_data.get("key_points", "")),
                applications=to_str(report_data.get("applications", "")),
                conclusion=to_str(report_data.get("conclusion", "")),
                citations=report_data.get("citations", []),
                depth_level=to_str(report_data.get("depth_level", "Advanced"))
            )
            db.add(new_report)
            db.commit()
            db.refresh(new_report)
            
            report_out = {
                "summary": new_report.summary or "",
                "key_points": new_report.key_points or "",
                "applications": new_report.applications or "",
                "conclusion": new_report.conclusion or "",
                "citations": new_report.citations or [],
                "depth_level": new_report.depth_level or "Basic",
            }
        else:
            history_msgs = [{"role": m.role, "content": m.content} for m in chat.messages[-5:]]
            
            result = llm_service.chat_completion_with_refs(history_msgs, request.prompt)
            
            assist_msg = models.Message(
                chat_id=chat.id, 
                role="assistant", 
                content=result["content"]
            )
            db.add(assist_msg)
            db.commit()
            references = result.get("references", [])

        # Manually build the response to avoid ORM serialization issues
        db.refresh(chat)
        messages_out = []
        for m in chat.messages:
            messages_out.append({
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "is_report": bool(m.is_report),
            })
        
        response_data = {
            "id": chat.id,
            "messages": messages_out,
            "references": references,
        }
        
        if report_out:
            response_data["report"] = report_out
        
        return JSONResponse(content=response_data)
    
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{chat_id}/export")
def export_report(
    chat_id: int, 
    format: str = "pdf", 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat or not chat.report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    if format == "pdf":
        buffer = ExportService.generate_pdf(chat.report)
        return Response(content=buffer.getvalue(), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=Vedanta_Report_{chat_id}.pdf"})
    elif format == "docx":
        buffer = ExportService.generate_docx(chat.report)
        return Response(content=buffer.getvalue(), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={"Content-Disposition": f"attachment; filename=Vedanta_Report_{chat_id}.docx"})
    else:
        raise HTTPException(status_code=400, detail="Invalid format")
