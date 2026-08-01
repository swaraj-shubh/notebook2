# Notebook Application

A full-stack, modern notebook web application for taking, managing, and organizing notes. The platform allows users to create rich-text notes with images, videos, and markdown support, alongside authentication and an administrative dashboard.

- **Live Demo**: [https://notebook2.shubhh.xyz/](https://notebook2.shubhh.xyz/)

## ✨ Features

- **User Authentication**: Secure signup and login using JWT tokens and bcrypt password hashing.
- **Rich Note Management**: Create, read, update, and delete (CRUD) notes.
- **Media Support**: Add images and videos to notes.
- **Role-based Access Control**: Standard user access and an admin dashboard to view all users.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS, Shadcn UI (Radix UI), and lucide-react icons.
- **Form Validation**: Client-side validation using React Hook Form and Zod.

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (via Motor AsyncIO)
- **Validation**: Pydantic
- **Authentication**: JWT, bcrypt, python-jose
- **Server**: Uvicorn

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI (shadcn/ui primitives)
- **Routing**: React Router DOM v7
- **Forms & Validation**: React Hook Form, Zod
- **Markdown Parsing**: React Markdown, DOMPurify
- **State Management/Context**: React Context API

## 📂 Project Structure

```text
notebook2/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Route definitions (v1/endpoints)
│   │   ├── core/             # Configuration, logging, and security
│   │   ├── db/               # MongoDB client and initialization
│   │   ├── models/           # Data models (Pydantic schemas)
│   │   ├── schemas/          # Pydantic validation schemas for requests/responses
│   │   ├── services/         # Business logic (Auth, Users, Notes)
│   │   ├── utils/            # Helper functions (Tokens, Validators)
│   │   └── main.py           # FastAPI entry point
│   ├── tests/                # Backend unit tests
│   ├── Dockerfile            # Docker configuration for backend
│   ├── docker-compose.yml    # Docker Compose for local development
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # React Frontend
    ├── src/
    │   ├── assets/           # Static assets
    │   ├── components/       # Reusable UI components (Radix UI/Tailwind)
    │   ├── context/          # React Context (AuthContext)
    │   ├── hooks/            # Custom React hooks
    │   ├── lib/              # Utility libraries and configurations
    │   ├── pages/            # Page components (Home, Notebook, Admin, Auth, etc.)
    │   ├── routes/           # Application routing logic (AppRoutes.jsx)
    │   ├── services/         # API call services (Axios)
    │   ├── utils/            # Helper functions
    │   ├── App.jsx           # Main React component
    │   └── main.jsx          # React DOM entry point
    ├── public/               # Public assets
    ├── package.json          # Node.js dependencies
    ├── tailwind.config.js    # Tailwind configuration
    └── vite.config.js        # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB instance (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables by creating a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   DB_NAME=notebook_db
   SECRET_KEY=your_secret_key
   # Add other required variables like PORT if necessary
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be running at [http://localhost:8000](http://localhost:8000). Documentation available at `/docs`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at [http://localhost:5173](http://localhost:5173) (or port specified by Vite).

## 🐳 Docker Support

The backend application provides a `Dockerfile` and a `docker-compose.yml` file, allowing you to easily containerize and run the backend alongside a MongoDB instance. 

Run the following command from the `backend` directory to spin up the backend:
```bash
docker-compose up -d
```