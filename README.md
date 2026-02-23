# Personal Finance Management Web Application

Full-stack MERN application for managing personal finances.

## Project Structure

- `server/` - Node.js + Express backend
- `client/` - React + Vite frontend

## Prerequisites

- Node.js installed
- MongoDB installed locally or MongoDB Atlas URI (update `server/.env`)

## Setup Instructions

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will run on http://localhost:5000*

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The React app will open in your default browser (usually http://localhost:5173).*

## Features Implemented

- **Authentication**: JWT, bcrypt, Register, Login
- **Transactions**: Add, edit, delete, and list income/expense transactions.
- **Budgets**: Set monthly limits for different categories.
- **Dashboard**: Visual summaries with MongoDB aggregation (total balance, total income, total spent, and expense breakdown by category).
- **Responsive UI**: Modern SaaS fintech design.
