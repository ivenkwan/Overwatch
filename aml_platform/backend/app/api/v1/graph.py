from app.services import graph_service, pii_service
from app.core import auth

router = APIRouter()

@router.get("/explore/{entity_id}")
async def explore_graph(
    entity_id: str,
    depth: int = Query(1, ge=1, le=5),
    current_user: dict = Depends(auth.get_current_user_with_scope("SENIOR_INVESTIGATOR"))
):
    """
    Explore the Apache AGE graph around a target entity.
    - depth: 1-5 hops (default 1)
    - Returns Cytoscape.js compatible JSON structure.
    """
    try:
        # Service handles AGE connection and Cypher construction
        subgraph = await graph_service.get_neighborhood(entity_id, depth)
        
        # Log unmasking (Graph access is restricted to SENIOR_INVESTIGATOR)
        await auth.log_unmasking_event(current_user["id"], "GRAPH_EXPLORE", entity_id)
        
        return {
            "status": "success", 
            "data": pii_service.mask_pii(subgraph, current_user["role"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trace/{source_id}/{target_id}")
async def find_path(
    source_id: str,
    target_id: str,
    max_depth: int = Query(5, ge=1, le=10),
    current_user: dict = Depends(auth.get_current_user_with_scope("SENIOR_INVESTIGATOR"))
):
    """
    Find paths between two entities (e.g., suspect wallet to exchange).
    """
    # Log unmasking for path tracing
    await auth.log_unmasking_event(current_user["id"], "GRAPH_TRACE", f"{source_id}->{target_id}")
    
    path_data = await graph_service.find_shortest_paths(source_id, target_id, max_depth)
    return pii_service.mask_pii(path_data, current_user["role"])
