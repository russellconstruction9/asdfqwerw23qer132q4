@echo off
echo 🚀 Setting up CustodyX.AI for Netlify deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from your project root.
    pause
    exit /b 1
)

echo ✅ Found package.json

REM Check if required files exist
echo 📋 Checking deployment files...

if exist "netlify.toml" (
    echo ✅ netlify.toml found
) else (
    echo ❌ netlify.toml missing
)

if exist "public\_redirects" (
    echo ✅ _redirects found
) else (
    echo ❌ public\_redirects missing
)

if exist ".env.example" (
    echo ✅ .env.example found
) else (
    echo ❌ .env.example missing
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Test build
echo 🔨 Testing build process...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 📁 Built files are in the 'dist' directory
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

REM Check for environment variables
echo 🔐 Environment variable checklist:
echo Make sure to set these in Netlify dashboard:
echo   - VITE_SUPABASE_URL
echo   - VITE_SUPABASE_ANON_KEY
echo   - GEMINI_API_KEY
echo   - API_KEY

echo.
echo 🎉 Setup complete! Your project is ready for Netlify deployment.
echo 📖 Read NETLIFY_DEPLOYMENT.md for detailed deployment instructions.
echo.
echo Quick deploy options:
echo 1. Connect GitHub repo to Netlify (recommended)
echo 2. Manual deploy: drag 'dist' folder to netlify.com

pause