import math
from typing import List, Dict, Any, Optional

from app.db.supabase_client import get_supabase


class ProjectService:
    """
    Project data service.

    Source of truth:
        Supabase PostgreSQL -> public.projects

    The service keeps the response format expected by the existing
    frontend while mapping Supabase snake_case columns to the existing
    camelCase API fields.
    """

    def __init__(self):
        self.supabase = get_supabase()

    # ============================================================
    # DATABASE -> FRONTEND FIELD MAPPING
    # ============================================================

    def _map_project(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert Supabase `projects` row into the response format
        already used by the frontend.
        """

        original_cost = float(row.get("original_cost_cr") or 0.0)
        revised_cost = float(
            row.get("revised_cost_cr")
            if row.get("revised_cost_cr") is not None
            else original_cost
        )

        expenditure = float(row.get("cumulative_expenditure_cr") or 0.0)
        physical_progress = float(row.get("physical_progress_pct") or 0.0)

        # Use database financial progress if available.
        # Otherwise calculate it safely.
        if row.get("financial_progress_pct") is not None:
            financial_progress = float(row["financial_progress_pct"])
        else:
            financial_progress = round(
                (expenditure / (revised_cost or 1.0)) * 100,
                1
            )

        risk_score = (
            float(row["risk_score"])
            if row.get("risk_score") is not None
            else None
        )

        risk_level = row.get("risk_level")

        # Do NOT invent ML risk values.
        # If DB does not have them yet, expose None.
        if risk_level is None and risk_score is not None:
            risk_level = self._risk_level_from_score(risk_score)

        return {
            # Existing frontend-compatible identifiers
            "id": str(row.get("project_id", "")),
            "projectId": str(row.get("project_id", "")),

            # Basic project information
            "name": row.get("name") or "Unnamed Project",
            "ministry": row.get("ministry") or "Not Available",
            "sector": row.get("sector") or "Not Available",
            "state": row.get("state") or "Not Available",
            "agency": row.get("implementing_agency") or "Not Available",

            # Financial information
            "originalCostCr": original_cost,
            "revisedCostCr": revised_cost,
            "costValue": revised_cost,
            "expenditureCr": expenditure,

            # Progress
            "physicalProgress": physical_progress,
            "progress": physical_progress,
            "financialProgress": financial_progress,

            # Risk / ML fields
            "riskLevel": risk_level,
            "riskScore": risk_score,
            "overallRisk": risk_score,

            # Revision information
            "costRevisionPct": float(
                row.get("cost_revision_pct") or 0.0
            ),
            "deadlineRevisionFlag": bool(
                row.get("deadline_revision_flag")
                if row.get("deadline_revision_flag") is not None
                else False
            ),

            # Status / dates
            "status": row.get("project_status") or row.get("status_at_month_end") or "Unknown",
            "reportingMonth": row.get("reporting_month"),
            "approvalDate": row.get("approval_date"),
            "startDate": row.get("start_date"),
            "originalCompletionDate": row.get("original_completion_date"),
            "targetCompletion": (
                row.get("revised_completion_date")
                or row.get("original_completion_date")
            ),

            # Additional source fields
            "revisedCompletionDate": row.get("revised_completion_date"),
            "legacyOcmsCode": row.get("legacy_ocms_code"),
            "pmgid": row.get("pmgid"),
            "statusAtMonthEnd": row.get("status_at_month_end"),
            "dataQualityFlag": row.get("data_quality_flag"),
            "sourcePage": row.get("source_page"),
            "slNo": row.get("sl_no"),
        }

    # ============================================================
    # RISK LEVEL HELPER
    # ============================================================

    @staticmethod
    def _risk_level_from_score(score: float) -> str:
        if score >= 75:
            return "Critical"
        elif score >= 50:
            return "High"
        elif score >= 25:
            return "Moderate"
        return "Low"

    # ============================================================
    # GET PROJECTS
    # ============================================================

    def get_filtered_projects(
        self,
        search: Optional[str] = None,
        ministry: Optional[str] = None,
        sector: Optional[str] = None,
        state: Optional[str] = None,
        risk: Optional[str] = None,
        page: int = 1,
        page_size: int = 8,
    ) -> Dict[str, Any]:

        if not self.supabase:
            raise RuntimeError("Supabase client is not available.")

        query = self.supabase.table("projects").select(
            "*",
            count="exact"
        )

        # --------------------------------------------------------
        # SEARCH
        # --------------------------------------------------------
        if search:
            q = search.strip()

            # Search project ID OR name OR ministry OR agency.
            query = query.or_(
                f"project_id.ilike.%{q}%,"
                f"name.ilike.%{q}%,"
                f"ministry.ilike.%{q}%,"
                f"implementing_agency.ilike.%{q}%"
            )

        # --------------------------------------------------------
        # FILTERS
        # --------------------------------------------------------
        if ministry and ministry != "All":
            query = query.eq("ministry", ministry)

        if sector and sector != "All":
            query = query.eq("sector", sector)

        if state and state != "All":
            query = query.eq("state", state)

        if risk and risk != "All":
            query = query.eq("risk_level", risk)

        # --------------------------------------------------------
        # PAGINATION
        # --------------------------------------------------------
        page = max(1, page)
        page_size = max(1, min(page_size, 2500))

        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size - 1

        query = query.range(start_idx, end_idx)

        # Most recent reporting records first.
        query = query.order(
            "project_id",
            desc=False
        )

        response = query.execute()

        rows = response.data or []
        total_count = response.count or 0

        total_pages = (
            math.ceil(total_count / page_size)
            if page_size > 0
            else 1
        )

        return {
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "data": [
                self._map_project(row)
                for row in rows
            ],
        }

    # ============================================================
    # GET SINGLE PROJECT
    # ============================================================

    def get_project_by_id(
        self,
        project_id: str
    ) -> Optional[Dict[str, Any]]:

        if not self.supabase:
            raise RuntimeError("Supabase client is not available.")

        response = (
            self.supabase
            .table("projects")
            .select("*")
            .eq("project_id", str(project_id))
            .limit(1)
            .execute()
        )

        if not response.data:
            return None

        project_dict = self._map_project(response.data[0])

        # Always fetch fresh ML prediction to override stale DB fields
        try:
            from app.services.ml_service import ml_service
            prediction = ml_service.get_project_prediction(
                project_name=project_dict.get("name"),
                project_data=project_dict
            )
            if prediction and "risk_score" in prediction:
                risk_score = float(prediction["risk_score"])
                risk_level = str(prediction.get("risk_level", "Low"))
                project_dict["riskScore"] = risk_score
                project_dict["overallRisk"] = risk_score
                project_dict["riskLevel"] = risk_level
        except Exception as e:
            print(f"[ProjectService] ML risk prediction lookup error: {e}")

        return project_dict

    # ============================================================
    # PORTFOLIO STATS
    # ============================================================

    def get_stats(self) -> Dict[str, Any]:

        if not self.supabase:
            raise RuntimeError("Supabase client is not available.")

        response = (
            self.supabase
            .table("projects")
            .select("*")
            .execute()
        )

        rows = response.data or []

        total_projects = len(rows)

        total_orig_cost = sum(
            float(r.get("original_cost_cr") or 0)
            for r in rows
        )

        total_rev_cost = sum(
            float(
                r.get("revised_cost_cr")
                if r.get("revised_cost_cr") is not None
                else r.get("original_cost_cr") or 0
            )
            for r in rows
        )

        total_exp = sum(
            float(r.get("cumulative_expenditure_cr") or 0)
            for r in rows
        )

        high_risk_count = sum(
            1
            for r in rows
            if r.get("risk_level") in ["Critical", "High"]
        )

        delayed_count = sum(
            1
            for r in rows
            if r.get("deadline_revision_flag") is True
            or r.get("risk_level") == "Critical"
        )

        overrun_count = sum(
            1
            for r in rows
            if float(r.get("revised_cost_cr") or 0)
            > float(r.get("original_cost_cr") or 0)
        )

        completed_count = sum(
            1
            for r in rows
            if float(r.get("physical_progress_pct") or 0) >= 100
            or str(r.get("project_status") or "").lower() == "completed"
        )

        critical_count = sum(
            1
            for r in rows
            if r.get("risk_level") == "Critical"
        )

        return {
            "total_projects": total_projects,

            "total_original_cost_lakh_cr": round(
                total_orig_cost / 100000,
                2
            ),

            "total_revised_cost_lakh_cr": round(
                total_rev_cost / 100000,
                2
            ),

            "total_expenditure_lakh_cr": round(
                total_exp / 100000,
                2
            ),

            "high_risk_count": high_risk_count,

            "delayed_count": delayed_count,

            "delayed_pct": round(
                (delayed_count / (total_projects or 1)) * 100,
                1
            ),

            "cost_overrun_count": overrun_count,

            "cost_overrun_pct": round(
                (overrun_count / (total_projects or 1)) * 100,
                1
            ),

            "status_breakdown": {
                "on_track": max(
                    0,
                    total_projects - delayed_count
                ),
                "delayed": delayed_count,
                "critical": critical_count,
                "completed": completed_count,
            },
        }

    # ============================================================
    # GEO STATS
    # ============================================================

    def get_geo_stats(self) -> List[Dict[str, Any]]:

        if not self.supabase:
            raise RuntimeError("Supabase client is not available.")

        response = (
            self.supabase
            .table("projects")
            .select(
                "state,risk_level,revised_cost_cr"
            )
            .execute()
        )

        rows = response.data or []

        state_map: Dict[str, Dict[str, Any]] = {}

        for row in rows:

            state = row.get("state") or "Other"

            if state not in state_map:
                state_map[state] = {
                    "state": state,
                    "total_projects": 0,
                    "high_risk": 0,
                    "total_cost_cr": 0.0,
                }

            state_map[state]["total_projects"] += 1

            if row.get("risk_level") in [
                "Critical",
                "High"
            ]:
                state_map[state]["high_risk"] += 1

            state_map[state]["total_cost_cr"] += float(
                row.get("revised_cost_cr") or 0
            )

        return list(state_map.values())


# ================================================================
# SINGLETON SERVICE INSTANCE
# ================================================================

project_service = ProjectService()