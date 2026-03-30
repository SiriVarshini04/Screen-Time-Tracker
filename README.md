# Screen Time Management System

This is a full-stack web application designed for a college-level project.

## Requirements
- Node.js installed (download from https://nodejs.org/)
- MySQL Server installed and running on localhost:3306

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., phpMyAdmin, MySQL Workbench, or command line).
2. Run the SQL script located at the root folder: `database.sql`.
   This will create the `screen_time_db` and insert an initial Admin Account.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open the `frontend` folder.
2. Simply double-click on `index.html` to open it in your browser, or serve it using a live server extension in VS Code.

## Test Accounts
- **Admin**: email `admin@screentime.com`, password `admin123`
- Or register a new normal user from the app.
