from fastapi import FastAPI
from app.api.v1 import alerts, graph, auth, admin, reports

app = FastAPI(
    title="Overwatch AML Platform",
    description="Unified TradFi and Web3 Fund Flow Analysis Engine",
    version="2.0.0"
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
