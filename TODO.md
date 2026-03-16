# FutureTrack Vercel 404/500 Fix Plan
Current: d:/major project/placeme

## ✅ Step 1: Fix Backend (app.py) - 500 Errors
```
cd backend
pip install -r requirements.txt
python app.py
```
Test: `curl -X POST http://localhost:5000/api/auth/validate-registration -H "Content-Type: application/json" -d '{"collegeEmail":"test@test.com","role":"student"}'`

**Status**: ✅ Backend running ✓ `/api/jobs` returns data (3994 bytes), `/api/auth/validate-registration` works

## ✅ Step 2: Frontend Build Test
```
cd front
npm install
npm run build
```
Verify `front/build/` created with assets ✓

**Status**: [ ] Local build successful

## ✅ Step 3: Update vercel.json (assets/headers)
**Status**: [ ] Deployed

## ✅ Step 4: Test Vercel Deploy
```
git add .
git commit -m "fix: backend 500 + vercel config"
git push
```
Check: https://future-track-five.vercel.app/

**Status**: [ ] Deployed + working

## 🔍 Next: Fix Specific Errors
1. Backend Firebase credential (`serviceAccountkey.json` → Vercel env)
2. Cloudinary image 404s (data cleanup)
3. React Router /login 404

**Run `python backend/app.py` first → paste output!**

