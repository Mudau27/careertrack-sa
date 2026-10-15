# CareerTrack SA 🇿🇦

### A Full-Stack Job Search, Career Management & CV Analysis Platform

**Live Demo:** https://careertrack-sa.vercel.app  
**Backend API:** https://careertrack-sa-1.onrender.com  
**API Documentation:** https://careertrack-sa-1.onrender.com/api-docs  
**Backend Health Check:** https://careertrack-sa-1.onrender.com/api/health

---

##  About the Project

CareerTrack SA is a full-stack career management platform designed to help job seekers organise their job search, manage their professional profiles, analyse their CVs, track applications, and prepare for interviews.

The platform combines a responsive React frontend with a Node.js and Express REST API, backed by a PostgreSQL database hosted on Neon. It also integrates external job listings and password-reset email functionality.

The goal of CareerTrack SA is to provide job seekers with a central place to manage their career journey while demonstrating practical full-stack development, database management, API integration, authentication, testing, and cloud deployment skills.

##  Features

###   Authentication & Security
- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected routes and authenticated API requests.
- Forgot-password and password-reset functionality.
- Role-based access control for administrative features.

###  User Profile Management
- Manage professional profile information.
- Maintain career-related information in one place.
- Upload a CV for career analysis.

###  job Search
- Search and browse job opportunities.
- Retrieve external job listings through the Adzuna API.
- View relevant job information.
- Save interesting jobs for later.

###  CV Analyzer
- Upload CV documents.
- Analyse CV content.
- Provide CV-related feedback to help users improve their applications.
- Support a more structured approach to preparing for job opportunities.

###   Application Tracking
- Track job applications.
- View application statuses.
- Manage application records.
- Monitor job-search progress through the dashboard.

###   Interview Management
- Record and manage interviews.
- Track interview-related information.
- Support interview reminders.

###   Notifications
- Manage application and career-related notifications.
- Support reminders for important career activities.

###   Dashboard & Analytics
- View career and job-search statistics.
- Monitor applications and related activity.
- Display data using charts and visual summaries.

###  Admin Dashboard
- View platform statistics.
- Manage users and user roles.
- Review and manage job records.
- View application records.
- Restrict administrative functionality to authorized users.

###   API Documentation
- REST API built with Express.
- Interactive API documentation using Swagger UI.
- Health-check and database-connectivity endpoints.

---

##   Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Neon |
| Authentication | JWT, bcrypt |
| API Communication | Axios, REST APIs |
| Charts | Recharts |
| Icons | Lucide React |
| File Uploads | Multer |
| PDF Processing | pdf-parse |
| External Job Listings | Adzuna API |
| Email Service | Resend |
| API Documentation | Swagger UI, swagger-jsdoc |
| Testing | Jest, Supertest |
| Version Control | Git, GitHub |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

---

##   System Architecture

CareerTrack SA follows a client-server architecture.

```text
             USER
               |
               v
      React + TypeScript
        Frontend (Vercel)
               |
          Axios / HTTPS
               |
               v
       Express REST API
        Backend (Render)
               |
       +-------+--------+
       |       |        |
       v       v        v
    Neon    Adzuna    Resend
 PostgreSQL   API    Email Service
```

### How It Works

1. Users interact with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. The backend validates requests and enforces authentication and authorization.
4. The backend reads and writes application data in PostgreSQL.
5. External services provide job listings and password-reset email delivery.
6. The frontend displays the returned information in dashboards, forms, lists, and charts.

---

##  Project Structure

The repository is organised into separate frontend and backend applications.

```text
careertrack-sa/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vercel.json
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

*Note: This is a high-level overview. Individual filenames and directories may differ slightly in the current repository.*

---

##   Live Application

The project is deployed and can be accessed using the following links:

- **Frontend:** https://careertrack-sa.vercel.app
- **Backend API:** https://careertrack-sa-1.onrender.com
- **Swagger Documentation:** https://careertrack-sa-1.onrender.com/api-docs
- **API Health Check:** https://careertrack-sa-1.onrender.com/api/health

The frontend and backend are deployed separately, and the backend connects to the hosted Neon PostgreSQL database.

**Deployment note:** Render's free service may take time to wake up after inactivity. The first request may be slower than subsequent requests.

---

##   Getting Started Locally

Follow these instructions to run CareerTrack SA on your computer.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [Git](https://git-scm.com/)
- A PostgreSQL database, either local PostgreSQL or a [Neon](https://neon.tech/) database
- API credentials for the integrations you want to use

### 1. Clone the Repository

```bash
git clone https://github.com/Mudau27/careertrack-sa.git
cd careertrack-sa
```

### 2. Configure the Backend

Open a terminal in the project root:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

Add the following configuration, replacing the placeholders with your own values:

```env
PORT=5000

# PostgreSQL connection
DATABASE_URL=YOUR_POSTGRESQL_CONNECTION_STRING

# JWT authentication
JWT_SECRET=YOUR_LONG_RANDOM_SECRET

# Adzuna job-search integration
ADZUNA_APP_ID=YOUR_ADZUNA_APP_ID
ADZUNA_APP_KEY=YOUR_ADZUNA_APP_KEY

# Password-reset email service
RESEND_API_KEY=YOUR_RESEND_API_KEY

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

If you use a local PostgreSQL database instead of Neon, configure the individual database variables supported by the backend:

```env
DB_USER=YOUR_DATABASE_USER
DB_HOST=localhost
DB_NAME=YOUR_DATABASE_NAME
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_PORT=5432
```

Use the database configuration appropriate to your environment. Do not publish real credentials.

### 3. Prepare the Database

Create a PostgreSQL database and run the SQL schema or migrations included in the repository, if provided.

The database must contain the tables required by the backend, including those used for:

- Users
- Profiles
- Jobs
- Saved jobs
- Applications
- Interviews
- Notifications

Configure `DATABASE_URL` or the local database variables before starting the API.

### 4. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:5000
```

Check the API health endpoint:

```text
http://localhost:5000/api/health
```

### 5. Configure the Frontend

Open a **second terminal** and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend` containing:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Open the local application:

```text
http://localhost:5173
```

You should now be able to access the frontend and connect it to your local backend.

---

## 🔌 API Overview

The backend exposes REST API endpoints for authentication, profiles, jobs, applications, dashboards, interviews, notifications, and administration.

The main API base path is:

```text
/api
```

| Resource | Base route | Purpose |
|---|---|---|
| Authentication | `/api/auth` | Registration, login, and password recovery |
| Profiles | `/api/profile` | User profile management |
| Jobs | `/api/jobs` | Job management |
| Saved Jobs | `/api/saved-jobs` | Saved job functionality |
| Applications | `/api/applications` | Application tracking |
| Dashboard | `/api/dashboard` | Dashboard statistics |
| External Jobs | `/api/external-jobs` | External job listings |
| Interviews | `/api/interviews` | Interview management |
| Notifications | `/api/notifications` | Notifications and reminders |
| Administration | `/api/admin` | Administrative management |
| CV Analyzer | `/api/cv-analyzer` | CV analysis functionality |

Additional endpoints include:

- `GET /api/health` — checks whether the API is running.
- `GET /api/db-test` — checks database connectivity.
- `GET /api-docs` — provides interactive Swagger documentation.

For the complete request and response schemas, parameters, and available operations, consult the live Swagger documentation or inspect the route definitions in the repository.

---

## 🧪 Testing

The backend uses Jest and Supertest for automated testing.

To run the backend tests:

```bash
cd backend
npm test
```

Tests help verify API behaviour and reduce the risk of regressions when making changes.

The exact test coverage depends on the test cases currently included in the repository.

---

## ☁️ Deployment

CareerTrack SA uses separate hosting services for the frontend and backend.

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Configure the frontend project with `frontend` as the root directory.
3. Set the production environment variable:

   ```env
   VITE_API_URL=https://careertrack-sa-1.onrender.com/api
   ```

4. Deploy the frontend.
5. Verify the production URL and client-side routing.

### Backend — Render

1. Connect the GitHub repository to Render.
2. Configure `backend/` as the root directory.
3. Use the backend's build command:

   ```bash
   npm install
   ```

4. Use the start command:

   ```bash
   npm start
   ```

5. Configure the required environment variables in Render.
6. Set `FRONTEND_URL` to the production frontend URL.
7. Confirm that the CORS configuration allows the production frontend.
8. Verify the API health and database connectivity endpoints.

### Database — Neon

The hosted PostgreSQL database is managed through Neon. Keep its connection string in the backend environment configuration rather than in the frontend or source code.

### Production Considerations

- Use HTTPS for production communication.
- Keep API keys and database credentials out of Git.
- Restrict administrative endpoints using server-side authorization.
- Configure CORS for trusted frontend origins.
- Consider durable file storage for uploaded CVs. Files stored on a hosting service's local filesystem may not survive redeployments or instance replacement.
- Monitor email delivery, database connectivity, and application logs.

---

## Security

Security considerations implemented in or relevant to this project include:

- JWT-based authentication.
- Password hashing with bcrypt.
- Protected API routes.
- Role-based authorization for administrative operations.
- Environment variables for sensitive configuration.
- CORS restrictions for trusted frontend origins.
- Separation of frontend and backend deployment environments.

**Important:** Never commit `.env` files, passwords, JWT secrets, API keys, production database credentials, or real user data to GitHub.

---

##  What This Project Demonstrates

CareerTrack SA demonstrates practical experience with:

- Full-stack application development.
- React and TypeScript frontend development.
- Node.js and Express REST API development.
- Relational database design and PostgreSQL integration.
- JWT authentication and role-based authorization.
- Third-party API and email-service integration.
- File uploads and document analysis.
- Dashboard analytics and data visualisation.
- Automated backend testing.
- API documentation.
- Git and GitHub workflows.
- Cloud deployment using Vercel, Render, and Neon.

---

##  Future Improvements

Potential improvements include:

- Add more comprehensive automated tests.
- Introduce continuous integration and deployment checks.
- Improve CV analysis with more detailed job-description matching.
- Add additional job-search filters and recommendations.
- Implement durable cloud storage for CV uploads.
- Expand monitoring, logging, and error reporting.
- Improve accessibility and mobile usability.
- Add more detailed application analytics.

---

##  Developer

**Thendo Terrence Mudau**

CareerTrack SA was developed as a practical full-stack project focused on job-search management, career development, and web application engineering.

- **GitHub:** https://github.com/Mudau27
- **Project Repository:** https://github.com/Mudau27/careertrack-sa
- **Live Application:** https://careertrack-sa.vercel.app

---

## License

No open-source license is specified here. If you want other developers to reuse, modify, or distribute this project, consider adding a suitable `LICENSE` file to the repository.

---

⭐ If you find CareerTrack SA interesting, explore the live demo and source code to see how the frontend, backend, database, and external integrations work together.
