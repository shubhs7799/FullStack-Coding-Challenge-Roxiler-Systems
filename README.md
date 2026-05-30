# StoreRate — Store Rating Platform

A full-stack web application that enables users to discover, review, and rate stores while providing administrators and store owners with comprehensive management capabilities.

Built with React, Express.js, PostgreSQL, and JWT Authentication.

---

## Overview

StoreRate is a role-based platform where:

* Users can browse stores and submit ratings.
* Store owners can monitor store performance and customer feedback.
* Administrators can manage users, stores, and platform analytics.

The application demonstrates authentication, authorization, REST API development, relational database design, and responsive frontend development.

---

## Features

### Authentication & Authorization

* JWT-based authentication
* Secure password hashing
* Protected routes
* Role-based access control
* Persistent login sessions

### User Features

* Register and login
* Browse all stores
* Search stores by name and address
* Submit ratings (1–5)
* Update previously submitted ratings
* Change password

### Store Owner Features

* Owner dashboard
* View assigned stores
* Monitor average store ratings
* View customer rating history
* Change password

### Administrator Features

* Dashboard with platform statistics
* Create users with different roles
* Create stores and assign owners
* View all users with filtering and sorting
* View all stores and ratings
* Inspect user details and owner performance

---

## Tech Stack

| Layer            | Technology                                    |
| ---------------- | --------------------------------------------- |
| Frontend         | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend          | Node.js, Express.js                           |
| Database         | PostgreSQL                                    |
| ORM              | Sequelize                                     |
| Authentication   | JWT                                           |
| Validation       | express-validator, HTML5 Validation           |
| HTTP Client      | Axios                                         |
| State Management | React Context API                             |

---

## Architecture

```text
React Frontend
       │
       ▼
   REST API
       │
       ▼
 Express.js
       │
       ▼
 Sequelize ORM
       │
       ▼
 PostgreSQL
```

---

## Project Structure

```bash
store-rating-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validations/
│   │   └── server.js
│   ├── seeders/
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
```

---

## User Roles

| Role        | Permissions                        |
| ----------- | ---------------------------------- |
| Admin       | Full platform management           |
| Store Owner | Manage assigned stores and ratings |
| User        | Browse stores and submit ratings   |

---

## Getting Started

### Prerequisites

* Node.js 18+
* PostgreSQL 14+
* npm

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/store-rating-platform.git

cd store-rating-platform
```

### Create Database

```sql
CREATE DATABASE store_rating_db;
```

### Backend Setup

```bash
cd backend

cp .env.example .env
```

Configure environment variables:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_secret_key
```

Install dependencies:

```bash
npm install
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### Seed Sample Data

```bash
npm run db:seed
```

### Frontend Setup

```bash
cd ../frontend

npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Demo Credentials

### Administrator

```text
Email: admin@storerate.com
Password: Admin@1234
```

### Store Owners

```text
alex.johnson@storerate.com
Password: Owner@1234
```

```text
marcus.williams@storerate.com
Password: Owner@1234
```

### Users

```text
priya.sharma@example.com
Password: User@12345
```

```text
daniel.chen@example.com
Password: User@12345
```

```text
fatima.alhassan@example.com
Password: User@12345
```

---

## API Endpoints

### Authentication

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/auth/register        |
| POST   | /api/auth/login           |
| GET    | /api/auth/me              |
| PATCH  | /api/auth/update-password |

### Users

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /api/users/stats |
| GET    | /api/users       |
| GET    | /api/users/:id   |
| POST   | /api/users       |

### Stores

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | /api/stores                 |
| POST   | /api/stores                 |
| GET    | /api/stores/owner-dashboard |

### Ratings

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /api/ratings |

---

## Validation Rules

| Field    | Validation                                                                   |
| -------- | ---------------------------------------------------------------------------- |
| Name     | 20–60 characters                                                             |
| Email    | Valid email format                                                           |
| Password | 8–16 characters with at least one uppercase letter and one special character |
| Address  | Maximum 400 characters                                                       |
| Rating   | Integer between 1 and 5                                                      |

---

## Security

* JWT Authentication
* Password Hashing
* Role-Based Access Control
* Protected Routes
* Request Validation
* Environment Variable Configuration

---

## Future Improvements

* Store image uploads
* Email verification
* Password reset functionality
* Analytics dashboard
* Pagination
* Advanced search filters
* Docker support
* CI/CD pipeline

---

## Author

Developed as a full-stack project demonstrating:

* React Development
* Express.js API Design
* PostgreSQL Database Design
* Sequelize ORM
* Authentication & Authorization
* Full-Stack Application Architecture
