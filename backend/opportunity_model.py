import os
import re
from typing import Any, Dict, List

import pandas as pd

ROOT = os.path.dirname(__file__)
DATA_PATH = os.path.join(ROOT, "data", "students_opportunities.csv")

_df_cache = None


def _normalize_skill_string(value: str) -> List[str]:
    if not isinstance(value, str):
        return []
    parts = re.split(r"[;,|]", value)
    return [part.strip().lower() for part in parts if part and part.strip()]


def load_dataset() -> pd.DataFrame:
    global _df_cache
    if _df_cache is not None:
        return _df_cache
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    df.columns = [col.strip() for col in df.columns]
    required = {
        "StudentName",
        "RollNumber",
        "Branch",
        "CGPA",
        "Skills",
        "Company",
        "JobRole",
        "Package",
        "Year",
        "OpportunityType",
    }
    if not required.issubset(set(df.columns)):
        missing = required - set(df.columns)
        raise ValueError(f"CSV is missing required columns: {missing}")

    df["Skills"] = df["Skills"].fillna("").astype(str)
    df["Branch"] = df["Branch"].fillna("").astype(str)
    df["CGPA"] = pd.to_numeric(df["CGPA"], errors="coerce").fillna(0.0)
    df["Package"] = pd.to_numeric(df["Package"], errors="coerce").fillna(0.0)
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce").fillna(0).astype(int)
    df["_skill_list"] = df["Skills"].apply(_normalize_skill_string)
    _df_cache = df
    return _df_cache


def recommend_from_trends(
    skills_input: List[str],
    branch: str = None,
    cgpa: float = None,
    year: int = None,
    top_k: int = 10,
) -> Dict[str, Any]:
    df = load_dataset()
    normalized_skills = [skill.strip().lower() for skill in skills_input if skill and isinstance(skill, str)]
    if not normalized_skills:
        return {
            "matched_students": [],
            "stats": {},
            "roles_for_skills": [],
            "companies_for_skills": [],
        }

    roles_set = set()
    companies_set = set()
    for _, row in df.iterrows():
        student_skills = set(row["_skill_list"])
        if any(skill in student_skills for skill in normalized_skills):
            roles_set.add(str(row["JobRole"]))
            companies_set.add(str(row["Company"]))

    def compute_metrics(row):
        row_skills = set(row["_skill_list"])
        overlap = len(set(normalized_skills) & row_skills)
        similarity = overlap / max(len(set(normalized_skills)), 1)
        branch_match = 1 if branch and str(row["Branch"]).strip().lower() == str(branch).strip().lower() else 0
        cgpa_diff = abs(float(row["CGPA"]) - float(cgpa)) if cgpa is not None else 0
        score = overlap * 10 + branch_match * 2 - cgpa_diff * 0.5
        return pd.Series(
            {
                "_overlap": overlap,
                "_sim": similarity,
                "_branch_match": branch_match,
                "_cgpa_diff": cgpa_diff,
                "_score": score,
            }
        )

    metrics = df.apply(compute_metrics, axis=1)
    ranked = pd.concat([df, metrics], axis=1)
    matched = ranked[ranked["_overlap"] > 0].copy()
    total_students = len(ranked)
    matched_count = len(matched)

    if matched_count == 0:
        stats = {
            "matched_count": 0,
            "matched_pct": 0.0,
            "avg_package": 0.0,
            "top_companies": {},
            "top_roles": {},
        }
        return {
            "matched_students": [],
            "stats": stats,
            "roles_for_skills": sorted(roles_set),
            "companies_for_skills": sorted(companies_set),
        }

    matched = matched.sort_values(by=["_score", "_overlap", "_branch_match"], ascending=[False, False, False])
    top_rows = matched.head(top_k)
    matched_students = []
    for _, row in top_rows.iterrows():
        matched_students.append(
            {
                "StudentName": row["StudentName"],
                "RollNumber": int(row["RollNumber"]) if not pd.isna(row["RollNumber"]) else None,
                "Branch": row["Branch"],
                "CGPA": float(row["CGPA"]),
                "Skills": row["Skills"],
                "Company": row["Company"],
                "JobRole": row["JobRole"],
                "Package": float(row["Package"]),
                "Year": int(row["Year"]) if not pd.isna(row["Year"]) else None,
                "OpportunityType": row["OpportunityType"],
                "overlap": int(row["_overlap"]),
                "similarity": float(row["_sim"]),
                "score": float(row["_score"]),
            }
        )

    avg_package = float(matched["Package"].mean())
    top_companies = matched.groupby("Company")["StudentName"].count().sort_values(ascending=False).head(5).to_dict()
    top_roles = matched.groupby("JobRole")["StudentName"].count().sort_values(ascending=False).head(5).to_dict()
    stats = {
        "matched_count": matched_count,
        "matched_pct": round(matched_count / max(total_students, 1) * 100, 2),
        "avg_package": round(avg_package, 2),
        "top_companies": top_companies,
        "top_roles": top_roles,
    }

    return {
        "matched_students": matched_students,
        "stats": stats,
        "roles_for_skills": sorted(roles_set),
        "companies_for_skills": sorted(companies_set),
    }
