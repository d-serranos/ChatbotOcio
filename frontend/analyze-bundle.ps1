# Bundle Analysis Script for Vue Frontend
# This script analyzes the production build and provides optimization recommendations

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   Vue Frontend Bundle Analyzer   " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: dist folder not found" -ForegroundColor Red
    Write-Host "Please run 'npm run build' first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ dist folder found" -ForegroundColor Green
Write-Host ""

# Analyze JavaScript files
Write-Host "📊 JavaScript Bundle Analysis" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

$jsFiles = Get-ChildItem -Path "dist\assets" -Filter "*.js" -File | Sort-Object Length -Descending

$totalJsSize = 0
$index = 1

foreach ($file in $jsFiles) {
    $sizeKB = [math]::Round($file.Length / 1KB, 2)
    $totalJsSize += $sizeKB
    
    $color = "White"
    if ($sizeKB -gt 200) {
        $color = "Red"
        $icon = "⚠️"
    } elseif ($sizeKB -gt 100) {
        $color = "Yellow"
        $icon = "⚡"
    } else {
        $color = "Green"
        $icon = "✅"
    }
    
    Write-Host "$icon $($file.Name): " -NoNewline
    Write-Host "$sizeKB KB" -ForegroundColor $color
    
    $index++
    if ($index -gt 10) {
        $remaining = $jsFiles.Count - 10
        if ($remaining -gt 0) {
            Write-Host "   ... and $remaining more files" -ForegroundColor Gray
        }
        break
    }
}

Write-Host ""
Write-Host "Total JavaScript: $([math]::Round($totalJsSize, 2)) KB" -ForegroundColor Cyan

# Analyze CSS files
Write-Host ""
Write-Host "🎨 CSS Bundle Analysis" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

$cssFiles = Get-ChildItem -Path "dist\assets" -Filter "*.css" -File | Sort-Object Length -Descending

$totalCssSize = 0

foreach ($file in $cssFiles) {
    $sizeKB = [math]::Round($file.Length / 1KB, 2)
    $totalCssSize += $sizeKB
    
    Write-Host "✅ $($file.Name): $sizeKB KB" -ForegroundColor Green
}

Write-Host ""
Write-Host "Total CSS: $([math]::Round($totalCssSize, 2)) KB" -ForegroundColor Cyan

# Calculate total bundle size
$totalSize = $totalJsSize + $totalCssSize

Write-Host ""
Write-Host "📦 Total Bundle Size" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host "JavaScript: $([math]::Round($totalJsSize, 2)) KB" -ForegroundColor White
Write-Host "CSS: $([math]::Round($totalCssSize, 2)) KB" -ForegroundColor White
Write-Host "Total: $([math]::Round($totalSize, 2)) KB" -ForegroundColor Cyan
Write-Host ""

# Estimate gzipped size (typically 70-80% compression)
$estimatedGzipped = $totalSize * 0.25  # Assuming ~75% compression
Write-Host "Estimated Gzipped: ~$([math]::Round($estimatedGzipped, 2)) KB" -ForegroundColor Cyan

# Performance evaluation
Write-Host ""
Write-Host "🎯 Performance Evaluation" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

$target = 500
$status = "PASS"
$statusColor = "Green"

if ($estimatedGzipped -gt $target) {
    $status = "FAIL"
    $statusColor = "Red"
    Write-Host "❌ Bundle size exceeds target of $target KB" -ForegroundColor Red
} else {
    Write-Host "✅ Bundle size within target of $target KB" -ForegroundColor Green
}

Write-Host ""
Write-Host "Target: < $target KB gzipped" -ForegroundColor White
Write-Host "Estimated: ~$([math]::Round($estimatedGzipped, 2)) KB gzipped" -ForegroundColor White
Write-Host "Status: $status" -ForegroundColor $statusColor

# Recommendations
Write-Host ""
Write-Host "💡 Optimization Recommendations" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

if ($estimatedGzipped -gt $target) {
    Write-Host "⚠️  Bundle size exceeds target. Consider:" -ForegroundColor Yellow
    Write-Host "   1. Lazy load heavy dependencies (Chart.js, etc.)" -ForegroundColor White
    Write-Host "   2. Use dynamic imports for large components" -ForegroundColor White
    Write-Host "   3. Remove unused Tailwind CSS classes" -ForegroundColor White
    Write-Host "   4. Enable more aggressive minification" -ForegroundColor White
} else {
    Write-Host "✅ Bundle size is optimized!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔍 Code Splitting Status" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

$routeChunks = $jsFiles | Where-Object { $_.Name -match "(View|Router)" }
if ($routeChunks.Count -gt 5) {
    Write-Host "✅ Good code splitting detected ($($routeChunks.Count) route chunks)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Consider more aggressive code splitting" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📈 Next Steps" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Run Lighthouse audit:" -ForegroundColor White
Write-Host "   npm run preview" -ForegroundColor Gray
Write-Host "   Then open Chrome DevTools > Lighthouse" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test on 3G connection:" -ForegroundColor White
Write-Host "   Chrome DevTools > Network > Throttling > Slow 3G" -ForegroundColor Gray
Write-Host ""
Write-Host "3. For detailed bundle analysis:" -ForegroundColor White
Write-Host "   npm install -D rollup-plugin-visualizer" -ForegroundColor Gray
Write-Host "   Add to vite.config.js and rebuild" -ForegroundColor Gray
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "      Analysis Complete! 🎉       " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
