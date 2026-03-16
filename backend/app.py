# # app.py
# import os
# from dotenv import load_dotenv

# # --- THIS MUST BE THE FIRST THING YOU DO ---
# load_dotenv()

# # Now import other project-specific modules that rely on .env variables
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from resume_analyzer import analyze_resume, export_analysis_to_pdf, export_analysis_to_excel
# from io import BytesIO
# from opportunity_model import train_model, predict_opportunity, recommend_from_trends, load_dataset
# from learning_path import generate_roadmap

# from datetime import datetime
# from pymongo import MongoClient
# import uuid
# import PyPDF2  # New import to handle PDFs

# # =========================
# # CONFIGURATION & SETUP
# # =========================

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# app = Flask(__name__)
# CORS(app)



# UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # ==== MONGODB CONNECTION ====


# # Helper function to extract text from a PDF file
# def extract_text_from_pdf(pdf_file):
#     pdf_reader = PyPDF2.PdfReader(pdf_file)
#     text = ""
#     for page_num in range(len(pdf_reader.pages)):
#         text += pdf_reader.pages[page_num].extract_text()
#     return text

# # =========================
# # RESUME ANALYZER ROUTES (UPDATED)
# # =========================
# @app.route('/api/analyze-resume', methods=['POST'])
# def analyze():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file provided"}), 400
    
#     file = request.files['file']
#     job_description = request.form.get('job_description', '')

#     try:
#         # Extract text from the PDF file
#         resume_text = extract_text_from_pdf(file)
#         # Call the Gemini analysis function from resume_analyzer.py
#         result = analyze_resume(resume_text, job_description)
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # =========================
# # JOB & APPLICATION ROUTES
# # =========================
# @app.route("/api/jobs", methods=["POST"])
# def create_job():
#     try:
#         data = request.get_json()
#         if not data:
#             return jsonify({"error": "No data provided"}), 400

#         jobs_collection.insert_one({
#             "companyName": data.get("companyName"),
#             "jobRole": data.get("jobRole"),
#             "location": data.get("location")
#         })
#         return jsonify({"message": "Job posted successfully"}), 201
#     except Exception as e:
#         print("Error inserting job:", e)
#         return jsonify({"error": "Server error"}), 500

# @app.route("/api/jobs", methods=["GET"])
# def get_jobs():
#     try:
#         jobs = list(jobs_collection.find({}, {"_id": 0}))
#         return jsonify(jobs)
#     except Exception as e:
#         print("Error fetching jobs:", e)
#         return jsonify({"error": "Server error"}), 500
    
# @app.route("/api/apply/<job_id>", methods=["POST"])
# def apply_job(job_id):
#     try:
#         data = request.form
#         application = {
#             "_id": str(uuid.uuid4()),
#             "job_id": job_id,
#             "name": data.get("name"),
#             "email": data.get("email"),
#             "resume": request.files["resume"].filename if "resume" in request.files else None,
#             "applied_at": datetime.utcnow()
#         }
#         applications_collection.insert_one(application)
#         return jsonify({"message": "Application submitted successfully"}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/test_mongo", methods=["GET"])
# def test_mongo():
#     try:
#         db.command("ping")
#         return jsonify({"message": "MongoDB Atlas connection successful"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


#         if f.filename == "":
#             return jsonify({"status": "error", "message": "Empty filename"}), 400

#         path = save_upload(f)
#         analysis = analyze_file(path)

#         try:
#             os.remove(path)
#         except Exception:
#             pass

#         return jsonify({"status": "ok", "analysis": analysis}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# # =========================
# # LEARNING PATH ROUTES
# # =========================
# @app.route("/api/learning-path", methods=["POST"])
# def api_learning_path():
#     try:
#         data = request.get_json() or {}
#         goal = data.get("goal", "")
#         current_skills = data.get("current_skills", [])
#         hours_per_week = float(data.get("hours_per_week", 5.0))
#         weeks = int(data.get("weeks", 8))
#         roadmap = generate_roadmap(goal, current_skills, hours_per_week, weeks)
#         return jsonify({"status":"ok", "roadmap": roadmap}), 200
#     except Exception as e:
#         return jsonify({"status":"error","message": str(e)}), 500


# # =========================
# # OPPORTUNITY MODEL ROUTES
# # =========================
# @app.route("/api/train-opportunity", methods=["POST"])
# def api_train():
#     try:
#         path = train_model()
#         return jsonify({"status": "ok", "message": f"Model trained: {path}"}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# @app.route("/api/predict-opportunity", methods=["POST"])
# def api_predict():
#     try:
#         data = request.get_json() or {}
#         branch = data.get("branch", "")
#         cgpa = float(data.get("cgpa", 0.0))
#         skills_raw = data.get("skills", "")
#         skills = [s.strip() for s in skills_raw.split(",")] if isinstance(skills_raw, str) else skills_raw
#         year = data.get("year", None)
#         res = predict_opportunity(branch, cgpa, skills, year)
#         return jsonify({"status": "ok", "prediction": res}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


# # =========================
# # RECOMMENDATION ROUTES
# # =========================
# @app.route("/api/recommend-from-trends", methods=["POST"])
# def api_recommend_trends():
#     try:
#         data = request.get_json() or {}
#         branch = data.get("branch", "")
#         cgpa = float(data.get("cgpa")) if data.get("cgpa") not in (None, "") else None
#         skills_raw = data.get("skills", "")
#         skills = [s.strip() for s in skills_raw.split(",")] if isinstance(skills_raw, str) else skills_raw
#         year = data.get("year", None)
#         top_k = int(data.get("top_k", 10))
#         res = recommend_from_trends(skills_input=skills, branch=branch, cgpa=cgpa, year=year, top_k=top_k)
#         response = {
#             "roles_for_skills": res.get("roles_for_skills", []),
#             "companies_for_skills": res.get("companies_for_skills", []),
#             "matched_students": res.get("matched_students", []),
#             "stats": res.get("stats", {}),
#             "predicted": res.get("predicted", None)
#         }
#         return jsonify({"status": "ok", "result": response}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


# # =========================
# # SAMPLE DATA ROUTE
# # =========================
# @app.route("/api/sample-data", methods=["GET"])
# def api_sample():
#     try:
#         df = load_dataset()
#         sample = df.head(20).to_dict(orient="records")
#         return jsonify({"status": "ok", "sample": sample}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


# # =========================
# # ROOT ROUTE
# # =========================
# @app.route("/", methods=["GET"])
# def root():
#     return jsonify({"message": "Placement AI API"}), 200


# if __name__ == "__main__":
#     os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
#     app.run(debug=True, host="0.0.0.0", port=5000)








# # app.py
# import os
# from dotenv import load_dotenv

# # --- THIS MUST BE THE FIRST THING YOU DO ---
# load_dotenv()

# # Now import other project-specific modules that rely on .env variables
# from flask import Flask, request, jsonify, send_file, make_response
# from flask_cors import CORS
# from resume_analyzer import analyze_resume, export_analysis_to_pdf, export_analysis_to_excel
# from io import BytesIO
# from opportunity_model import train_model, predict_opportunity, recommend_from_trends, load_dataset
# from learning_path import generate_roadmap

# from datetime import datetime, timedelta
# from pymongo import MongoClient
# import uuid
# import PyPDF2  # New import to handle PDFs
# import bcrypt
# import jwt
# from functools import wraps

# # =========================
# # CONFIGURATION & SETUP
# # =========================

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# app = Flask(__name__)
# # Allow all origins, and expose the 'Authorization' header
# CORS(app, expose_headers=['Authorization'])

# # --- Environment Variables ---
# MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
# JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_fallback_secret_key_CHANGE_ME")

# if JWT_SECRET_KEY == "default_fallback_secret_key_CHANGE_ME":
#     print("WARNING: Using default JWT_SECRET_KEY. Please set a secure key in your .env file.", flush=True)

# # --- Uploads Folder ---
# UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # ==== MONGODB CONNECTION ====
# try:
#     client = MongoClient(MONGO_URI)
#     db = client.placemelatest # Database name
#     students_collection = db.students # Collection for registered users
#     whitelist_collection = db.whitelisted_rolls # Collection for predefined roll numbers
    
#     client.server_info()
#     print(f"MongoDB connection to {MONGO_URI} successful. Database: 'placemelatest'", flush=True)

#     if whitelist_collection.count_documents({}) == 0:
#         print("Whitelisted rolls collection is empty. Populating with test data...", flush=True)
#         whitelist_collection.insert_many([
#             {"roll_number": "CS2023001"},
#             {"roll_number": "EC2023002"}
#         ])
#         print("Test data populated.", flush=True)

# except Exception as e:
#     print(f"CRITICAL: Failed to connect to MongoDB at {MONGO_URI}. Error: {e}", flush=True)
#     db = None
#     students_collection = None
#     whitelist_collection = None


# # Helper function to extract text from a PDF file
# def extract_text_from_pdf(pdf_file):
#     pdf_reader = PyPDF2.PdfReader(pdf_file)
#     text = ""
#     for page_num in range(len(pdf_reader.pages)):
#         text += pdf_reader.pages[page_num].extract_text()
#     return text

# # =========================
# # AUTHENTICATION DECORATOR (UPDATED)
# # =========================

# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         # FIX: Handle OPTIONS pre-flight request *before* checking for token
#         # Made check case-insensitive and stripped whitespace for robustness.
#         if request.method.strip().upper() == "OPTIONS":
#             return _build_cors_preflight_response()
            
#         token = None
        
#         # Look for 'Authorization: Bearer <token>' header
#         if 'authorization' in request.headers:
#             auth_header = request.headers.get('authorization')
#             if auth_header and auth_header.startswith('Bearer '):
#                 token = auth_header.split(' ')[1]
        
#         # Fallback for old x-access-token (optional)
#         elif 'x-access-token' in request.headers:
#             token = request.headers['x-access-token']

#         if not token:
#             return jsonify({'error': 'Token is missing!'}), 401

#         try:
#             data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
#             current_user = students_collection.find_one({'roll_number': data['user_id']})
#             if not current_user:
#                 return jsonify({'error': 'User not found.'}), 404
            
#             current_user['_id'] = str(current_user['_id'])
            
#         except jwt.ExpiredSignatureError:
#             return jsonify({'error': 'Token has expired!'}), 401
#         except jwt.InvalidTokenError:
#             return jsonify({'error': 'Token is invalid!'}), 401
#         except Exception as e:
#             return jsonify({'error': f'An error occurred: {str(e)}'}), 500

#         return f(current_user, *args, **kwargs)
#     return decorated

# # =========================
# # AUTHENTICATION ROUTES (UPDATED)
# # =========================

# @app.route("/api/register", methods=["POST", "OPTIONS"])
# def register():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()

#     if db is None:
#         return jsonify({"error": "Database connection not configured."}), 500
        
#     try:
#         data = request.get_json()
#         roll_number = data.get('rollNumber')
#         college_email = data.get('collegeEmail')
#         password = data.get('password')

#         if not all([roll_number, college_email, password]):
#             return jsonify({"error": "Missing data. Roll number, email, and password are required."}), 400

#         if not whitelist_collection.find_one({"roll_number": roll_number}):
#             return jsonify({"error": "This roll number is not authorized to register."}), 403

#         if students_collection.find_one({"roll_number": roll_number}):
#             return jsonify({"error": "This roll number is already registered."}), 409
#         if students_collection.find_one({"college_email": college_email}):
#             return jsonify({"error": "This email is already registered."}), 409

#         hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
#         new_user = {
#             "roll_number": roll_number,
#             "college_email": college_email,
#             "password_hash": hashed_password,
#             "username": f"student_{roll_number}", 
#             "profile_photo_url": f"https://api.dicebear.com/8.x/initials/svg?seed={roll_number}",
#             "created_at": datetime.utcnow(),
#             "summary": "", # New field for profile completion
#             "phone": ""    # New field for profile completion
#         }
#         students_collection.insert_one(new_user)
        
#         token = jwt.encode({
#             'user_id': new_user['roll_number'],
#             'exp': datetime.utcnow() + timedelta(hours=24)
#         }, JWT_SECRET_KEY, algorithm="HS256")

#         return jsonify({
#             "message": "User registered successfully!",
#             "token": token,
#             "user": {
#                 "roll_number": new_user['roll_number'],
#                 "username": new_user.get('username'),
#                 "email": new_user['college_email'],
#                 "profile_photo_url": new_user.get('profile_photo_url'),
#                 "summary": new_user.get('summary'),
#                 "phone": new_user.get('phone')
#             },
#             "profileComplete": False # Frontend expects this
#         }), 201

#     except Exception as e:
#         print(f"Error in /api/register: {e}", flush=True)
#         return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

# @app.route("/api/login", methods=["POST", "OPTIONS"])
# def login():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()

#     if db is None:
#         return jsonify({"error": "Database connection not configured."}), 500

#     try:
#         data = request.get_json()
#         roll_number = data.get('rollNumber')
#         password = data.get('password')

#         if not roll_number or not password:
#             return jsonify({"error": "Roll number and password are required."}), 400

#         user = students_collection.find_one({"roll_number": roll_number})

#         if not user:
#             return jsonify({"error": "Roll number not found. Please register."}), 404

#         if bcrypt.checkpw(password.encode('utf-8'), user['password_hash']):
#             token = jwt.encode({
#                 'user_id': user['roll_number'],
#                 'exp': datetime.utcnow() + timedelta(hours=24)
#             }, JWT_SECRET_KEY, algorithm="HS256")

#             profile_complete = bool(user.get('summary') and user.get('phone'))

#             return jsonify({
#                 "message": "Login successful!",
#                 "token": token,
#                 "user": {
#                     "roll_number": user['roll_number'],
#                     "username": user.get('username'),
#                     "email": user['college_email'],
#                     "profile_photo_url": user.get('profile_photo_url'),
#                     "summary": user.get('summary', ''), # Add summary
#                     "phone": user.get('phone', '')      # Add phone
#                 },
#                 "profileComplete": profile_complete # Add completion status
#             }), 200
#         else:
#             return jsonify({"error": "Invalid password."}), 401

#     except Exception as e:
#         print(f"Error in /api/login: {e}", flush=True)
#         return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

# @app.route("/api/profile", methods=["GET", "OPTIONS"])
# @token_required
# def get_profile(current_user):
#     # Decorator now handles OPTIONS
        
#     profile_complete = bool(current_user.get('summary') and current_user.get('phone'))

#     return jsonify({
#         "message": "Profile data retrieved successfully.",
#         "user": {
#             "roll_number": current_user['roll_number'],
#             "username": current_user.get('username'),
#             "email": current_user['college_email'],
#             "profile_photo_url": current_user.get('profile_photo_url'),
#             "summary": current_user.get('summary', ''), # Add summary
#             "phone": current_user.get('phone', '')      # Add phone
#         },
#         "profileComplete": profile_complete # Add completion status
#     }), 200

# @app.route("/api/profile", methods=["PUT", "OPTIONS"])
# @token_required
# def update_profile(current_user):
#     # Decorator now handles OPTIONS

#     try:
#         data = request.get_json()
#         update_fields = {}

#         if 'username' in data:
#             update_fields['username'] = data['username']
#         if 'summary' in data:
#             update_fields['summary'] = data['summary']
#         if 'phone' in data:
#             update_fields['phone'] = data['phone']
#         if 'profile_photo_url' in data:
#             update_fields['profile_photo_url'] = data['profile_photo_url']

#         if 'new_password' in data and data['new_password']:
#             if 'old_password' not in data:
#                 return jsonify({"error": "Old password is required to set a new password."}), 400
            
#             if not bcrypt.checkpw(data['old_password'].encode('utf-8'), current_user['password_hash']):
#                 return jsonify({"error": "Invalid old password."}), 403
            
#             new_hashed_password = bcrypt.hashpw(data['new_password'].encode('utf-8'), bcrypt.gensalt())
#             update_fields['password_hash'] = new_hashed_password

#         if not update_fields:
#             return jsonify({"error": "No update fields provided."}), 400

#         students_collection.update_one(
#             {"roll_number": current_user['roll_number']},
#             {"$set": update_fields}
#         )
        
#         updated_user = students_collection.find_one({"roll_number": current_user['roll_number']})

#         return jsonify({
#             "message": "Profile updated successfully!",
#             "user": {
#                 "username": updated_user.get('username'),
#                 "profile_photo_url": updated_user.get('profile_photo_url'),
#                 "summary": updated_user.get('summary', ''),
#                 "phone": updated_user.get('phone', '')
#             }
#         }), 200

#     except Exception as e:
#         print(f"Error in /api/profile PUT: {e}", flush=True)
#         return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500


# # =========================
# # CORS Pre-flight Helper
# # =========================
# def _build_cors_preflight_response():
#     """Helper function to build a CORS pre-flight response."""
#     response = make_response()
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization,x-access-token")
#     response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
#     return response

# # =========================
# # RESUME ANALYZER ROUTES
# # =========================
# @app.route('/api/analyze-resume', methods=['POST'])
# def analyze():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file provided"}), 400
    
#     file = request.files['file']
#     job_description = request.form.get('job_description', '')

#     try:
#         resume_text = extract_text_from_pdf(file)
#         result = analyze_resume(resume_text, job_description)
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # =========================
# # JOB & APPLICATION ROUTES
# # =========================

# if db is not None:
#     jobs_collection = db.jobs
#     applications_collection = db.applications
# else:
#     jobs_collection = None
#     applications_collection = None


# @app.route("/api/jobs", methods=["POST"])
# def create_job():
#     if jobs_collection is None:
#         return jsonify({"error": "Database connection not configured."}), 500
#     try:
#         data = request.get_json()
#         if not data:
#             return jsonify({"error": "No data provided"}), 400

#         jobs_collection.insert_one({
#             "companyName": data.get("companyName"),
#             "jobRole": data.get("jobRole"),
#             "location": data.get("location")
#         })
#         return jsonify({"message": "Job posted successfully"}), 201
#     except Exception as e:
#         print("Error inserting job:", e, flush=True)
#         return jsonify({"error": "Server error"}), 500

# @app.route("/api/jobs", methods=["GET"])
# def get_jobs():
#     if jobs_collection is None:
#         return jsonify({"error": "Database connection not configured."}), 500
#     try:
#         jobs = list(jobs_collection.find({}, {"_id": 0}))
#         return jsonify(jobs)
#     except Exception as e:
#         print("Error fetching jobs:", e, flush=True)
#         return jsonify({"error": "Server error"}), 500
    
# @app.route("/api/apply/<job_id>", methods=["POST"])
# def apply_job(job_id):
#     if applications_collection is None:
#         return jsonify({"error": "Database connection not configured."}), 500
#     try:
#         data = request.form
#         application = {
#             "_id": str(uuid.uuid4()),
#             "job_id": job_id,
#             "name": data.get("name"),
#             "email": data.get("email"),
#             "resume": request.files["resume"].filename if "resume" in request.files else None,
#             "applied_at": datetime.utcnow()
#         }
#         applications_collection.insert_one(application)
#         return jsonify({"message": "Application submitted successfully"}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/test_mongo", methods=["GET"])
# def test_mongo():
#     if db is None:
#         return jsonify({"error": "Database connection failed on startup."}), 500
#     try:
#         client.server_info()
#         return jsonify({"message": "MongoDB connection successful"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


#         if f.filename == "":
#             return jsonify({"status": "error", "message": "Empty filename"}), 400

#         path = save_upload(f) 
#         analysis = analyze_file(path) 

#         try:
#             os.remove(path)
#         except Exception:
#             pass

#         return jsonify({"status": "ok", "analysis": analysis}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# # =========================
# # LEARNING PATH ROUTES
# # =========================
# @app.route("/api/learning-path", methods=["POST"])
# def api_learning_path():
#     try:
#         data = request.get_json() or {}
#         goal = data.get("goal", "")
#         current_skills = data.get("current_skills", [])
#         hours_per_week = float(data.get("hours_per_week", 5.0))
#         weeks = int(data.get("weeks", 8))
#         roadmap = generate_roadmap(goal, current_skills, hours_per_week, weeks)
#         return jsonify({"status":"ok", "roadmap": roadmap}), 200
#     except Exception as e:
#         return jsonify({"status":"error","message": str(e)}), 500


# # =========================
# # OPPORTUNITY MODEL ROUTES
# # =========================
# @app.route("/api/train-opportunity", methods=["POST"])
# def api_train():
#     try:
#         path = train_model()
#         return jsonify({"status": "ok", "message": f"Model trained: {path}"}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# @app.route("/api/predict-opportunity", methods=["POST"])
# def api_predict():
#     try:
#         data = request.get_json() or {}
#         branch = data.get("branch", "")
#         cgpa = float(data.get("cgpa", 0.0))
#         skills_raw = data.get("skills", "")
#         skills = [s.strip() for s in skills_raw.split(",")] if isinstance(skills_raw, str) else skills_raw
#         year = data.get("year", None)
#         res = predict_opportunity(branch, cgpa, skills, year)
#         return jsonify({"status": "ok", "prediction": res}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


# # =========================
# # RECOMMENDATION ROUTES
# # =========================
# @app.route("/api/recommend-from-trends", methods=["POST"])
# def api_recommend_trends():
#     try:
#         data = request.get_json() or {}
#         branch = data.get("branch", "")
#         cgpa = float(data.get("cgpa")) if data.get("cgpa") not in (None, "") else None
#         skills_raw = data.get("skills", "")
#         skills = [s.strip() for s in skills_raw.split(",")] if isinstance(skills_raw, str) else skills_raw
#         year = data.get("year", None)
#         top_k = int(data.get("top_k", 10))
#         res = recommend_from_trends(skills_input=skills, branch=branch, cgpa=cgpa, year=year, top_k=top_k)
#         response = {
#             "roles_for_skills": res.get("roles_for_skills", []),
#             "companies_for_skills": res.get("companies_for_skills", []),
#             "matched_students": res.get("matched_students", []),
#             "stats": res.get("stats", {}),
#             "predicted": res.get("predicted", None)
#         }
#         return jsonify({"status": "ok", "result": response}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


# # =========================
# # SAMPLE DATA ROUTE
# # =========================
# @app.route("/api/sample-data", methods=["GET"])
# def api_sample():
#     try:
#         df = load_dataset()
#         sample = df.head(20).to_dict(orient="records")
#         return jsonify({"status": "ok", "sample": sample}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


# # =========================
# # ROOT ROUTE
# # =========================
# @app.route("/", methods=["GET"])
# def root():
#     return jsonify({"message": "Placement AI API"}), 200


# if __name__ == "__main__":
#     os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
#     app.run(debug=True, host="0.0.0.0", port=5000)









# import os
# from dotenv import load_dotenv

# # --- THIS MUST BE THE FIRST THING YOU DO ---
# load_dotenv()

# # Now import other project-specific modules that rely on .env variables
# from flask import Flask, request, jsonify, send_file, make_response
# from flask_cors import CORS
# from resume_analyzer import analyze_resume, export_analysis_to_pdf, export_analysis_to_excel
# from io import BytesIO
# from opportunity_model import train_model, predict_opportunity, recommend_from_trends, load_dataset
# from learning_path import generate_roadmap

# from datetime import datetime, timedelta
# from pymongo import MongoClient
# import uuid
# import PyPDF2 # New import to handle PDFs
# import bcrypt
# import jwt
# from functools import wraps
# from werkzeug.utils import secure_filename # For file uploads

# # =========================
# # CONFIGURATION & SETUP
# # =========================

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# app = Flask(__name__)
# CORS(app, 
#      resources={r"/api/*": {"origins": "http://localhost:3000"}},
#      supports_credentials=True,
#      expose_headers=["Authorization"],
#      allow_headers=["Content-Type", "Authorization"],
#      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# # --- Environment Variables ---
# MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/placemelatest")
# JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_fallback_secret_key_CHANGE_ME")

# if JWT_SECRET_KEY == "default_fallback_secret_key_CHANGE_ME":
#     print("WARNING: Using default JWT_SECRET_KEY. Please set a secure key in your .env file.", flush=True)

# # --- Uploads Folder ---
# UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# # ==== MONGODB CONNECTION ====
# try:
#     client = MongoClient(MONGO_URI)
#     db = client.placemelatest # Database name
#     students_collection = db.students # Collection for registered users
#     whitelist_collection = db.whitelisted_rolls # Collection for predefined roll numbers
#     jobs_collection = db.jobs  # Collection for job postings

    
#     client.server_info()
#     print(f"MongoDB connection to {MONGO_URI} successful. Database: 'placemelatest'", flush=True)

#     if whitelist_collection.count_documents({}) == 0:
#         print("Whitelisted rolls collection is empty. Populating with test data...", flush=True)
#         whitelist_collection.insert_many([
#             {"roll_number": "CS2023001"},
#             {"roll_number": "EC2023002"}
#         ])
#         print("Test data populated.", flush=True)

# except Exception as e:
#     print(f"CRITICAL: Failed to connect to MongoDB at {MONGO_URI}. Error: {e}", flush=True)
#     db = None
#     students_collection = None
#     whitelist_collection = None


# # Helper function to extract text from a PDF file
# def extract_text_from_pdf(pdf_file):
#     pdf_reader = PyPDF2.PdfReader(pdf_file)
#     text = ""
#     for page_num in range(len(pdf_reader.pages)):
#         text += pdf_reader.pages[page_num].extract_text()
#     return text

# # =========================
# # AUTHENTICATION DECORATOR (UPDATED)
# # =========================

# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         # Handle OPTIONS pre-flight requests
#         if request.method.strip().upper() == "OPTIONS":
#             return _build_cors_preflight_response()
            
#         token = None
        
#         # Check for 'Authorization: Bearer <token>'
#         if 'authorization' in request.headers:
#             auth_header = request.headers.get('authorization')
#             if auth_header and auth_header.startswith('Bearer '):
#                 token = auth_header.split(' ')[1]
        
#         # Fallback check for 'x-access-token'
#         elif 'x-access-token' in request.headers:
#             token = request.headers['x-access-token']

#         if not token:
#             return jsonify({'error': 'Token is missing!'}), 401

#         try:
#             data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
#             current_user = students_collection.find_one({'roll_number': data['user_id']})
#             if not current_user:
#                 return jsonify({'error': 'User not found.'}), 404
            
#             # Convert ObjectId to string for JSON serialization
#             current_user['_id'] = str(current_user['_id'])
            
#         except jwt.ExpiredSignatureError:
#             return jsonify({'error': 'Token has expired!'}), 401
#         except jwt.InvalidTokenError:
#             return jsonify({'error': 'Token is invalid!'}), 401
#         except Exception as e:
#             return jsonify({'error': f'An error occurred: {str(e)}'}), 500

#         # Pass the user object to the decorated function
#         return f(current_user, *args, **kwargs)
#     return decorated

# # =========================
# # AUTHENTICATION ROUTES (UPDATED)
# # =========================

# @app.route("/api/register", methods=["POST", "OPTIONS"])
# def register():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()

#     if db is None:
#         return jsonify({"error": "Database connection not configured."}), 500
        
#     try:
#         data = request.form
#         roll_number = data.get('rollNumber')
#         college_email = data.get('collegeEmail')
#         password = data.get('password')
#         username = data.get('username')
#         branch = data.get('branch')

#         # --- FIX: New, more specific validation ---
#         errors = {}
#         if not roll_number: errors['rollNumber'] = "Roll Number is required."
#         if not college_email: errors['collegeEmail'] = "College Email is required."
#         if not password: errors['password'] = "Password is required."
#         if not username: errors['username'] = "Username is required."
#         if not branch: errors['branch'] = "Branch is required."

#         # Check if 'profilePhoto' key exists AND if a file was actually uploaded
#         if 'profilePhoto' not in request.files or not request.files['profilePhoto'].filename:
#             errors['profilePhoto'] = "Profile photo is required."
        
#         if errors:
#             # Return all validation errors at once
#             return jsonify({"error": "Validation failed", "fields": errors}), 400
        
#         file = request.files['profilePhoto']
#         # --- End of new validation ---

#         # Check whitelist
#         if not whitelist_collection.find_one({"roll_number": roll_number}):
#             return jsonify({"error": "This roll number is not authorized to register."}), 403

#         # Check for existing users
#         if students_collection.find_one({"roll_number": roll_number}):
#             return jsonify({"error": "This roll number is already registered."}), 409
#         if students_collection.find_one({"collegeEmail": college_email}):
#             return jsonify({"error": "This email is already registered."}), 409

#         # Save the uploaded file
#         filename = secure_filename(f"{roll_number}_{file.filename}")
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(file_path)
        
#         profile_photo_url = f"/uploads/{filename}"

#         hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
#         new_user = {
#             "roll_number": roll_number,
#             "collegeEmail": college_email,
#             "password_hash": hashed_password,
#             "username": username,
#             "branch": branch,
#             "profile_photo_url": profile_photo_url,
#             "created_at": datetime.utcnow(),
#             "summary": "", 
#             "phone": ""     
#         }
#         students_collection.insert_one(new_user)
        
#         # Generate token for the new user
#         token = jwt.encode({
#             'user_id': new_user['roll_number'],
#             'exp': datetime.utcnow() + timedelta(hours=24)
#         }, JWT_SECRET_KEY, algorithm="HS256")

#         return jsonify({
#             "message": "User registered successfully!",
#             "token": token,
#             "user": {
#                 "roll_number": new_user['roll_number'],
#                 "username": new_user.get('username'),
#                 "collegeEmail": new_user['collegeEmail'],
#                 "profile_photo_url": new_user.get('profile_photo_url'),
#                 "branch": new_user.get('branch'),
#                 "summary": new_user.get('summary'),
#                 "phone": new_user.get('phone')
#             }
#         }), 201

#     except Exception as e:
#         print(f"Error in /api/register: {e}", flush=True)
#         return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

# @app.route("/api/login", methods=["POST", "OPTIONS"])
# def login():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()

#     if db is None:
#         return jsonify({"error": "Database connection not configured."}), 500

#     try:
#         data = request.get_json()
#         roll_number = data.get('rollNumber')
#         password = data.get('password')

#         if not roll_number or not password:
#             return jsonify({"error": "Roll number and password are required."}), 400

#         user = students_collection.find_one({"roll_number": roll_number})

#         if not user:
#             return jsonify({"error": "Roll number not found. Please register."}), 404

#         if bcrypt.checkpw(password.encode('utf-8'), user['password_hash']):
#             token = jwt.encode({
#                 'user_id': user['roll_number'],
#                 'exp': datetime.utcnow() + timedelta(hours=24)
#             }, JWT_SECRET_KEY, algorithm="HS256")

#             return jsonify({
#                 "message": "Login successful!",
#                 "token": token,
#                 "user": {
#                     "roll_number": user['roll_number'],
#                     "username": user.get('username'),
#                     "collegeEmail": user.get('collegeEmail'),
#                     "profile_photo_url": user.get('profile_photo_url'),
#                     "branch": user.get('branch'),
#                     "summary": user.get('summary', ''),
#                     "phone": user.get('phone', '')
#                 }
#             }), 200
#         else:
#             return jsonify({"error": "Invalid password."}), 401

#     except Exception as e:
#         print(f"Error in /api/login: {e}", flush=True)
#         return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

# # =========================
# # PROFILE & FILE ROUTES (UPDATED)
# # =========================

# @app.route('/uploads/<path:filename>')
# def serve_upload(filename):
#     try:
#         return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#     except FileNotFoundError:
#         return jsonify({"error": "File not found."}), 404

# @app.route("/api/profile", methods=["GET", "OPTIONS"])
# @token_required
# def get_profile(current_user):
#     # The decorator handles OPTIONS and returns the current_user
#     return jsonify({
#         "roll_number": current_user['roll_number'],
#         "username": current_user.get('username'),
#         "collegeEmail": current_user.get('collegeEmail'),
#         "profile_photo_url": current_user.get('profile_photo_url'),
#         "branch": current_user.get('branch'),
#         "summary": current_user.get('summary', ''),
#         "phone": current_user.get('phone', '')
#     }), 200

# @app.route("/api/profile/password", methods=["PUT", "OPTIONS"])
# @token_required
# def update_password(current_user):
#     # The decorator handles OPTIONS
#     try:
#         data = request.get_json()
#         current_password = data.get('currentPassword')
#         new_password = data.get('newPassword')

#         if not current_password or not new_password:
#              return jsonify({"error": "Both current and new passwords are required."}), 400

#         if not bcrypt.checkpw(current_password.encode('utf-8'), current_user['password_hash']):
#             return jsonify({"error": "Invalid current password."}), 403
        
#         if len(new_password) < 6:
#             return jsonify({"error": "New password must be at least 6 characters."}), 400
        
#         new_hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
#         students_collection.update_one(
#             {"roll_number": current_user['roll_number']},
#             {"$set": {"password_hash": new_hashed_password}}
#         )
        
#         return jsonify({"message": "Password updated successfully!"}), 200

#     except Exception as e:
#         print(f"Error in /api/profile/password PUT: {e}", flush=True)
#         return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500


# # =========================
# # CORS Pre-flight Helper
# # =========================
# def _build_cors_preflight_response():
#     """Helper function to build a CORS pre-flight response."""
#     response = make_response()
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization,x-access-token")
#     response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
#     return response

# # =========================
# # ADMIN ROUTES (NEW - As requested)
# # =========================

# @app.route("/api/admin/students", methods=["GET", "OPTIONS"]) # <<< FIX: Added /api prefix
# def get_all_students():
#     """
#     Fetches all students for the admin dashboard.
#     NOTE: This route is NOT protected, as per the demo request.
#     """
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
        
#     if students_collection is None:
#         return jsonify({"error": "Database connection not configured."}), 500
        
#     try:
#         # Find all students, projecting only the fields needed by the frontend
#         all_students_cursor = students_collection.find(
#             {}, 
#             {
#                 "_id": 1, 
#                 "username": 1, 
#                 "roll_number": 1, 
#                 "collegeEmail": 1, 
#                 "branch": 1, 
#                 "profile_photo_url": 1
#             } # IMPORTANT: Exclude password_hash
#         )
        
#         students_list = []
#         for student in all_students_cursor:
#             # Transform keys to camelCase to match frontend component
#             students_list.append({
#                 "id": str(student['_id']),
#                 "username": student.get('username'),
#                 "rollNumber": student.get('roll_number'), # Transform snake_case to camelCase
#                 "collegeEmail": student.get('collegeEmail'),
#                 "branch": student.get('branch'),
#                 "profile_photo_url": student.get('profile_photo_url')
#             })

#         return jsonify({"students": students_list}), 200
        
#     except Exception as e:
#         print(f"Error in /admin/students GET: {e}", flush=True)
#         return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

# @app.route("/api/admin/students/<string:roll_number>", methods=["DELETE", "OPTIONS"]) # <<< FIX: Added /api prefix
# def delete_student(roll_number):
#     """
#     Deletes a specific student by their roll number.
#     NOTE: This route is NOT protected, as per the demo request.
#     """
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
        
#     if students_collection is None:
#         return jsonify({"error": "Database connection not configured."}), 500
        
#     try:
#         # The frontend sends the roll_number from the URL
#         result = students_collection.delete_one({"roll_number": roll_number})
        
#         if result.deleted_count == 0:
#             return jsonify({"error": "Student not found with that roll number."}), 404
            
#         return jsonify({"message": "Student deleted successfully"}), 200
        
#     except Exception as e:
#         print(f"Error in /admin/students DELETE: {e}", flush=True)
#         return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500


# # =========================
# # RESUME ANALYZER ROUTES
# # =========================
# @app.route('/api/analyze-resume', methods=['POST'])
# def analyze_resume_public():
#     """
#     Public endpoint — anyone can analyze a resume (no token required)
#     """
#     if 'file' not in request.files:
#         return jsonify({"error": "No file provided"}), 400

#     file = request.files['file']
#     job_description = request.form.get('job_description', '')

#     try:
#         text = extract_text_from_pdf(file)
#         result = analyze_resume(text, job_description)
#         return jsonify(result), 200
#     except Exception as e:
#         print("Analyze error:", e)
#         return jsonify({"error": str(e)}), 500


# # =========================
# # JOB & APPLICATION ROUTES
# # =========================
# @app.route("/api/jobs", methods=["POST", "OPTIONS"])
# def create_job():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
    
#     if jobs_collection is None:
#         return jsonify({"error": "Database connection not configured."}), 500

#     try:
#         data = request.form  # FormData from frontend

#         # 1. Handle File Upload (Company Image)
#         company_image_path = None
#         if 'companyImage' in request.files:
#             file = request.files['companyImage']
#             if file.filename != '':
#                 filename = secure_filename(
#                     f"job_{data['companyName']}_{datetime.utcnow().timestamp()}.{file.filename.split('.')[-1]}"
#                 )
#                 file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#                 file.save(file_path)
#                 company_image_path = f"/uploads/{filename}"

#         # 2. Basic Validation
#         required_fields = ["companyName", "jobRole", "location", "companyDescription", "applicationLink"]
#         for field in required_fields:
#             if not data.get(field):
#                 return jsonify({"error": f"Missing required field: {field}"}), 400

#         # 3. ✅ Handle Eligible Branches (Multiple selections)
#         # FormData sends multiple values with the same key → getlist()
#         eligible_branches = request.form.getlist("eligibleBranches")
#         # Example: ["Computer Science", "Mechanical"]

#         # 4. Insert into MongoDB
#         jobs_collection.insert_one({
#             "companyName": data.get("companyName"),
#             "jobRole": data.get("jobRole"),
#             "location": data.get("location"),
#             "companyDescription": data.get("companyDescription"),
#             "applicationLink": data.get("applicationLink"),
#             "companyImagePath": company_image_path,
#             "eligibleBranches": eligible_branches,  # ✅ New field added
#             "posted_by": "admin",
#             "posted_at": datetime.utcnow()

#         })

#         return jsonify({"message": "Job posted successfully"}), 201

#     except Exception as e:
#         print("Error inserting job:", e, flush=True)
#         return jsonify({"error": f"Server error: {str(e)}"}), 500


# @app.route("/api/jobs", methods=["GET", "OPTIONS"])
# def get_jobs():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()

#     if jobs_collection is None:
#         return jsonify({"error": "Database connection not configured."}), 500

#     try:
#         # Fetch all jobs, sorted by latest first
#         jobs_cursor = jobs_collection.find().sort("posted_at", -1)

#         jobs_list = []
#         for job in jobs_cursor:
#             job['_id'] = str(job['_id'])  # Convert ObjectId to string
#             job['postedAt'] = job.pop('posted_at').isoformat()  # Convert datetime to string
#             jobs_list.append(job)

#         return jsonify(jobs_list), 200

#     except Exception as e:
#         print("Error fetching jobs:", e, flush=True)
#         return jsonify({"error": f"Server error: {str(e)}"}), 500
    



#         if f.filename == "":
#             return jsonify({"status": "error", "message": "Empty filename"}), 400

#         path = save_upload(f)
#         analysis = analyze_file(path)

#         try:
#             os.remove(path)
#         except Exception:
#             pass

#         return jsonify({"status": "ok", "analysis": analysis}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# # LEARNING PATH ROUTES
# # =========================
# @app.route("/api/learning-path", methods=["POST"])
# def api_learning_path():
#     try:
#         data = request.get_json() or {}
#         goal = data.get("goal", "")
#         current_skills = data.get("current_skills", [])
#         hours_per_week = float(data.get("hours_per_week", 5.0))
#         weeks = int(data.get("weeks", 8))
#         roadmap = generate_roadmap(goal, current_skills, hours_per_week, weeks)
#         return jsonify({"status":"ok", "roadmap": roadmap}), 200
#     except Exception as e:
#         return jsonify({"status":"error","message": str(e)}), 500

# # =========================
# # OPPORTUNITY MODEL ROUTES
# # =========================
# @app.route("/api/train-opportunity", methods=["POST"])
# def api_train():
#     try:
#         path = train_model()
#         return jsonify({"status": "ok", "message": f"Model trained: {path}"}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# @app.route("/api/predict-opportunity", methods=["POST"])
# def api_predict():
#     try:
#         data = request.get_json() or {}
#         branch = data.get("branch", "")
#         cgpa = float(data.get("cgpa", 0.0))
#         skills_raw = data.get("skills", "")
#         skills = [s.strip() for s in skills_raw.split(",")] if isinstance(skills_raw, str) else skills_raw
#         year = data.get("year", None)
#         res = predict_opportunity(branch, cgpa, skills, year)
#         return jsonify({"status": "ok", "prediction": res}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# # =========================
# # RECOMMENDATION ROUTES
# # =========================
# @app.route("/api/recommend-from-trends", methods=["POST"])
# def api_recommend_trends():
#     try:
#         data = request.get_json() or {}
#         branch = data.get("branch", "")
#         cgpa = float(data.get("cgpa")) if data.get("cgpa") not in (None, "") else None
#         skills_raw = data.get("skills", "")
#         skills = [s.strip() for s in skills_raw.split(",")] if isinstance(skills_raw, str) else skills_raw
#         year = data.get("year", None)
#         top_k = int(data.get("top_k", 10))
#         res = recommend_from_trends(skills_input=skills, branch=branch, cgpa=cgpa, year=year, top_k=top_k)
#         response = {
#             "roles_for_skills": res.get("roles_for_skills", []),
#             "companies_for_skills": res.get("companies_for_skills", []),
#             "matched_students": res.get("matched_students", []),
#             "stats": res.get("stats", {}),
#             "predicted": res.get("predicted", None)
#         }
#         return jsonify({"status": "ok", "result": response}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


# # =========================
# # SAMPLE DATA ROUTE
# # =========================
# @app.route("/api/sample-data", methods=["GET"])
# @token_required # Secure this route
# def api_sample(current_user):
#     try:
#         df = load_dataset()
#         sample = df.head(20).to_dict(orient="records")
#         return jsonify({"status": "ok", "sample": sample}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


# # =========================
# # ROOT ROUTE
# # =========================
# @app.route("/", methods=["GET"])
# def root():
#     return jsonify({"message": "Placement AI API"}), 200


# if __name__ == "__main__":
#     os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
#     app.run(debug=True, host="0.0.0.0", port=5000)





import os
import sys
from dotenv import load_dotenv
load_dotenv()

# Prevent Windows console encoding crashes from emoji/unicode log lines.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from resume_analyzer import analyze_resume
from opportunity_model import recommend_from_trends
from learning_path import generate_roadmap
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import uuid, bcrypt, jwt, PyPDF2
from functools import wraps
from io import BytesIO
import requests
import re
import json
from PyPDF2 import PdfReader
from firebase_admin import firestore



# ✅ Firebase imports
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials, firestore

# CONFIGURATION
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)

# ✅ Correct, single clean CORS setup

# CORS(
#     app,
#     resources={r"/api/*": {"origins": "http://localhost:3000"}},  # ✅ no list nesting
#     supports_credentials=True,
#     expose_headers=["Authorization"],
#     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#     allow_headers=["Content-Type", "Authorization"]
# )

from flask_cors import CORS

CORS(app,
     resources={r"/api/*": {
         "origins": [
             "http://localhost:3000",
             "http://localhost:3002",
             "http://127.0.0.1:3000",
             "http://127.0.0.1:3002",
             
             "*"
         ]
     }},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_fallback_secret_key_CHANGE_ME")
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "dbl7zuox6").strip()
CLOUDINARY_UPLOAD_PRESET = os.getenv("CLOUDINARY_UPLOAD_PRESET", "student_photos").strip()
ADMIN_ALLOWED_EMAILS = {
    email.strip().lower()
    for email in os.getenv("ADMIN_ALLOWED_EMAILS", "").split(",")
    if email.strip()
}
RECRUITER_ALLOWED_EMAILS = {
    email.strip().lower()
    for email in os.getenv("RECRUITER_ALLOWED_EMAILS", "").split(",")
    if email.strip()
}

if JWT_SECRET_KEY == "default_fallback_secret_key_CHANGE_ME":
    print("⚠️ WARNING: Using default JWT secret key!", flush=True)

# =========================
# FIREBASE SETUP
# =========================
# try:
#     if not firebase_admin._apps:
#         cred = credentials.Certificate("serviceAccountKey.json")
#         firebase_admin.initialize_app(cred)
#         print("✅ Firebase Admin initialized successfully.")
#      app_ = firebase_admin.get_app()
#      print("🔥 Firebase project:", app_.project_id, flush=True)
#     db = firestore.client()
# except Exception as e:
#     print("🔥 Firebase initialization failed:", e)
#     db = None

import firebase_admin
from firebase_admin import credentials, firestore
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    firebase_service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()
    firebase_service_account_path = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT_PATH",
        os.path.join(BASE_DIR, "serviceAccountkey.json")
    ).strip()
    firebase_credential_source = (
        json.loads(firebase_service_account_json)
        if firebase_service_account_json
        else firebase_service_account_path
    )
    if not firebase_admin._apps:
        cred = credentials.Certificate(
            firebase_credential_source
        )
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin initialized successfully.", flush=True)

    app_ = firebase_admin.get_app()
    print("🔥 Firebase project:", app_.project_id, flush=True)

    db = firestore.client()

except Exception as e:
    print("🔥 Firebase initialization failed:", e, flush=True)
    db = None






# =========================
# HELPER FUNCTIONS
# =========================
def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def upload_to_cloudinary(file_storage, resource_type="auto"):
    """Upload a file to Cloudinary using the shared unsigned preset."""
    if not CLOUDINARY_CLOUD_NAME or not CLOUDINARY_UPLOAD_PRESET:
        raise RuntimeError("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.")

    file_storage.stream.seek(0)
    response = requests.post(
        f"https://api.cloudinary.com/v1_1/{CLOUDINARY_CLOUD_NAME}/{resource_type}/upload",
        data={"upload_preset": CLOUDINARY_UPLOAD_PRESET},
        files={
            "file": (
                file_storage.filename or "upload",
                file_storage.stream,
                file_storage.mimetype or "application/octet-stream",
            )
        },
        timeout=60,
    )
    response.raise_for_status()
    payload = response.json()
    return payload.get("secure_url") or payload.get("url")


def validate_registration_role(email, role):
    normalized_email = (email or "").strip().lower()
    normalized_role = (role or "student").strip().lower()

    if not normalized_email:
        return False, "Email is required."

    if normalized_role not in {"student", "admin", "recruiter"}:
        return False, "Invalid role selected."

    if normalized_role == "admin" and normalized_email not in ADMIN_ALLOWED_EMAILS:
        return False, "You are not authorized to register as admin."

    if normalized_role == "recruiter" and normalized_email not in RECRUITER_ALLOWED_EMAILS:
        return False, "You are not authorized to register as recruiter."

    return True, ""

# =========================
# CORS Pre-flight Helper
def _build_cors_preflight_response():
    """
    Build a minimal preflight (OPTIONS) response.
    Let flask_cors add Access-Control-Allow-Origin (avoid duplicating it).
    """
    response = make_response()
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization,x-access-token")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    response.headers.add("Access-Control-Expose-Headers", "Authorization")
    return response

# =========================
# AUTH DECORATOR
# =========================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method.upper() == "OPTIONS":
            return _build_cors_preflight_response()

        token = None
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
        elif "x-access-token" in request.headers:
            token = request.headers["x-access-token"]

        if not token:
            return jsonify({"error": "Authentication token missing."}), 401

        try:
            decoded = firebase_auth.verify_id_token(token)
            uid = decoded.get("uid")
            user_doc = db.collection("users").document(uid).get()
            if not user_doc.exists:
                return jsonify({"error": "User not found."}), 404
            current_user = user_doc.to_dict()
            current_user["uid"] = uid
            current_user["email"] = decoded.get("email", current_user.get("collegeEmail", ""))
        except Exception as e:
            print("Token verification error:", e, flush=True)
            return jsonify({"error": "Token invalid or expired."}), 401
        return f(current_user, *args, **kwargs)
    return decorated


def roles_required(*allowed_roles):
    allowed = {role.strip().lower() for role in allowed_roles if role}

    def decorator(f):
        @wraps(f)
        @token_required
        def wrapped(current_user, *args, **kwargs):
            user_role = (current_user.get("role") or "").strip().lower()
            if user_role not in allowed:
                return jsonify({"error": "You are not authorized to access this resource."}), 403
            return f(current_user, *args, **kwargs)

        return wrapped

    return decorator

# =========================
# AUTH ROUTES
# =========================
# @app.route("/api/register", methods=["POST", "OPTIONS"])
# def register():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()

#     try:
#         data = request.form
#         roll_number = data.get('rollNumber')
#         email = data.get('collegeEmail')
#         password = data.get('password')
#         username = data.get('username')
#         branch = data.get('branch')

#         # Validation
#         errors = {}
#         for field in ['rollNumber', 'collegeEmail', 'password', 'username', 'branch']:
#             if not data.get(field):
#                 errors[field] = f"{field} is required."
#         if 'profilePhoto' not in request.files or not request.files['profilePhoto'].filename:
#             errors['profilePhoto'] = "Profile photo is required."
#         if errors:
#             return jsonify({"error": "Validation failed", "fields": errors}), 400

#         file = request.files['profilePhoto']
#         filename = secure_filename(f"{roll_number}_{file.filename}")
#         path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(path)
#         profile_url = f"/uploads/{filename}"

#         hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

#         user_ref = db.collection("students").document(roll_number)
#         if user_ref.get().exists:
#             return jsonify({"error": "User already exists."}), 409

#         user_ref.set({
#             "collegeEmail": email,
#             "username": username,
#             "branch": branch,
#             "password_hash": hashed_pw.decode(),
#             "profile_photo_url": profile_url,
#             "created_at": datetime.utcnow(),
#             "summary": "",
#             "phone": ""
#         })

#         token = jwt.encode({
#             'user_id': roll_number,
#             'exp': datetime.utcnow() + timedelta(hours=24)
#         }, JWT_SECRET_KEY, algorithm="HS256")

#         return jsonify({
#             "message": "User registered successfully!",
#             "token": token,
#             "user": {
#                 "roll_number": roll_number,
#                 "username": username,
#                 "collegeEmail": email,
#                 "branch": branch,
#                 "profile_photo_url": profile_url
#             }
#         }), 201
#     except Exception as e:
#         print("🔥 Register error:", e)
#         return jsonify({"error": str(e)}), 500


# @app.route("/api/login", methods=["POST", "OPTIONS"])
# def login():
#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()

#     try:
#         data = request.get_json()
#         roll = data.get('rollNumber')
#         password = data.get('password')

#         user_ref = db.collection("students").document(roll).get()
#         if not user_ref.exists:
#             return jsonify({"error": "User not found."}), 404

#         user = user_ref.to_dict()
#         stored_pw = user.get('password_hash', '').encode('utf-8')
#         if bcrypt.checkpw(password.encode('utf-8'), stored_pw):
#             token = jwt.encode({
#                 'user_id': roll,
#                 'exp': datetime.utcnow() + timedelta(hours=24)
#             }, JWT_SECRET_KEY, algorithm="HS256")
#             return jsonify({
#                 "message": "Login successful!",
#                 "token": token,
#                 "user": {
#                     "roll_number": roll,
#                     "username": user.get('username'),
#                     "collegeEmail": user.get('collegeEmail'),
#                     "branch": user.get('branch'),
#                     "profile_photo_url": user.get('profile_photo_url')
#                 }
#             }), 200
#         else:
#             return jsonify({"error": "Invalid password"}), 401
#     except Exception as e:
#         print("🔥 Login error:", e)
#         return jsonify({"error": str(e)}), 500

@app.route("/api/profile", methods=["GET", "OPTIONS"])
@token_required
def get_profile(current_user):
    return jsonify(current_user), 200


@app.route("/api/auth/validate-registration", methods=["POST", "OPTIONS"])
def validate_registration():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    try:
        data = request.get_json() or {}
        email = data.get("collegeEmail", "").strip()
        role = data.get("role", "student").strip().lower()

        is_valid, message = validate_registration_role(email, role)
        if not is_valid:
            return jsonify({"allowed": False, "message": message}), 403

        existing_user = db.collection("users").where("collegeEmail", "==", email).limit(1).stream()
        if any(True for _ in existing_user):
            return jsonify({
                "allowed": False,
                "message": "This email is already registered. Please login instead."
            }), 409

        return jsonify({"allowed": True, "message": "Registration allowed."}), 200
    except Exception as e:
        print("Registration validation error:", e, flush=True)
        return jsonify({"allowed": False, "message": str(e)}), 500

# =========================
# ADMIN ROUTES
# =========================
@app.route("/api/admin/students", methods=["GET", "OPTIONS"])
@roles_required("admin")
def get_all_students(current_user):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    try:
        students = []
        docs = db.collection("users").where("role", "==", "student").stream()
        for d in docs:
            s = d.to_dict()
            s['id'] = d.id
            students.append(s)
        return jsonify({"students": students}), 200
    except Exception as e:
        print("🔥 Admin fetch students error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/admin/students/<string:roll_number>", methods=["DELETE", "OPTIONS"])
@roles_required("admin")
def delete_student(current_user, roll_number):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    try:
        ref = db.collection("users").document(roll_number)
        snapshot = ref.get()
        if not snapshot.exists:
            return jsonify({"error": "Student not found"}), 404
        user_data = snapshot.to_dict() or {}
        if (user_data.get("role") or "").strip().lower() != "student":
            return jsonify({"error": "Target user is not a student"}), 400
        ref.delete()
        return jsonify({"message": "Student deleted successfully"}), 200
    except Exception as e:
        print("🔥 Delete student error:", e)
        return jsonify({"error": str(e)}), 500

# =========================
# JOB ROUTES (Firestore)
# =========================
@app.route("/api/jobs", methods=["POST", "OPTIONS"])
@roles_required("admin")
def create_job(current_user):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    try:
        data = request.form

        companyName = data.get("companyName")
        jobRole = data.get("jobRole")
        location = data.get("location")
        companyDescription = data.get("companyDescription")
        applicationLink = data.get("applicationLink")
        eligibleBranches = request.form.getlist("eligibleBranches")

        file = request.files.get("companyImage")

        image_url = None
        if file:
            image_url = upload_to_cloudinary(file, resource_type="auto")

        job_data = {
            "companyName": companyName,
            "jobRole": jobRole,
            "location": location,
            "companyDescription": companyDescription,
            "applicationLink": applicationLink,
            "companyImagePath": image_url,
            "eligibleBranches": eligibleBranches,
            "postedAt": datetime.utcnow().isoformat(),
            "posted_by": current_user.get("uid")
        }

        firestore.client().collection("jobs").add(job_data)

        return jsonify({"message": "Job posted successfully"}), 201

    except Exception as e:
        print("🔥 Error creating job (admin):", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/recruiter/jobs", methods=["POST", "OPTIONS"])
@roles_required("recruiter")
def recruiter_post_job(current_user):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    try:
        data = request.get_json() or {}

        job_data = {
            "companyName": data.get("companyName"),
            "jobRole": data.get("jobRole"),
            "location": data.get("location"),
            "companyDescription": data.get("companyDescription"),
            "applicationLink": data.get("applicationLink"),
            "eligibleBranches": data.get("eligibleBranches", []),
            "companyImagePath": None,
            "postedAt": datetime.utcnow().isoformat(),
            "posted_by": current_user.get("uid")
        }

        firestore.client().collection("jobs").add(job_data)

        return jsonify({"message": "Recruiter job posted"}), 201

    except Exception as e:
        print("🔥 Recruiter job error:", e)
        return jsonify({"error": str(e)}), 500


     
           

@app.route("/api/jobs", methods=["GET", "OPTIONS"])
def get_jobs():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    try:
        jobs_ref = firestore.client().collection("jobs")
        docs = jobs_ref.order_by("postedAt", direction=firestore.Query.DESCENDING).stream()

        job_list = []
        for d in docs:
            data = d.to_dict()
            data["_id"] = d.id

            # postedAt may be Timestamp, datetime, or already string
            posted_at = data.get("postedAt")

            if hasattr(posted_at, "isoformat"):
                data["postedAt"] = posted_at.isoformat()
            else:
                # keep string as it is
                data["postedAt"] = str(posted_at)

            job_list.append(data)

        return jsonify(job_list), 200

    except Exception as e:
        print("🔥 Fetch jobs error:", e)
        return jsonify({"error": str(e)}), 500



@app.route("/api/jobs/<job_id>", methods=["DELETE", "OPTIONS"])
@roles_required("admin", "recruiter")
def delete_job(current_user, job_id):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    try:
        ref = db.collection("jobs").document(job_id)
        snapshot = ref.get()
        if not snapshot.exists:
            return jsonify({"error": "Job not found"}), 404
        job_data = snapshot.to_dict() or {}
        user_role = (current_user.get("role") or "").strip().lower()
        if user_role == "recruiter" and job_data.get("posted_by") != current_user.get("uid"):
            return jsonify({"error": "Recruiters can delete only their own jobs"}), 403
        ref.delete()
        print(f"🗑️ Deleted job {job_id}")
        return jsonify({"message": "Job deleted successfully"}), 200
    except Exception as e:
        print("🔥 Delete job error:", e)
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/analyze-google-sheet", methods=["POST", "OPTIONS"])
@roles_required("admin")
def analyze_google_sheet(current_user):
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    try:
        data = request.get_json()
        sheet_url = data.get("url")
        if not sheet_url:
            return jsonify({"error": "No Google Sheet URL provided."}), 400

        # Convert to export link
        if "/edit" in sheet_url:
            sheet_url = sheet_url.split("/edit")[0] + "/gviz/tq?tqx=out:csv"

        r = requests.get(sheet_url)
        if r.status_code != 200:
            return jsonify({"error": f"Failed to access sheet: {r.status_code}"}), 400

        text = r.text
        rows = [line.split(",") for line in text.splitlines() if line.strip()]
        if not rows or len(rows) < 2:
            return jsonify({"error": "Sheet has no valid data."}), 400

        header = [h.strip().lower() for h in rows[0]]
        branch_idx = next((i for i, h in enumerate(header) if "branch" in h or "department" in h), None)

        per_branch = {
            "Computer Science": 0,
            "Electronics": 0,
            "Civil": 0,
            "Mechanical": 0,
            "Electrical": 0,
        }

        total = 0
        if branch_idx is not None:
            for row in rows[1:]:
                if branch_idx < len(row):
                    val = row[branch_idx].strip().lower()
                    if "computer" in val or "cse" in val:
                        per_branch["Computer Science"] += 1
                    elif "electronic" in val or "ece" in val:
                        per_branch["Electronics"] += 1
                    elif "civil" in val:
                        per_branch["Civil"] += 1
                    elif "mech" in val:
                        per_branch["Mechanical"] += 1
                    elif "electrical" in val:
                        per_branch["Electrical"] += 1
                    total += 1

        return jsonify({"total": total, "perBranch": per_branch}), 200

    except Exception as e:
        print("🔥 analyze-google-sheet error:", str(e))
        return jsonify({"error": str(e)}), 500
    

# //autoshortlisted students route
# ===========================================
# ✅ AUTO-SHORTLIST RESUMES (Firebase version)
# ===========================================
@app.route("/api/shortlist-resumes", methods=["POST"])
@roles_required("admin")
def shortlist_resumes(current_user):
    """
    Admin uploads multiple resumes and selects a company.
    This function fetches the job description from Firebase Firestore
    and compares resume content for matching.
    """
    try:
        import re
        from PyPDF2 import PdfReader
        from firebase_admin import firestore

        db = firestore.client()

        company_name = request.form.get("companyName")
        threshold = int(request.form.get("threshold", 60))
        files = request.files.getlist("resumes")

        if not files:
            return jsonify({"error": "No resumes uploaded."}), 400

        # 🔹 Fetch the job document from Firestore
        job_ref = db.collection("jobs").where("companyName", "==", company_name).limit(1).get()
        if not job_ref:
            return jsonify({"error": f"Company '{company_name}' not found in Firestore."}), 404

        job_data = job_ref[0].to_dict()
        job_desc = job_data.get("companyDescription", "")

        if not job_desc:
            return jsonify({"error": "No job description found for this company."}), 400

        shortlisted = []

        # 🔹 Process each uploaded resume
        for f in files:
            text = ""
            try:
                reader = PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() or ""
            except Exception as e:
                print("PDF read error:", e)
                continue

            # 🔸 Extract basic info
            name_match = re.findall(r"Name[:\s]*([A-Z][a-zA-Z\s]+)", text)
            email_match = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)

            name = name_match[0].strip() if name_match else "Unknown"
            email = email_match[0] if email_match else "N/A"

            # 🔸 Skill matching logic (simple overlap)
            job_words = set(job_desc.lower().split())
            resume_words = set(text.lower().split())
            common = job_words.intersection(resume_words)
            score = round((len(common) / len(job_words)) * 100, 2) if job_words else 0

            if score >= threshold:
                shortlisted.append({
                    "name": name,
                    "email": email,
                    "matchScore": score
                })

        return jsonify({
            "shortlisted": shortlisted,
            "count": len(shortlisted),
            "company": company_name
        }), 200

    except Exception as e:
        print("🔥 Shortlisting error:", str(e))
        return jsonify({"error": str(e)}), 


# skill gap analysisi route

@app.route("/api/skill-gap-analyze", methods=["POST"])
@roles_required("admin")
def skill_gap_analyze(current_user):
    """
    Analyze multiple resumes against jobRole skills
    (skills are extracted from jobRole field)
    """
    try:
        company_name = request.form.get("companyName")
        if not company_name:
            return jsonify({"error": "Company name is required"}), 400

        db = firestore.client()
        job_query = db.collection("jobs").where("companyName", "==", company_name).stream()
        job_doc = next(job_query, None)

        if not job_doc:
            return jsonify({"error": "Company not found"}), 404

        job_data = job_doc.to_dict()
        job_role_text = job_data.get("jobRole", "").lower()

        # Extract likely skill keywords from the jobRole description
        skill_keywords = re.findall(r"[a-zA-Z+#]+", job_role_text)
        ignore_words = {"and", "the", "with", "in", "for", "to", "on", "at", "of", "as", "an", "by", "is", "be"}
        required_skills = [w for w in set(skill_keywords) if len(w) > 2 and w not in ignore_words]

        if not required_skills:
            return jsonify({"error": "No recognizable skills found in jobRole"}), 400

        resumes = request.files.getlist("resumes")
        results = []

        for file in resumes:
            reader = PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""

            text_lower = text.lower()
            emails = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
            email = emails[0] if emails else "N/A"

            matched = [s for s in required_skills if s.lower() in text_lower]
            missing = [s for s in required_skills if s.lower() not in text_lower]
            match_score = round((len(matched) / len(required_skills)) * 100, 2)

            results.append({
                "email": email,
                "matchScore": match_score,
                "missingSkills": missing,
            })

        return jsonify({"status": "ok", "results": results}), 200

    except Exception as e:
        print("🔥 Skill Gap Error:", e)
        return jsonify({"error": str(e)}), 500
    

 
@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume_public():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    job_description = request.form.get('job_description', '')
    try:
        text = extract_text_from_pdf(file)
        result = analyze_resume(text, job_description)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# OPPORTUNITY MODEL ROUTES
# =========================
# =========================
# RECOMMENDATION ROUTES
# =========================
@app.route("/api/recommend-from-trends", methods=["POST"])
def api_recommend_trends():
    try:
        data = request.get_json() or {}
        branch = data.get("branch", "")
        cgpa = float(data.get("cgpa")) if data.get("cgpa") not in (None, "") else None
        skills_raw = data.get("skills", "")
        skills = [s.strip() for s in skills_raw.split(",")] if isinstance(skills_raw, str) else skills_raw
        year = data.get("year", None)
        top_k = int(data.get("top_k", 10))
        res = recommend_from_trends(skills_input=skills, branch=branch, cgpa=cgpa, year=year, top_k=top_k)
        response = {
            "roles_for_skills": res.get("roles_for_skills", []),
            "companies_for_skills": res.get("companies_for_skills", []),
            "matched_students": res.get("matched_students", []),
            "stats": res.get("stats", {})
        }
        return jsonify({"status": "ok", "result": response}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route("/api/learning-path", methods=["POST"])
def api_learning_path():
    try:
        data = request.get_json() or {}
        goal = data.get("goal", "")
        current_skills = data.get("current_skills", [])
        hours_per_week = float(data.get("hours_per_week", 5.0))
        weeks = int(data.get("weeks", 8))
        roadmap = generate_roadmap(goal, current_skills, hours_per_week, weeks)
        return jsonify({"status":"ok", "roadmap": roadmap}), 200
    except Exception as e:
        return jsonify({"status":"error","message": str(e)}), 500

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Placement AI API (Firebase Version)"}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

