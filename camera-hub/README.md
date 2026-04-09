# CameraHub

A full-stack camera comparison and community platform.

**Stack:**
- Backend: Django 4.2 + Django REST Framework + PostgreSQL + Redis + Celery
- Frontend: React 18 + Vite + TypeScript + Material UI v9

---

## Quick Start (Docker)

```bash
cd camera-hub
docker compose up --build
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Swagger docs: http://localhost:8000/api/docs/
- Django admin: http://localhost:8000/admin/

---

## Local Development

### Backend

**Prerequisites:** Python 3.11+, PostgreSQL, Redis

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env   # edit DATABASE_URL and REDIS_URL

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start dev server
python manage.py runserver
```

**Environment variables** (`.env`):

| Variable | Example |
|---|---|
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/camerahub` |
| `REDIS_URL` | `redis://localhost:6379/0` |
| `DJANGO_SECRET_KEY` | `your-secret-key` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` |
| `DEBUG` | `True` |

### Frontend

**Prerequisites:** Node.js 18+

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Environment variables** (`frontend/.env.local`):

```
VITE_API_URL=http://localhost:8000/api
```

---

## Running Celery (for camera imports)

```bash
cd backend
source .venv/bin/activate
celery -A config worker -l info
```

---

## Project structure

```
camera-hub/
├── backend/
│   ├── config/          # Django settings, URLs, Celery config
│   ├── apps/
│   │   ├── accounts/    # CustomUser, UserProfile, JWT auth
│   │   ├── catalog/     # Brand, Camera models + API
│   │   ├── specs/       # Sensor/Video/Body/AF/Connectivity specs
│   │   ├── reviews/     # User reviews + voting
│   │   ├── comments/    # Threaded comments (generic FK)
│   │   ├── contributions/ # Field edit proposals
│   │   ├── moderation/  # Moderator actions
│   │   ├── comparisons/ # Compare engine
│   │   ├── scoring/     # Camera score computation
│   │   └── imports/     # Wikidata import tasks (Celery)
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/         # Axios API clients with JWT interceptors
        ├── app/         # Theme, router, providers
        ├── components/  # Layout + common components
        ├── features/    # Feature-based components
        ├── pages/       # Route-level page components
        └── types/       # TypeScript interfaces
```

---

## API endpoints

| Endpoint | Description |
|---|---|
| `POST /api/auth/register/` | Register new user |
| `POST /api/auth/token/` | Obtain JWT tokens |
| `POST /api/auth/token/refresh/` | Refresh JWT token |
| `GET /api/cameras/` | List/search cameras |
| `GET /api/cameras/{slug}/` | Camera detail + specs |
| `GET /api/compare/?left=slug&right=slug` | Compare two cameras |
| `GET/POST /api/reviews/` | List / create reviews |
| `GET/POST /api/comments/` | List / create comments |
| `POST /api/my/proposals/` | Submit spec correction proposal |
| `GET /api/moderation/proposals/` | Moderator proposals queue |
| `GET /api/docs/` | Swagger UI |
