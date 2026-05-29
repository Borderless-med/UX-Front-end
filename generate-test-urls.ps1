# ============================================
# GENERATE TEST URLS - PowerShell Script
# Creates valid URLs for testing clinic endpoints locally
# ============================================

param(
    [string]$BookingRef = "BK999TEST",
    [string]$ClinicId = "",
    [string]$HmacSecret = "",
    [switch]$Help
)

if ($Help) {
    Write-Host @"
GENERATE TEST URLS SCRIPT

Usage:
    .\generate-test-urls.ps1 -BookingRef "BK123456" -ClinicId "1" -HmacSecret "your-secret"

Parameters:
    -BookingRef  : Booking reference from database (default: BK999TEST)
    -ClinicId    : Clinic ID from database (required)
    -HmacSecret  : HMAC_SECRET from .env file (required)
    -Help        : Show this help message

Example:
    .\generate-test-urls.ps1 -BookingRef "BK888REMIND" -ClinicId "5" -HmacSecret "abc123xyz"

Output:
    - Valid URLs for confirm/reject/alternatives endpoints
    - Copy and paste into browser to test
"@
    exit 0
}

if ($HmacSecret -eq "") {
    Write-Host "ERROR: Please provide -HmacSecret parameter" -ForegroundColor Red
    Write-Host "Get it from your .env file (HMAC_SECRET=...)" -ForegroundColor Yellow
    Write-Host "Example: .\generate-test-urls.ps1 -ClinicId '1' -HmacSecret 'your-secret'" -ForegroundColor Yellow
    exit 1
}

if ($ClinicId -eq "") {
    Write-Host "ERROR: Please provide -ClinicId parameter" -ForegroundColor Red
    Write-Host "Query database: SELECT id FROM clinics_data LIMIT 1;" -ForegroundColor Yellow
    Write-Host "Example: .\generate-test-urls.ps1 -ClinicId '1' -HmacSecret 'your-secret'" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "GENERATING TEST URLS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Input Parameters:" -ForegroundColor Yellow
Write-Host "  Booking Ref: $BookingRef" -ForegroundColor Gray
Write-Host "  Clinic ID:   $ClinicId" -ForegroundColor Gray
Write-Host "  HMAC Secret: $($HmacSecret.Substring(0, [Math]::Min(10, $HmacSecret.Length)))..." -ForegroundColor Gray
Write-Host ""

# Generate HMAC token
$dataToSign = "$BookingRef|$ClinicId"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($HmacSecret)
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($dataToSign))
$hashString = [System.BitConverter]::ToString($hash).Replace("-", "").ToLower()
$token = $hashString.Substring(0, 32)

Write-Host "Generated Token: $token`n" -ForegroundColor Green

# Generate URLs
$baseUrl = "http://localhost:3000"
$confirmUrl = "$baseUrl/api/clinic/respond/$BookingRef/confirm?token=$token"
$rejectUrl = "$baseUrl/api/clinic/respond/$BookingRef/reject?token=$token"
$alternativesUrl = "$baseUrl/api/clinic/respond/$BookingRef/alternatives?token=$token"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST URLS (Copy & Paste into Browser)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "1. CONFIRM ENDPOINT:" -ForegroundColor Yellow
Write-Host $confirmUrl -ForegroundColor Green
Write-Host ""

Write-Host "2. REJECT ENDPOINT:" -ForegroundColor Yellow
Write-Host $rejectUrl -ForegroundColor Green
Write-Host ""

Write-Host "3. ALTERNATIVES ENDPOINT:" -ForegroundColor Yellow
Write-Host $alternativesUrl -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTING INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Before testing, make sure:" -ForegroundColor Yellow
Write-Host "  ✓ vercel dev is running (http://localhost:3000)" -ForegroundColor Gray
Write-Host "  ✓ Booking exists in database with ref: $BookingRef" -ForegroundColor Gray
Write-Host "  ✓ Booking status = 'pending'" -ForegroundColor Gray
Write-Host "  ✓ .env file configured correctly`n" -ForegroundColor Gray

Write-Host "Test Flow:" -ForegroundColor Yellow
Write-Host "  1. Open URL in browser" -ForegroundColor Gray
Write-Host "  2. For confirm: See success page" -ForegroundColor Gray
Write-Host "  3. For reject: Fill rejection form" -ForegroundColor Gray
Write-Host "  4. For alternatives: Enter 3-5 time slots" -ForegroundColor Gray
Write-Host "  5. Check database for status changes" -ForegroundColor Gray
Write-Host "  6. Check email for notifications`n" -ForegroundColor Gray

Write-Host "SQL to check booking:" -ForegroundColor Yellow
Write-Host @"
SELECT 
  booking_ref,
  status,
  clinic_responded_at,
  rejection_reason,
  expires_at,
  notifications_sent
FROM appointment_bookings
WHERE booking_ref = '$BookingRef';
"@ -ForegroundColor Cyan
Write-Host ""
