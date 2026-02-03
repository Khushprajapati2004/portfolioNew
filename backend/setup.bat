@echo off
echo 🚀 Setting up Khush Prajapati Portfolio Backend...
echo.

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env with your actual configuration!
    echo.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
echo.

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npm run prisma:generate
echo.

REM Run migrations
echo 🗄️  Running database migrations...
call npm run prisma:migrate
echo.

REM Seed database
echo 🌱 Seeding database with initial data...
call npm run prisma:seed
echo.

echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update .env with your database credentials
echo 2. Run 'npm run dev' to start the development server
echo 3. Visit http://localhost:5000 to verify the API
echo.
pause
