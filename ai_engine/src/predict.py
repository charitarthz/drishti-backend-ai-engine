"""
MoSPI DRISHTI AI Engine
Real-Time Predictive Inference & Explainability

Models:
- Random Forest: High Risk
- Random Forest: Deadline Slip
- Random Forest: Cost Escalation
- TreeSHAP: Actual model explainability
"""

import os
import joblib
import numpy as np
import pandas as pd
import shap


class DrishtiPredictor:

    def __init__(self, models_dir=None):

        if models_dir is None:
            models_dir = os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "models"
                )
            )

        self.models_dir = models_dir
        self.models = {}
        self.feature_cols = []

        self._load_models()

    # ==========================================================
    # LOAD TRAINED MODELS
    # ==========================================================

    def _load_models(self):

        targets = [
            "high_risk",
            "deadline_slip",
            "cost_escalation"
        ]

        for target in targets:

            model_path = os.path.join(
                self.models_dir,
                f"{target}_model.joblib"
            )

            if os.path.exists(model_path):

                data = joblib.load(model_path)

                self.models[target] = data["model"]

                # All three models should use same 26 features
                if not self.feature_cols:
                    self.feature_cols = list(
                        data["features"]
                    )

            else:

                print(
                    f"[WARNING] Model not found: {model_path}"
                )

                self.models[target] = None

        print(
            f"[DrishtiPredictor] Features loaded: "
            f"{len(self.feature_cols)}"
        )

    # ==========================================================
    # BUILD FEATURE VECTOR
    # ==========================================================

    def _build_feature_vector(self, project_data):

        values = []

        for col in self.feature_cols:

            value = project_data.get(col, 0.0)

            try:
                if value is None:
                    value = 0.0

                value = float(value)

            except (ValueError, TypeError):

                value = 0.0

            values.append(value)

        X = pd.DataFrame(
            [values],
            columns=self.feature_cols
        )

        return X

    # ==========================================================
    # FEATURE LABELS
    # ==========================================================

    def _feature_label(self, feature):

        labels = {

            "log_original_cost":
                "Original Project Cost",

            "multi_state":
                "Multi-State Project",

            "agency_freq":
                "Implementing Agency Historical Frequency",

            "sector_freq":
                "Sector Historical Frequency",

            "ministry_freq":
                "Ministry Historical Frequency",

            "approval_to_start_months":
                "Approval-to-Start Delay",

            "approval_year":
                "Project Approval Year",

            "planned_duration_months":
                "Planned Project Duration",

            "age_at_t_months":
                "Project Age",

            "cost_overrun_so_far_pct":
                "Cost Overrun So Far",

            "cost_already_revised":
                "Previous Cost Revision",

            "expenditure_vs_revised":
                "Expenditure vs Revised Cost",

            "progress_pct":
                "Physical Progress",

            "progress_vs_expected":
                "Progress vs Expected",

            "time_overrun_months":
                "Time Overrun",

            "deadline_revised_so_far":
                "Deadline Revision History",

            "total_doc_push_months":
                "Document / Deadline Push Duration",

            "months_to_revised_doc":
                "Months to Revised Completion",

            "spend_vs_progress":
                "Spending vs Progress Discrepancy",

            "exp_per_pct":
                "Expenditure per Progress %",

            "progress_rate_3m":
                "3-Month Progress Velocity",

            "spend_rate_3m":
                "3-Month Spending Velocity",

            "cost_change_3m":
                "3-Month Cost Change",

            "progress_stall":
                "Progress Stall",

            "doc_push_recent":
                "Recent Document / Deadline Push",

            "cost_revisions_so_far":
                "Cost Revision Frequency"
        }

        return labels.get(
            feature,
            feature.replace("_", " ").title()
        )

    # ==========================================================
    # FEATURE DESCRIPTIONS
    # ==========================================================

    def _feature_description(
        self,
        feature,
        project_data
    ):

        value = project_data.get(feature, 0)

        descriptions = {

            "progress_pct":
                f"Current physical progress is {float(value):.1f}%.",

            "progress_vs_expected":
                f"Progress is {float(value):.1f}% relative to expected progress.",

            "time_overrun_months":
                f"Current time overrun is {float(value):.1f} months.",

            "deadline_revised_so_far":
                f"Deadline has been revised {int(float(value))} time(s).",

            "cost_overrun_so_far_pct":
                f"Current cost overrun is {float(value):.1f}%.",

            "cost_already_revised":
                f"Previous cost revision indicator is {float(value):.1f}.",

            "spend_vs_progress":
                f"Spending-to-progress ratio is {float(value):.2f}.",

            "progress_rate_3m":
                f"Recent 3-month progress velocity is {float(value):.2f}.",

            "spend_rate_3m":
                f"Recent 3-month spending velocity is {float(value):.2f}.",

            "progress_stall":
                f"Progress stall indicator is {float(value):.1f}.",

            "doc_push_recent":
                f"Recent document/deadline push indicator is {float(value):.1f}.",

            "cost_revisions_so_far":
                f"Total recorded cost revisions are {float(value):.1f}."
        }

        if feature in descriptions:
            return descriptions[feature]

        return (
            f"{self._feature_label(feature)} "
            f"currently has a value of {value}."
        )

    # ==========================================================
    # ACTUAL TREE SHAP
    # ==========================================================

    def _get_tree_shap_drivers(
        self,
        model,
        X
    ):

        # TreeExplainer supports RandomForest directly
        explainer = shap.TreeExplainer(model)

        shap_values = explainer.shap_values(X)

        # SHAP output can differ between SHAP versions.
        # Normalize it into one-dimensional feature values.

        if isinstance(shap_values, list):

            # Binary classification:
            # class 1 = high-risk class
            if len(shap_values) > 1:

                values = np.asarray(
                    shap_values[1]
                )[0]

            else:

                values = np.asarray(
                    shap_values[0]
                )[0]

        else:

            values = np.asarray(
                shap_values
            )

            # Newer SHAP versions may return:
            # (samples, features, classes)

            if values.ndim == 3:

                values = values[0, :, 1]

            elif values.ndim == 2:

                values = values[0]

            elif values.ndim == 1:

                values = values

            else:

                values = values.flatten()

        values = np.asarray(
            values,
            dtype=float
        ).flatten()

        # Safety check
        if len(values) != len(self.feature_cols):

            raise ValueError(
                f"SHAP feature count mismatch: "
                f"{len(values)} values vs "
                f"{len(self.feature_cols)} features"
            )

        drivers = []

        for feature, raw_value in zip(
            self.feature_cols,
            values
        ):

            raw_value = float(raw_value)

            drivers.append(
                {
                    "feature": feature,
                    "raw_shap_value": round(
                        raw_value,
                        6
                    ),
                    "weight": round(
                        abs(raw_value),
                        4
                    ),
                    "direction":
                        "positive"
                        if raw_value > 0
                        else "negative"
                }
            )

        # Highest absolute SHAP contributions first
        drivers.sort(
            key=lambda x: abs(
                x["raw_shap_value"]
            ),
            reverse=True
        )

        return drivers
        

    def _build_feature_vector(self, project_data: dict) -> pd.DataFrame:
        """
        Build the exact same 26-feature input used by the prediction models.
        """
        vector = []

        for col in self.feature_cols:
            value = project_data.get(col, 0.0)

            try:
                if value is None:
                    value = 0.0
                vector.append(float(value))
            except (ValueError, TypeError):
                vector.append(0.0)

        return pd.DataFrame(
            [vector],
            columns=self.feature_cols
        )


    def _feature_label(self, feature: str) -> str:
        """
        Convert technical feature names into presentation-friendly labels.
        """
        labels = {
            "log_original_cost": "Original Project Cost",
            "multi_state": "Multi-State Complexity",
            "agency_freq": "Implementing Agency Risk History",
            "sector_freq": "Sector Historical Risk",
            "ministry_freq": "Ministry Historical Risk",
            "approval_to_start_months": "Approval-to-Start Delay",
            "approval_year": "Approval Year",
            "planned_duration_months": "Planned Project Duration",
            "age_at_t_months": "Project Age",
            "cost_overrun_so_far_pct": "Cost Overrun So Far",
            "cost_already_revised": "Previous Cost Revision",
            "expenditure_vs_revised": "Expenditure vs Revised Cost",
            "progress_pct": "Physical Progress",
            "progress_vs_expected": "Progress vs Expected",
            "time_overrun_months": "Time Overrun",
            "deadline_revised_so_far": "Deadline Revision",
            "total_doc_push_months": "Document/Deadline Push Duration",
            "months_to_revised_doc": "Months to Revised Deadline",
            "spend_vs_progress": "Expenditure vs Progress",
            "exp_per_pct": "Expenditure per Progress %",
            "progress_rate_3m": "3-Month Progress Rate",
            "spend_rate_3m": "3-Month Spending Rate",
            "cost_change_3m": "3-Month Cost Change",
            "progress_stall": "Progress Stall",
            "doc_push_recent": "Recent Document/Deadline Push",
            "cost_revisions_so_far": "Total Cost Revisions"
        }

        return labels.get(feature, feature.replace("_", " ").title())

    def _feature_description(
        self,
        feature: str,
        project_data: dict
    ) -> str:
        """
        Generate a human-readable explanation for a SHAP feature.
        """

        value = project_data.get(feature, 0.0)

        descriptions = {
            "progress_pct":
                f"Physical progress is currently {value}%.",

            "progress_vs_expected":
                f"Progress is {value}% relative to the expected project trajectory.",

            "spend_vs_progress":
                f"Expenditure-to-progress ratio is {value:.2f}.",

            "exp_per_pct":
                f"Expenditure per percentage point of progress is {value:.2f}.",

            "progress_rate_3m":
                f"Progress achieved over the recent 3-month period is {value}%.",

            "spend_rate_3m":
                f"Recent 3-month spending rate is {value:.2f}.",

            "cost_overrun_so_far_pct":
                f"Cost overrun recorded so far is {value}%.",

            "cost_already_revised":
                f"Previous cost revision indicator is {value}.",

            "deadline_revised_so_far":
                f"Deadline revision indicator is {value}.",

            "total_doc_push_months":
                f"Total documented deadline push duration is {value} months.",

            "progress_stall":
                f"Recent progress stall indicator is {value}.",

            "doc_push_recent":
                f"Recent document/deadline push indicator is {value}.",

            "cost_revisions_so_far":
                f"Total cost revisions recorded so far: {value}.",

            "time_overrun_months":
                f"Time overrun recorded so far is {value} months.",

            "planned_duration_months":
                f"Planned project duration is {value} months.",

            "age_at_t_months":
                f"Project age at the current reporting month is {value} months.",

            "expenditure_vs_revised":
                f"Expenditure relative to revised project cost is {value:.3f}.",
        }

        return descriptions.get(
            feature,
            f"Current value of {self._feature_label(feature)} is {value}."
        )

    def _get_tree_shap_drivers(
        self,
        model,
        X: pd.DataFrame
    ) -> list:
        """
        Calculate ACTUAL TreeSHAP contributions for one prediction.

        Works with the trained RandomForestClassifier.
        """

        if model is None:
            return []

        explainer = shap.TreeExplainer(model)

        shap_values = explainer.shap_values(X)

        # SHAP output differs slightly between SHAP versions.
        if isinstance(shap_values, list):

            if len(shap_values) > 1:
                values = np.asarray(shap_values[1])[0]
            else:
                values = np.asarray(shap_values[0])[0]

        else:
            values = np.asarray(shap_values)

            if values.ndim == 3:
                # Possible shape:
                # (samples, features, classes)
                values = values[0, :, 1]

            elif values.ndim == 2:
                values = values[0]

            elif values.ndim == 1:
                values = values

            else:
                values = values.flatten()

        values = np.asarray(values, dtype=float)

        # Safety check
        if len(values) != len(self.feature_cols):
            raise ValueError(
                f"SHAP feature mismatch: "
                f"{len(values)} SHAP values vs "
                f"{len(self.feature_cols)} model features"
            )

        drivers = []

        for feature, shap_value in zip(
            self.feature_cols,
            values
        ):
            raw_value = float(shap_value)

            drivers.append({
                "feature": feature,
                "raw_shap_value": round(raw_value, 6),
                "weight": round(abs(raw_value), 4),
                "direction": (
                    "positive"
                    if raw_value > 0
                    else "negative"
                    if raw_value < 0
                    else "neutral"
                )
            })

        # Highest absolute contribution first
        drivers.sort(
            key=lambda x: abs(x["raw_shap_value"]),
            reverse=True
        )

        return drivers


    def _build_feature_vector(self, project_data: dict) -> pd.DataFrame:
        vector = []

        for col in self.feature_cols:
            value = project_data.get(col, 0.0)

            try:
                if value is None:
                    value = 0.0
                vector.append(float(value))
            except (ValueError, TypeError):
                vector.append(0.0)

        return pd.DataFrame(
            [vector],
            columns=self.feature_cols
        )

    def _feature_label(self, feature: str) -> str:
        labels = {
            "log_original_cost": "Original Project Cost",
            "multi_state": "Multi-State Complexity",
            "agency_freq": "Implementing Agency Risk History",
            "sector_freq": "Sector Historical Risk",
            "ministry_freq": "Ministry Historical Risk",
            "approval_to_start_months": "Approval-to-Start Delay",
            "approval_year": "Approval Year",
            "planned_duration_months": "Planned Project Duration",
            "age_at_t_months": "Project Age",
            "cost_overrun_so_far_pct": "Cost Overrun So Far",
            "cost_already_revised": "Previous Cost Revision",
            "expenditure_vs_revised": "Expenditure vs Revised Cost",
            "progress_pct": "Physical Progress",
            "progress_vs_expected": "Progress vs Expected",
            "time_overrun_months": "Time Overrun",
            "deadline_revised_so_far": "Deadline Revision",
            "total_doc_push_months": "Document/Deadline Push Duration",
            "months_to_revised_doc": "Months to Revised Deadline",
            "spend_vs_progress": "Expenditure vs Progress",
            "exp_per_pct": "Expenditure per Progress %",
            "progress_rate_3m": "3-Month Progress Rate",
            "spend_rate_3m": "3-Month Spending Rate",
            "cost_change_3m": "3-Month Cost Change",
            "progress_stall": "Progress Stall",
            "doc_push_recent": "Recent Deadline Push",
            "cost_revisions_so_far": "Total Cost Revisions"
        }

        return labels.get(
            feature,
            feature.replace("_", " ").title()
        )

    def _feature_description(
        self,
        feature: str,
        project_data: dict
    ) -> str:

        value = project_data.get(feature, 0.0)

        descriptions = {
            "progress_pct":
                f"Physical progress is currently {value}%.",

            "progress_vs_expected":
                f"Progress is {value}% relative to the expected trajectory.",

            "spend_vs_progress":
                f"Expenditure-to-progress ratio is {value:.2f}.",

            "exp_per_pct":
                f"Expenditure per percentage point of progress is {value:.2f}.",

            "progress_rate_3m":
                f"Recent 3-month progress rate is {value}%.",

            "spend_rate_3m":
                f"Recent 3-month spending rate is {value:.2f}.",

            "cost_overrun_so_far_pct":
                f"Cost overrun recorded so far is {value}%.",

            "time_overrun_months":
                f"Time overrun recorded so far is {value} months.",

            "deadline_revised_so_far":
                f"Deadline revision indicator is {value}.",

            "progress_stall":
                f"Progress stall indicator is {value}.",

            "doc_push_recent":
                f"Recent deadline/document push indicator is {value}."
        }

        return descriptions.get(
            feature,
            f"Current value of {self._feature_label(feature)} is {value}."
        )

    def _get_tree_shap_drivers(
        self,
        model,
        X: pd.DataFrame
    ) -> list:

        if model is None:
            return []

        explainer = shap.TreeExplainer(model)

        shap_values = explainer.shap_values(X)

        if isinstance(shap_values, list):

            if len(shap_values) > 1:
                values = np.asarray(shap_values[1])[0]
            else:
                values = np.asarray(shap_values[0])[0]

        else:
            values = np.asarray(shap_values)

            if values.ndim == 3:
                values = values[0, :, 1]

            elif values.ndim == 2:
                values = values[0]

            elif values.ndim == 1:
                values = values

            else:
                values = values.flatten()

        values = np.asarray(
            values,
            dtype=float
        )

        if len(values) != len(self.feature_cols):
            raise ValueError(
                f"SHAP feature mismatch: "
                f"{len(values)} SHAP values vs "
                f"{len(self.feature_cols)} model features"
            )

        drivers = []

        for feature, shap_value in zip(
            self.feature_cols,
            values
        ):

            raw_value = float(shap_value)

            drivers.append({
                "feature": feature,
                "raw_shap_value": round(raw_value, 6),
                "weight": round(abs(raw_value), 4),
                "direction": (
                    "positive"
                    if raw_value > 0
                    else "negative"
                    if raw_value < 0
                    else "neutral"
                )
            })

        drivers.sort(
            key=lambda x: abs(x["raw_shap_value"]),
            reverse=True
        )

        return drivers
    

    # ==========================================================
    # PREDICTION
    # ==========================================================

    def predict_project(
        self,
        project_data: dict
    ) -> dict:

        X = self._build_feature_vector(
            project_data
        )

        results = {

            "risk_score": 0.0,

            "risk_level": "Low",

            "high_risk_probability": 0.0,

            "deadline_slip_probability": 0.0,

            "cost_escalation_probability": 0.0,

            "predicted_delay_months": 0,

            "top_risk_drivers": [],

            "recommendation": ""
        }

        # ======================================================
        # HIGH RISK
        # ======================================================

        high_risk_model = self.models.get(
            "high_risk"
        )

        if high_risk_model is not None:

            probs = high_risk_model.predict_proba(X)[0]

            if len(probs) > 1:

                prob_high = float(
                    probs[1]
                )

            else:

                prob_high = 0.0

            results[
                "high_risk_probability"
            ] = round(
                prob_high * 100,
                1
            )

            results[
                "risk_score"
            ] = round(
                prob_high * 100,
                1
            )

            if prob_high >= 0.70:

                results[
                    "risk_level"
                ] = "Critical"

            elif prob_high >= 0.40:

                results[
                    "risk_level"
                ] = "High"

            elif prob_high >= 0.20:

                results[
                    "risk_level"
                ] = "Medium"

            else:

                results[
                    "risk_level"
                ] = "Low"

        # ======================================================
        # DEADLINE SLIP
        # ======================================================

        deadline_model = self.models.get(
            "deadline_slip"
        )

        if deadline_model is not None:

            probs = deadline_model.predict_proba(X)[0]

            if len(probs) > 1:

                prob_slip = float(
                    probs[1]
                )

            else:

                prob_slip = 0.0

            results[
                "deadline_slip_probability"
            ] = round(
                prob_slip * 100,
                1
            )

            time_overrun = float(
                project_data.get(
                    "time_overrun_months",
                    0
                ) or 0
            )

            stall = float(
                project_data.get(
                    "progress_stall",
                    0
                ) or 0
            )

            estimated_delay = int(
                time_overrun
                + (stall * 4)
                + (prob_slip * 6)
            )

            results[
                "predicted_delay_months"
            ] = max(
                0,
                estimated_delay
            )

        # ======================================================
        # COST ESCALATION
        # ======================================================

        cost_model = self.models.get(
            "cost_escalation"
        )

        if cost_model is not None:

            probs = cost_model.predict_proba(X)[0]

            if len(probs) > 1:

                prob_cost = float(
                    probs[1]
                )

            else:

                prob_cost = 0.0

            results[
                "cost_escalation_probability"
            ] = round(
                prob_cost * 100,
                1
            )

        # ======================================================
        # TREE SHAP RISK DRIVERS
        # ======================================================

        try:

            if high_risk_model is not None:

                drivers = (
                    self._get_tree_shap_drivers(
                        high_risk_model,
                        X
                    )
                )

                results[
                    "top_risk_drivers"
                ] = [

                    {
                        "factor":
                            self._feature_label(
                                d["feature"]
                            ),

                        "impact":
                            (
                                "High"
                                if d["weight"] >= 0.10
                                else
                                "Medium"
                                if d["weight"] >= 0.03
                                else
                                "Low"
                            ),

                        "weight":
                            d["weight"]
                    }

                    for d in drivers[:5]
                ]

        except Exception as e:

            print(
                f"[TreeSHAP] Driver calculation "
                f"failed: {e}"
            )

            results[
                "top_risk_drivers"
            ] = []

        # ======================================================
        # RECOMMENDATION
        # ======================================================

        if results["risk_level"] in [
            "Critical",
            "High"
        ]:

            results[
                "recommendation"
            ] = (
                "Immediate IPMD Inter-Ministerial "
                "Taskforce Review required. Freeze "
                "non-critical disbursements and "
                "conduct contractor liquidity audit."
            )

        elif results["risk_level"] == "Medium":

            results[
                "recommendation"
            ] = (
                "Monthly milestone escalation triggered. "
                "Review Right of Way (RoW) clearances "
                "and fast-track utility shifting."
            )

        else:

            results[
                "recommendation"
            ] = (
                "Project progress tracking within "
                "standard tolerance envelope. Continue "
                "automated monitoring."
            )

        return results


# ==============================================================
# SINGLETON
# ==============================================================

_predictor = None


def get_predictor():

    global _predictor

    if _predictor is None:

        _predictor = DrishtiPredictor()

    return _predictor


# ==============================================================
# DIRECT TEST
# ==============================================================

if __name__ == "__main__":

    predictor = get_predictor()

    print(
        "\nFEATURE COUNT:",
        len(predictor.feature_cols)
    )

    print(
        "FEATURES:",
        predictor.feature_cols
    )

    sample = {
        "progress_pct": 35.0,
        "time_overrun_months": 12,
        "progress_stall": 1,
        "spend_vs_progress": 1.85,
        "log_original_cost": 6.5
    }

    print(
        "\nSAMPLE PREDICTION:"
    )

    import pprint

    pprint.pprint(
        predictor.predict_project(
            sample
        )
    )