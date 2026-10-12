# Setup Guide
(no need for envs since fallbacks added)

## 1. Backend Setup

```bash
cd backend
python -m venv venv

**Windows (PowerShell / CMD):**
.\venv\Scripts\activate

**macOS / Linux:**
source venv/bin/activate


pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000
```

---

## 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 3. URLs

- **Frontend App**: http://localhost:5173
- **Swagger API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
