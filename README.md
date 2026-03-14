# HCL Library Management System

Full-stack Library Management System built from the requirements in `pr.pdf`.

## Stack

- Frontend: React, Vite, Bootstrap, React Router
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT with role-based access control

## Features

- Student registration with admin approval
- JWT login for students and administrators
- Book catalog with pagination and search
- Borrow and return flows
- Due-date and fine visibility
- Admin inventory management
- Admin student approval and borrow tracking
- Standardized API responses and centralized error handling

## Project Structure

```text
HCL/
├── Backend/
├── Frontend/
├── docker-compose.yml
├── postman_collection.json
└── README.md
```

## Backend Setup

1. Open `Backend/.env.example`, copy it to `Backend/.env`, and update values.
2. Install dependencies:
   `cd Backend && npm install`
3. Seed the admin account:
   `npm run seed:admin`
4. Start the API:
   `npm run dev`

Default backend URL: `http://localhost:5000`

### Backend Environment Variables

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Frontend Setup

1. Open `Frontend/.env.example`, copy it to `Frontend/.env`, and update values.
2. Install dependencies:
   `cd Frontend && npm install`
3. Start the frontend:
   `npm run dev`

Default frontend URL: `http://localhost:5173`

### Frontend Environment Variables

- `VITE_API_BASE_URL`

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Books

- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

### Borrowing

- `POST /api/borrow`
- `POST /api/return`

### Student

- `GET /api/student/borrowed-books`
- `GET /api/student/due-books`

### Admin

- `GET /api/admin/borrowed-books`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`

## Example API Response

```json
{
  "success": true,
  "message": "Book borrowed successfully.",
  "data": {
    "_id": "67d38f3d58dbe7b102e7b556"
  }
}
```

## Example Requests

### Register Student

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Asha Kumar",
  "email": "asha@example.com",
  "password": "Password@123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@library.local",
  "password": "Admin@123"
}
```

### Add Book

```http
POST /api/books
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "category": "Software Engineering",
  "totalCopies": 5,
  "availableCopies": 5
}
```

### Borrow Book

```http
POST /api/borrow
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "bookId": "<book_id>",
  "days": 14
}
```

### Return Book

```http
POST /api/return
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "recordId": "<borrow_record_id>"
}
```

## Postman Collection

Import `postman_collection.json` into Postman. It includes login, add-book, borrow-book, and return-book requests plus dashboard routes.

## Docker

### Run with Docker Compose

1. Create `Backend/.env`.
2. Run:
   `docker compose up --build`
3. Services:
   - Frontend: `http://localhost:8080`
   - Backend: `http://localhost:5000`
   - MongoDB: `mongodb://localhost:27017`

## Deployment Notes

### Render / Railway

- Deploy MongoDB separately or use MongoDB Atlas
- Deploy `Backend` as a Node web service
- Set all backend environment variables in the hosting dashboard
- Deploy `Frontend` as a static site with `VITE_API_BASE_URL` pointing to the backend

### AWS

- Run backend in ECS, App Runner, or EC2
- Use MongoDB Atlas or a managed Mongo-compatible service
- Host the frontend on S3 + CloudFront or a container service

## GitHub Repository Layout

- Root docs and deployment files in the repository root
- `Backend/` for API source
- `Frontend/` for React app
- `postman_collection.json` for API testing

## Notes

- Student accounts start in `pending` status and require admin approval.
- Overdue fines are calculated at `Rs. 10` per day.
- This workspace currently contains the implementation files, but dependencies still need to be installed before running locally.
