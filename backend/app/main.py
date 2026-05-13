import bcrypt
# Monkeypatch bcrypt for passlib compatibility
if not hasattr(bcrypt, "__about__"):
    class About:
        __version__ = getattr(bcrypt, "__version__", "4.0.1")
    bcrypt.__about__ = About

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, apply_migrations
from .api import chat, tools, history, auth, scholar
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables and sync schema on startup
    print("Initializing database...")
    Base.metadata.create_all(bind=engine)
    apply_migrations()
    yield

app = FastAPI(
    title="Vedanta AI Research Platform API",
    description="Backend for the AI Research Assistant Application",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration - Permissive for Guest Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(tools.router, prefix="/api/tools", tags=["tools"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(scholar.router, prefix="/api/scholar", tags=["scholar"])

@app.get("/")
def root():
    return {"message": "Vedanta AI API is Online", "status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "2.0.1"}
