import os
import uuid
import requests
import json
import time
from flask import Flask, request, jsonify
from datetime import datetime
from typing import List, Dict, Any

# --- Configuration and Initialization ---

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

# --- Gemini Structured Output Schema ---
# Defines the exact JSON structure the model must return for the roadmap.
ROADMAP_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "goal": {"type": "STRING", "description": "The specific learning goal (e.g., 'React Developer')."},
        "generated_for": {
            "type": "OBJECT",
            "properties": {
                "hours_per_week": {"type": "NUMBER"},
                "total_weeks": {"type": "NUMBER"},
                "current_skills": {"type": "ARRAY", "items": {"type": "STRING"}}
            }
        },
        "milestones": {
            "type": "ARRAY",
            "description": "A list of detailed learning modules or milestones.",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "title": {"type": "STRING", "description": "The title of the module/milestone (e.g., 'JavaScript Fundamentals')."},
                    "start_week": {"type": "NUMBER", "description": "The starting week number (1-indexed)."},
                    "end_week": {"type": "NUMBER", "description": "The ending week number."},
                    "duration_weeks": {"type": "NUMBER"},
                    "estimated_hours_per_week": {"type": "NUMBER"},
                    "tasks": {
                        "type": "ARRAY",
                        "description": "A list of 3-5 specific, actionable learning tasks for this milestone.",
                        "items": {"type": "STRING"}
                    },
                    "resources": {
                        "type": "ARRAY",
                        "description": "A list of suggested online learning resources (URL and Title).",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "title": {"type": "STRING"},
                                "url": {"type": "STRING"}
                            }
                        }
                    }
                },
                "required": ["title", "start_week", "end_week", "tasks", "resources"]
            }
        },
        "advice": {
            "type": "ARRAY",
            "description": "3-5 personalized tips for success based on the user's constraints.",
            "items": {"type": "STRING"}
        }
    },
    "required": ["goal", "milestones", "advice"]
}

# --- Flask Setup ---
app = Flask(__name__)

# --- Core Logic ---

def generate_roadmap(goal: str, current_skills: List[str], hours_per_week: float, weeks: int) -> Dict[str, Any]:
    """Call the Gemini API to generate a structured learning path. (Renamed to generate_roadmap to fix ImportError)"""

    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY is missing. Returning mock data.")
        return {
            "goal": goal,
            "generated_for": {"hours_per_week": hours_per_week, "total_weeks": weeks, "current_skills": current_skills},
            "milestones": [{
                "title": "API Key Missing - Configure Backend",
                "start_week": 1, "end_week": weeks, "duration_weeks": weeks,
                "estimated_hours_per_week": hours_per_week,
                "tasks": ["Set GEMINI_API_KEY in the backend environment", "Restart the Python server"],
                "resources": [{"title": "Get Gemini API Key", "url": "https://ai.google.com/studio"}]
            }],
            "advice": ["Roadmap generation is currently disabled. Check the console for errors."]
        }

    system_prompt = (
        "You are an expert career and learning coach. Generate a detailed, highly structured study roadmap "
        f"for the user's goal. The total duration must fit exactly within {weeks} weeks, and the weekly commitment "
        "should not exceed the specified hours. The output MUST strictly adhere to the provided JSON schema."
    )
    user_query = (
        f"Generate a {weeks}-week learning roadmap for the goal: '{goal}'. "
        f"The user currently knows these skills: {', '.join(current_skills) if current_skills else 'None'}. "
        f"They can commit to {hours_per_week} hours per week. "
        "Create 4-6 sequential milestones. For each milestone, provide specific tasks and at least one high-quality resource URL."
    )

    payload = {
        "contents": [{"parts": [{"text": user_query}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": { 
            "responseMimeType": "application/json",
            "responseSchema": ROADMAP_SCHEMA
        }
    }

    headers = {'Content-Type': 'application/json'}
    url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
    max_retries = 3

    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=30)
            response.raise_for_status()
            
            result = response.json()
            json_text = result['candidates'][0]['content']['parts'][0]['text']
            # Sometimes Gemini adds markdown code blocks around the JSON; strip them if necessary
            json_text = json_text.strip().lstrip('```json').rstrip('```')
            return json.loads(json_text)

        except requests.exceptions.RequestException as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt
                print(f"Gemini API Error: {e}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"Gemini API failed after {max_retries} retries: {e}")
                raise RuntimeError(f"Failed to generate roadmap: {e}")
        except Exception as e:
            print(f"JSON Parsing Error: {e}. Raw response: {response.text if 'response' in locals() else 'N/A'}")
            raise RuntimeError(f"Invalid response format from AI: {e}")

    return {} # Should be unreachable

# --- Flask Routes ---

@app.route('/api/learning-path', methods=['POST'])
def learning_path_endpoint():
    try:
        data = request.get_json()
        goal = data.get('goal', 'Software Developer')
        current_skills = data.get('current_skills', [])
        hours_per_week = data.get('hours_per_week', 5.0)
        weeks = data.get('weeks', 8)

        # Call the renamed function
        roadmap = generate_roadmap(goal, current_skills, hours_per_week, weeks)

        if roadmap:
            return jsonify({"status": "ok", "roadmap": roadmap})
        else:
            return jsonify({"status": "error", "message": "Failed to generate roadmap from AI."}), 500

    except RuntimeError as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    except Exception as e:
        print(f"Unhandled error in learning path endpoint: {e}")
        return jsonify({"status": "error", "message": f"An unhandled server error occurred: {e}"}), 500

if __name__ == '__main__':
    # Flask runs on port 5000 as expected by the frontend
    app.run(host='0.0.0.0', port=5000, debug=True)
