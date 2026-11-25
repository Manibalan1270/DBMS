# User Management System (DBMS lab)

React (Vite) frontend + Express backend + MySQL. Users can register, log in, view
their profile and change their password. Admins can list, view, edit and delete users.

## 1. Database

Run `backend/schema.sql` in MySQL (Workbench, or `mysql -u root -p < backend/schema.sql`).

## 2. Backend (port 5000)

```bash
cd backend
cp .env.example .env      # set DB_PASSWORD and a random JWT_SECRET
npm install
npm start
```

## 3. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev               # open http://localhost:5173
```

## Making an admin

Register an account in the app, then run in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Log in again and the **Admin** link appears.

## Security notes

- Logging in returns a token (JWT, valid for 2 hours). The frontend sends it with every request.
- `/admin/*` routes only work for admins, and `/user/:id` only for your own id.
- Changing a password needs the current password.
- Passwords are stored as bcrypt hashes.
