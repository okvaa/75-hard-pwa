Write-Host "🔄 Cleaning project..."
if (Test-Path "node_modules") {
  Remove-Item -Recurse -Force node_modules
}
if (Test-Path "package-lock.json") {
  Remove-Item -Force package-lock.json
}

Write-Host "📦 Installing dependencies (with legacy peer deps)..."
npm install --legacy-peer-deps

Write-Host "🚀 Starting development server..."
npm run dev
