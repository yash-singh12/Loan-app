# Loan Admin Panel

Made for CodeNicely assignment. Simple admin panel to manage loan products and users. Backend decides if user is Active or Rejected based on product rules.

## What I used
- Frontend: React + Vite, axios, react-router
- Backend: Node + Express + MongoDB (mongoose), JWT for login
- DB: MongoDB Atlas

All eligibility checking is on backend in `backend/src/utils/eligibility.js`. Frontend just shows data.

## How to run

Backend:
```
cd backend
cp .env.example .env
# put your MONGO_URI and JWT_SECRET in .env
npm install
npm run seed
npm run dev
```
backend runs on http://localhost:5000

Frontend:
```
cd frontend
cp .env.example .env
npm install
npm run dev
```
frontend runs on http://localhost:5173, make sure VITE_API_URL is http://localhost:5000/api

## Login details (after seed)
- Admin: admin@demo.com / Admin@123 (can add/edit products, add users)
- Viewer: viewer@demo.com / Viewer@123 (only view)

## How eligibility works
For each user we calculate age from dob, then for each product check all 5 things:
- age between minAge and maxAge
- creditScore >= minCreditScore
- employmentType in allowed list
- salaryType in allowed list
- salary >= minSalary

If user passes all 5 for atleast one product then Active else Rejected. Click View button to see which products passed.

When you add user we check that user only. When you add or edit product we check all users again so status stays correct.

## API list
- POST /api/auth/login
- GET /api/auth/me
- GET /api/products
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- GET /api/users?status=Active
- GET /api/users/:id/eligible
- POST /api/users (admin)

## Seed data
3 products (Personal, Business, Micro) and 4 users, 3 active 1 rejected.
