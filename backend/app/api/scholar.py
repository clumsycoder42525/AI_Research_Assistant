from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..agents.orchestrator import ResearchOrchestrator
from .auth import get_current_user
import traceback

router = APIRouter()
orchestrator = ResearchOrchestrator()

@router.post("/deep-research")
async def deep_research_endpoint(
    request: schemas.ChatCreateReq, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    try:
        # Create or find project if project_id is provided
        # For now, we'll create a default project if none exists
        project = db.query(models.Project).filter(models.Project.owner_id == current_user.id).first()
        if not project:
            project = models.Project(title="My Research Workspace", owner_id=current_user.id)
            db.add(project)
            db.commit()
            db.refresh(project)

        # Create chat linked to project
        chat_title = f"Deep Research: {request.prompt[:30]}..."
        chat = models.Chat(title=chat_title, user_id=current_user.id, project_id=project.id)
        db.add(chat)
        db.commit()
        db.refresh(chat)

        # Log user message
        user_msg = models.Message(chat_id=chat.id, role="user", content=request.prompt)
        db.add(user_msg)
        db.commit()

        def to_str(val):
            if isinstance(val, list):
                return "\n".join([str(v) for v in val])
            return str(val) if val is not None else ""

        # Run Multi-Agent Orchestrator
        report_data = await orchestrator.run_deep_research(request.prompt, mode=request.mode)
        
        # Ensure final_report exists and has consistent structure
        if "final_report" not in report_data:
            report_data["final_report"] = {}
        
        final_report = report_data["final_report"]
        # Add topic explicitly as the frontend expects it
        final_report["topic"] = request.prompt

        # Save the structured report
        db_report = models.Report(
            chat_id=chat.id,
            summary=to_str(final_report.get("abstract", "")),
            key_points=to_str(final_report.get("key_insights", "")),
            applications=to_str(final_report.get("strengths", "")),
            conclusion=to_str(final_report.get("literature_review", "")),
            citations=final_report.get("citations", []), # Citations is JSON field, list is fine
            depth_level="Advanced (Deep Research)"
        )
        db.add(db_report)
        
        # Save assistant message
        assist_msg = models.Message(
            chat_id=chat.id, 
            role="assistant", 
            content="Agentic research completed. I've synthesized literature, analyzed gaps, and generated formatted citations.",
            is_report=True
        )
        db.add(assist_msg)
        db.commit()

        return report_data


    except Exception as e:
        traceback.print_exc()
        # Handle database synchronization errors specifically
        error_msg = str(e)
        if "no such column" in error_msg.lower() or "operationalerror" in error_msg.lower():
            raise HTTPException(
                status_code=500, 
                detail="Database synchronization error. Please restart the backend server to apply mandatory schema updates."
            )
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects")
def get_projects(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    projects = db.query(models.Project).filter(models.Project.owner_id == current_user.id).all()
    return projects
