# ============================================
# QUICK LOCAL TESTING - PowerShell Script
# Run this to test all endpoints locally
# ============================================

param(
    [string]$CronSecret = "",
    [switch]$Help
)

if ($Help) {
    Write-Host @"
QUICK LOCAL TESTING SCRIPT

Usage:
    .\quick-test.ps1 -CronSecret "your-cron-secret-here"

What it tests:
    1. Check Expired Bookings Cron
    2. Send Urgent Nudges Cron
    3. Send Appointment Reminders Cron

Requirements:
    - vercel dev must be running (http://localhost:3000)
    - .env file must be configured
    - CRON_SECRET must be set in .env

Example:
    .\quick-test.ps1 -CronSecret "abc123xyz456"
"@
    exit 0
}

if ($CronSecret -eq "") {
    Write-Host "ERROR: Please provide -CronSecret parameter" -ForegroundColor Red
    Write-Host "Example: .\quick-test.ps1 -CronSecret 'your-secret-here'" -ForegroundColor Yellow
    Write-Host "Get your secret from .env file" -ForegroundColor Yellow
    exit 1
}

$baseUrl = "http://localhost:3000"
$headers = @{
    "Authorization" = "Bearer $CronSecret"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ORACHOPE LOCAL TESTING SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Check Expired Bookings
Write-Host "[1/3] Testing: Check Expired Bookings Cron..." -ForegroundColor Yellow
try {
    $response1 = Invoke-RestMethod -Uri "$baseUrl/api/cron/check-expired-bookings" -Headers $headers -Method GET
    Write-Host "✓ SUCCESS" -ForegroundColor Green
    Write-Host "  - Expired: $($response1.expired)" -ForegroundColor Gray
    Write-Host "  - Message: $($response1.message)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAILED" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Send Urgent Nudges
Write-Host "[2/3] Testing: Send Urgent Nudges Cron..." -ForegroundColor Yellow
try {
    $response2 = Invoke-RestMethod -Uri "$baseUrl/api/cron/send-urgent-nudges" -Headers $headers -Method GET
    Write-Host "✓ SUCCESS" -ForegroundColor Green
    Write-Host "  - Nudged: $($response2.nudged)" -ForegroundColor Gray
    Write-Host "  - Message: $($response2.message)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAILED" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Send Appointment Reminders
Write-Host "[3/3] Testing: Send Appointment Reminders Cron..." -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "$baseUrl/api/cron/send-appointment-reminders" -Headers $headers -Method GET
    Write-Host "✓ SUCCESS" -ForegroundColor Green
    Write-Host "  - Reminded: $($response3.reminded)" -ForegroundColor Gray
    Write-Host "  - Message: $($response3.message)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAILED" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTING COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test clinic endpoints (confirm/reject/alternatives) in browser" -ForegroundColor Gray
Write-Host "  2. Create test booking in database" -ForegroundColor Gray
Write-Host "  3. Generate HMAC token and test full flow" -ForegroundColor Gray
Write-Host "  4. See LOCAL_TESTING_GUIDE.md for details`n" -ForegroundColor Gray
