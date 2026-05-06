"""Test the full endpoint flow directly"""
import os, sys, traceback
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from app.database import SessionLocal, engine, Base
from app import models
from app.services.llm_service import llm_service

db = SessionLocal()

try:
    # Get user
    user = db.query(models.User).filter(models.User.username == "test99").first()
    print(f"User: {user.username} (id={user.id})")
    
    # Create chat
    chat = models.Chat(title="Test report...", user_id=user.id)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    print(f"Chat created: id={chat.id}")
    
    # Add user message
    user_msg = models.Message(chat_id=chat.id, role="user", content="data science")
    db.add(user_msg)
    db.commit()
    print("User message saved")
    
    # Generate report
    print("Calling generate_report...")
    report_data = llm_service.generate_report("data science")
    print(f"Report generated: {list(report_data.keys())}")
    
    # Save assistant message
    assist_msg = models.Message(chat_id=chat.id, role="assistant", content="Report compiled", is_report=True)
    db.add(assist_msg)
    db.commit()
    print("Assistant message saved")
    
    def to_str(val):
        if isinstance(val, list):
            return "\n".join([str(v) for v in val])
        return str(val) if val is not None else ""

    # Save report
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
    print(f"Report saved: id={new_report.id}")
    
    # Build response dict (same as in chat.py)
    db.refresh(chat)
    messages_out = []
    for m in chat.messages:
        messages_out.append({
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "is_report": bool(m.is_report),
        })
    
    report_out = {
        "summary": new_report.summary or "",
        "key_points": new_report.key_points or "",
        "applications": new_report.applications or "",
        "conclusion": new_report.conclusion or "",
        "citations": new_report.citations or [],
        "depth_level": new_report.depth_level or "Basic",
    }
    
    import json
    response_data = {
        "id": chat.id,
        "messages": messages_out,
        "references": [],
        "report": report_out,
    }
    
    # Test JSON serialization
    json_str = json.dumps(response_data)
    print(f"\nJSON serialization OK! Length: {len(json_str)}")
    print("FULL SUCCESS!")
    
except Exception as e:
    print(f"\nERROR at step: {e}")
    traceback.print_exc()
finally:
    db.close()
