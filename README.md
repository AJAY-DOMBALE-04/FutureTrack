 # Placeme

 > Placeme is a recruiting/placement web app that includes a Python Flask backend and a React frontend. It provides tools for resume analysis, interview practice, opportunity matching, and learning-path recommendations.

 ## Repository layout

 - `backend/` : Flask API, data models, trained model files, and scripts.
 - `front/` : React single-page application (development & production build).
 - `models/` : persisted model artifacts used by the backend (e.g. `opportunity_model.joblib`).
 - `data/` : sample CSV datasets used during development (`students_opportunities.csv`).
 - `git-secrets/` : helper scripts and tests for preventing secrets in commits.

 ## Prerequisites

 - Python 3.8+ (for the backend)
 - Node.js 16+ and npm (for the frontend)
 - Git (optional, for version control)

 On Windows PowerShell you can check versions:

 ```powershell
 python --version
 node --version
 npm --version
 ```

 ## Backend (development)

 1. Create and activate a virtual environment (PowerShell):

 ```powershell
 cd .\placeme\backend
 python -m venv venv
 .\venv\Scripts\Activate.ps1
 ```

 2. Install dependencies:

 ```powershell
 pip install -r requirements.txt
 ```

 3. Environment: there is a `.env` in `backend/` (not committed) — verify or copy any required environment variables, including `GEMINI_API_KEY`, `JWT_SECRET_KEY`, and `FIREBASE_SERVICE_ACCOUNT_JSON`.

 4. Run the app (simple):

 ```powershell
 cd ..\backend
 python app.py
 ```

 The backend defaults to Flask's port (usually `5000`) unless configured otherwise in `.env`.

 ## Frontend (development)

 1. Install dependencies and start the dev server:

 ```powershell
 cd ..\front
 npm install
 npm start
 ```

 2. The React app typically runs on `http://localhost:3002` and expects the backend API at the host configured in `front/src/config.js` or environment variables.

 3. Build for production:

 ```powershell
 npm run build
 ```

 You can then serve the files from `front/build` with any static server or integrate with the backend hosting.

 ## Data & Models

 - Sample data: `backend/data/students_opportunities.csv` is provided for development and local testing.
 - Trained model artifact: `backend/models/opportunity_model.joblib` is used by the resume/opportunity analyzer.

 If you retrain models, save them under `backend/models/` and update the code paths accordingly.

 ## Security & Secrets

- Service-account credentials and other secrets should not be committed to the repository. Store them in environment variables or a secure secret manager.
 - `git-secrets/` is included to help prevent accidental commits of secrets; consider configuring it locally.

 ## Contributing

 - Follow the existing project structure: implement backend changes in `backend/` and frontend in `front/`.
 - Run linters/tests locally before opening a PR. If you'd like, add a `CONTRIBUTING.md` with branch/PR rules and testing expectations.

 ## Quick Start (Windows PowerShell)

 Open two terminals — one for backend and one for frontend.

 Backend terminal:

 ```powershell
 cd 'D:\major project\placeme\backend'
 python -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt; python app.py
 ```

 Frontend terminal:

 ```powershell
 cd 'D:\major project\placeme\front'
 npm install; npm start
 ```

 ## Troubleshooting

 - If ports conflict, change the port via environment variables or the framework's config.
 - If the frontend cannot reach the backend, check CORS config in `backend` and API base URL in `front/src/config.js`.

 ## Next steps / Ideas

 - Add automated tests (backend unit tests, frontend integration tests).
 - Add CI to run tests and build the frontend.
 - Add deployment instructions (Heroku, Azure, Docker, etc.).

 ---

 If you want, I can also:

 - Add a `CONTRIBUTING.md` and `LICENSE` file.
 - Create a minimal `docker-compose.yml` for local dev.
 - Add CI pipeline configuration (GitHub Actions) to run tests and build the front-end.
