# Employee Directory Search System

I have designed this Employee Directory with a one feature that is **Optimized Search**.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, TypeScript
* **Backend:** Python, FastAPI
* **Database:** MySQL, SQLite

*(As per the guidelines MySQL was preferred, but I also added SQLite support for the convenience of quick local testing without needing a database server setup.)*

---

## System Design

### 1. Database (Async)
Since FastAPI supports Asynchronous execution, I designed all database operations using asynchronous drivers.This ensures database queries yield control back to the event loop, allowing the server to handle concurrent requests without blocking threads.

### 2. Connection Pooling
Instead of establishing a database connection on every single request (which introduces significant latency), I maintained an active connection pool. with:
* `pool_size = 10`: Connections ready for immediate checkout.
* `max_overflow = 20`: Temporary connections for traffic spikes.
* `pool_recycle = 3600`: Recycles connections hourly to prevent idle dropouts.
* `pool_pre_ping = True`: Pings connections before checkout to prevent stale socket errors.

### 3. Database Indexing
As the database grows, scanning every record in a table becomes very time intensive. I added B-Tree indexes on the primary search columns:
* `id`: Primary Key (to automatically indexed as unique clustered B-Tree by the database).
* `name`: B-Tree indexed for fast prefix searches. (eg. Rah%)
* `department`: B-Tree indexed for quick department filtering. (eg. Fin%)
* `email`: Unique true for integrity. 

### 4. B-Tree Index & Prefix Search 
Since I am developing a Search feature, mostly user searches the words near to there true value so I have make use of **prefix search** to allow user to search the employee even if with near to accurate info
* Example: Searching `"Rah%"` uses the B-Tree index to directly locate all records starting with `"Rahul"`, `"Rohan"`, etc.
Which results to:
* **B Tree Index:** $O(\log N)$
compared to
* **Table Scan:** $O(N)$

### 5. Debouncing API Requests
Sending an API request on every keystroke causes unnecessary network and database load. Conversely, waiting until the user submits can lead to zero matches due to minor typos.
* To solve this, I implemented a **600ms debounce timer** (`useDebounce`, configurable via `VITE_DEBOUNCE_MS` in `.env`).
* When the user types continuously, requests are paused. The moment a pause is detected (indicating the user paused or finished typing), the API request is dispatched.
* Combined with B-Tree prefix searching, this strikes the ideal balance between low server load and instant search responsiveness.

### 6. Pagination & In-Engine Counting
To prevent accidentally loading thousands of employee records into memory at once:
* Queries enforce a configurable `limit` (max 100 per page, default 20 on API, 9 on UI for the 3-column grid) and `offset`.
* Total matching count is calculated directly inside the database via `SELECT COUNT(id)`, saving memory and bandwidth.

### 7. Validation & Error Handling
I used Pydantic and custom service layers to strictly validate inputs and handle edge cases gracefully:

* **a. Empty or Whitespace Search (`?search=` or `?search=   `):**
  Rejected with **HTTP 400 Bad Request** (`"Search query cannot be empty or contain only whitespace"`).
* **b. SQL Wildcard Escaping:**
  Characters like `%` and `_` are automatically escaped (`\%`, `\_`) so user input is treated as literal characters rather than SQL wildcards.
* **c. Max Length Protection:**
  Search queries longer than 100 characters are rejected with **HTTP 400 Bad Request** to protect against buffer overflow/DoS attempts.
* **d. Database Connection Failure:**
  Handled via a global `SQLAlchemyError` exception handler that logs the error internally and returns **HTTP 503 Service Unavailable** with safe messaging, never leaking credentials or raw tracebacks to the client.
* **e. Zero Results:**
  Returns an **HTTP 200 OK** empty envelope (`items: []`, `total: 0`), and the frontend displays a polite, friendly "No results found" card with a "Clear search" action.
* **f. Case Insensitivity:**
  Prefix searches match case-insensitively across both MySQL and SQLite, so `"rahul"`, `"Rahul"`, and `"RAHUL"` shows identical results.

---

## 🏛️ Architecture & Project Structure

### Backend (`backend/`)
* **`app/main.py`**: FastAPI setup, CORS middleware, startup/shutdown lifespan, and global exception handlers.
* **`app/routes.py`**: API route definitions (`GET /employees`, `GET /employees/{id}`, `POST /employees`, `GET /health`).
* **`app/service.py`**: Business logic layer validating input (whitespace rejection, max length enforcement).
* **`app/repository.py`**: Data Access Layer executing B-Tree prefix queries, wildcard escaping, and SQL pagination.
* **`app/models.py`**: SQLAlchemy ORM models with B-Tree indexes on `name` and `department`.
* **`app/schemas.py`**: Pydantic models for request validation and response serialization (`EmployeeRead`, `PaginatedEmployeeResponse`).
* **`app/database.py`**: Database setup, MySQL connection pooling, SQLite fallback, and session generator.
* **`seed.py`**: Seed script populating 25 realistic employee records.
* **`requirements.txt`**: Backend Python dependencies.
* **`.env` / `.env.example`**: Environment configurations.

### Frontend (`frontend/src/`)
* **Components (`components/`)**:
  * **`SearchBar.tsx`**: Search input with ESC clear, clear button, and scope selectors (`Both`, `By Name`, `By Department`).
  * **`EmployeeCard.tsx`**: Employee detail in ID Card form.
  * **`EmployeeList.tsx`**: State machine rendering loading skeletons, friendly empty/error states, and the 3-column success grid.
  * **`Pagination.tsx`**: Range counter with Prev/Next buttons.
* **Hooks (`hooks/`)**:
  * **`useEmployees.ts`**: Core state machine managing queries, pagination, debounce state, and request cancellation.
  * **`useDebounce.ts`**: Reusable 600ms debounce timer hook (configurable via `VITE_DEBOUNCE_MS`).
* **`api.ts`**: Fetch client with error handling and `AbortSignal` support.
* **`types.ts`**: TypeScript definitions for employees, pagination, and search modes.

---

## Frontend

1. **600ms Debouncing:**
   Throttles API requests during active typing to prevent request flooding.
2. **`AbortController` Cancellation:**
   If a user types before the previous request finishes, the in-flight request is cancelled immediately, preventing race conditions and stale data overwrites.
3. **Instant Skeleton Shimmer Loader:**
   Triggered immediately upon keystroke without waiting for the debounce timer to expire, giving the user instant visual responsiveness.
4. **Avatars:**
   Avatars are bound to employee IDs: (Implemented for Visuals)
   * `M1...`, `M2...`, `M3...` $\rightarrow$ Male avatars (`avatar-1.jpg`, `avatar-2.jpg`, `avatar-3.jpg`)
   * `F4...`, `F5...`, `F6...` $\rightarrow$ Female avatars (`avatar-4.jpg`, `avatar-5.jpg`, `avatar-6.jpg`)
   This guarantees that an employee consistently renders the exact same avatar to the viewer.
5. **Edge-Case Messaging:**
   Raw error traces are masked with clean, polite consumer messages ("Unable to load results", "Try Again").

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/employees?search=rahul&mode=both` | Prefix search across name, department, or both with pagination |
| `GET` | `/health` | System and database connectivity health check |
| `GET` | `/docs` | Interactive Swagger UI API documentation |

---

## Setup Instructions

### 1. Backend Setup

Navigate to the `backend` directory and create an isolated virtual environment:
```bash
cd backend
python -m venv venv
```

Activate the virtual environment:
* **Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  # or in CMD:
  .\venv\Scripts\activate.bat
  ```
* **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

Install dependencies:
```bash
pip install -r requirements.txt
```

Configure environment:
```bash
cp .env.example .env
```
*(By default, `.env` is configured with SQLite for zero-setup evaluation. To use MySQL, set your `DATABASE_URL` in `.env`.)*

Seed the database with sample records:
```bash
python seed.py
```

Start the FastAPI backend:
```bash
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 2. Frontend Setup

In a new terminal, navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

Configure environment:
```bash
cp .env.example .env
```

Start the development server:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.
