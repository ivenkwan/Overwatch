from fastapi import FastAPI
from app.api.v1 import alerts, graph, auth, admin, reports
from contextlib import asynccontextmanager
from app.db.session import init_db_pool, close_db_pool
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db_pool()
    yield
    # Shutdown
    await close_db_pool()

app = FastAPI(
    title="Overwatch AML Platform",
    description="Unified TradFi and Web3 Fund Flow Analysis Engine",
    version="2.0.0",
    lifespan=lifespan
)

import os

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8080").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(graph.router, prefix="/api/v1/graph", tags=["Graph Explorer"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "engine": "Apache AGE", "version": "2.0.0"}
