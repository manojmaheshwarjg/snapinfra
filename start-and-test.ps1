# PowerShell script to start backend and test integration
Write-Host "🚀 Starting RhinoBack Backend and Testing Integration" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Change to backend directory
$backendPath = "C:\Users\Manoj Maheshwar JG\OneDrive\Desktop\Vibe Projects\RhinoBack\backend"
$rootPath = "C:\Users\Manoj Maheshwar JG\OneDrive\Desktop\Vibe Projects\RhinoBack"

Write-Host "📂 Changing to backend directory..." -ForegroundColor Yellow
Set-Location $backendPath

Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: Keep this window open!" -ForegroundColor Red
Write-Host "   The backend server needs to stay running" -ForegroundColor Red
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Green
Write-Host "   1. Wait for server to start (you'll see 🚀 message)" -ForegroundColor White
Write-Host "   2. Open a NEW PowerShell window" -ForegroundColor White
Write-Host "   3. Run: cd '$rootPath'" -ForegroundColor White
Write-Host "   4. Run: node test-backend-connection.js" -ForegroundColor White
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Start the backend
npm run dev
