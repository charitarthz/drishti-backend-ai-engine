from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.ml_service import ml_service
from app.services.project_service import project_service
from app.db.supabase_client import get_supabase

router = APIRouter(prefix="/predictions", tags=["AI Predictions & Explainability"])

class CUFSimulationRequest(BaseModel):
    project_id: Optional[str] = "SIM-2026-001"
    project_name: Optional[str] = "Simulated Central Infrastructure Project"
    approved_cost: Optional[float] = 2400.0
    expenditure: Optional[float] = 1650.0
    progress_pct: Optional[float] = 45.0
    land_acquired_pct: Optional[float] = 68.0
    forest_clearance_lag: Optional[bool] = True

@router.post("")
@router.post("/")
@router.post("/predict-risk")
def predict_cuf_risk(payload: CUFSimulationRequest):
    """Run real-time multi-target ML simulation on CUF parameters."""
    res = ml_service.predict_cuf_simulation(payload.dict())
    return {
        "success": True,
        "project_id": payload.project_id,
        "prediction": res
    }

@router.post("/predict-project/{id}")
def predict_existing_project(id: str):
    """Execute ML risk inference using the latest 26 engineered project features."""

    # Step 1: Verify project exists
    project = project_service.get_project_by_id(id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail=f"Project '{id}' not found."
        )

    # Step 2: Get Supabase client
    supabase = get_supabase()

    # Step 3: Find latest engineered feature row
    project_name = project.get("name")

    feature_response = (
        supabase
        .table("project_features")
        .select("*")
        .eq("project_name", project_name)
        .order("month", desc=True)
        .limit(1)
        .execute()
    )

    feature_rows = feature_response.data

    # Step 4: Ensure ML feature data exists
    if not feature_rows:
        raise HTTPException(
            status_code=404,
            detail=f"No ML feature data found for project '{project_name}'."
        )

    feature_data = feature_rows[0]

    # Step 5: Run trained ML pipeline
    res = ml_service.predict_cuf_simulation(feature_data)

    # Step 6: Return prediction
    return {
        "success": True,
        "project_id": id,
        "project_name": project_name,
        "feature_month": feature_data.get("month"),
        "prediction": res
    }

@router.get("/shap/{project_id}")
def get_shap_attribution(project_id: str):
    """Retrieve TreeSHAP feature contribution weights for a project."""
    project = project_service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found.")
    
    shap_factors = ml_service.get_shap_values(project_id, project)
    return {
        "success": True,
        "project_id": project_id,
        "model": "Random Forest + TreeSHAP",
        "shap_factors": shap_factors
    }

@router.get("/explain/{project_id}")
def get_plain_english_explanation(project_id: str):
    """Retrieve automated plain-language synthesis and policy actions for a project."""
    project = project_service.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found.")
    
    explanation = ml_service.get_plain_english_explanation(project_id, project)
    return {
        "success": True,
        "data": explanation
    }

class WhatIfRequest(BaseModel):
    project_id: str = "615186"
    delta_land_acquired_pct: Optional[float] = 10.0
    delta_progress_velocity: Optional[float] = 5.0
    delta_material_inflation: Optional[float] = 0.0

@router.post("/simulate-what-if")
def simulate_policy_intervention(payload: WhatIfRequest):
    """Simulate the quantitative impact of proactive policy interventions on risk and cost."""
    project = project_service.get_project_by_id(payload.project_id)
    if not project:
        # Fallback default project
        project = {
            "id": payload.project_id,
            "name": "Target Infrastructure Project",
            "riskScore": 68.0,
            "riskLevel": "High",
            "revisedCostCr": 1450.0
        }
    
    res = ml_service.simulate_what_if(payload.dict(), project)
    return {
        "success": True,
        "simulation": res
    }

