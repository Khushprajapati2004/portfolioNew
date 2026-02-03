# Database Setup Guide

This portfolio uses two databases:
- **MongoDB**: For contact form messages
- **PostgreSQL**: For projects, skills, and blog posts (via Prisma)

## Prerequisites

1. **MongoDB** - Install locally or use MongoDB Atlas
2. **PostgreSQL** - Install locally or use a cloud provider

## Setup Steps

### 1. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update these variables in `.env`:

```env
# MongoDB for contact messages
MONGODB_URI=mongodb://localhost:27017/portfolio

# PostgreSQL for projects and skills
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db

# Admin authentication
ADMIN_TOKEN=your-secure-admin-token-here

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-admin@email.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database:
```sql
CREATE DATABASE portfolio_db;
```

3. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/portfolio_db
```

#### Option B: Cloud PostgreSQL (Recommended)

Use services like:
- **Neon** (https://neon.tech) - Free tier available
- **Supabase** (https://supabase.com) - Free tier available
- **Railway** (https://railway.app) - Free tier available

Get your connection string and add it to `.env`

### 4. Run Prisma Migrations

Generate Prisma client and create database tables:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Seed the Database

Populate the database with initial data:

```bash
npm run prisma:seed
```

This will create:
- Sample projects (TravelVista, CareerHub)
- Skills across different categories
- Sample blog posts

### 6. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Verify Setup

### Check MongoDB Connection
The server logs should show:
```
✓ MongoDB connected successfully
```

### Check PostgreSQL Connection
The server logs should show:
```
✓ PostgreSQL (Prisma) connected successfully
```

### Test API Endpoints

1. **Get Projects**: `GET http://localhost:5000/api/projects`
2. **Get Skills**: `GET http://localhost:5000/api/skills`

## Admin Panel Usage

1. Navigate to `/admin` in your frontend
2. Login with your `ADMIN_TOKEN`
3. You can now:
   - View contact messages
   - Add/Edit/Delete projects
   - Add/Edit/Delete skills

## Troubleshooting

### PostgreSQL Connection Issues

If you see "PostgreSQL connection error":

1. Verify DATABASE_URL is correct
2. Check if PostgreSQL is running
3. Ensure the database exists
4. Check firewall/network settings

### Prisma Migration Issues

If migrations fail:

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Then run migrations again
npm run prisma:migrate
npm run prisma:seed
```

### MongoDB Connection Issues

If MongoDB connection fails:

1. Verify MONGODB_URI is correct
2. Check if MongoDB is running locally
3. For MongoDB Atlas, check IP whitelist

## Database Schema

### Projects Table (PostgreSQL)
- id (String, Primary Key)
- title (String)
- slug (String, Unique)
- description (String)
- content (Text)
- tech (String Array)
- image (String, Optional)
- github (String, Optional)
- demo (String, Optional)
- featured (Boolean)
- published (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)

### Skills Table (PostgreSQL)
- id (String, Primary Key)
- name (String, Unique)
- category (String)
- level (Integer, 1-10)
- icon (String, Optional)
- order (Integer)

### Messages Collection (MongoDB)
- name (String)
- email (String)
- subject (String)
- message (String)
- read (Boolean)
- createdAt (Date)

## Production Deployment

For production:

1. Use managed database services
2. Enable SSL for database connections
3. Set strong ADMIN_TOKEN
4. Configure proper CORS settings
5. Enable rate limiting
6. Set up database backups

## Useful Prisma Commands

```bash
# View database in browser
npx prisma studio

# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```
