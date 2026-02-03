#!/bin/bash

echo "🚀 Setting up Khush Prajapati Portfolio Backend..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual configuration!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate
echo ""

# Seed database
echo "🌱 Seeding database with initial data..."
npm run prisma:seed
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your database credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:5000 to verify the API"
echo ""
