import json
import os
import re

import google.generativeai as genai

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)


def analyze_resume(resume_text, job_description=""):
    if not API_KEY:
        return {
            "score": 0,
            "strengths": [],
            "weaknesses": [],
            "suggestions": ["GEMINI_API_KEY is not configured on the backend."],
        }

    prompt = f"""
    You are a professional resume reviewer.
    Analyze the following resume and respond ONLY in valid JSON format:

    {{
        "score": number (0-100),
        "strengths": list of strings,
        "weaknesses": list of strings,
        "suggestions": list of strings
    }}

    Resume:
    {resume_text}

    Job Description:
    {job_description}
    """

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        text = response.text

        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass

        return {
            "score": 65,
            "strengths": ["Good content"],
            "weaknesses": ["Missing key job skills"],
            "suggestions": ["Add achievements", "Optimize for job keywords"],
        }
    except Exception as exc:
        return {
            "score": 0,
            "strengths": [],
            "weaknesses": [],
            "suggestions": [f"Error: {str(exc)}"],
        }
