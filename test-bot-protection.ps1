# Bot Protection Test Script
# Run this after deploying to verify all protections work

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Bot Protection Test Suite" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$BASE_URL = "https://orachope.org"  # Change to localhost:5173 for local testing
$BOOKING_ENDPOINT = "$BASE_URL/functions/v1/send-appointment-confirmation"

Write-Host "Testing against: $BASE_URL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Rate Limiting
Write-Host "TEST 1: Rate Limiting (Max 2 bookings per IP per hour)" -ForegroundColor Green
Write-Host "-----------------------------------------------"

$testData = @{
    patient_name = "Test Patient"
    email = "test@example.com"
    whatsapp = "+65 91234567"
    treatment_type = "Dental Checkup/Examination"
    preferred_date = "2026-08-01"
    time_slot = "10:00"
    clinic_location = "Bukit Indah"
    consent_given = $true
    turnstile_token = "test-token-12345"
}

Write-Host "Attempt 1/3..." -ForegroundColor Cyan
try {
    $response1 = Invoke-WebRequest -Uri $BOOKING_ENDPOINT -Method POST -Body ($testData | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Booking 1: PASSED (Status $($response1.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Booking 1: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host "Attempt 2/3..." -ForegroundColor Cyan
try {
    $response2 = Invoke-WebRequest -Uri $BOOKING_ENDPOINT -Method POST -Body ($testData | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Booking 2: PASSED (Status $($response2.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Booking 2: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host "Attempt 3/3 (Should be BLOCKED)..." -ForegroundColor Cyan
try {
    $response3 = Invoke-WebRequest -Uri $BOOKING_ENDPOINT -Method POST -Body ($testData | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Rate Limiting FAILED - 3rd booking should have been blocked!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 429) {
        Write-Host "✅ Rate Limiting WORKING - 3rd booking blocked (429 Too Many Requests)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Blocked but with unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host ""

# Test 2: Turnstile Verification
Write-Host "TEST 2: Turnstile Token Verification" -ForegroundColor Green
Write-Host "-----------------------------------------------"

Write-Host "Testing with INVALID token..." -ForegroundColor Cyan
$testData.turnstile_token = "invalid-token-xxx"

try {
    $response = Invoke-WebRequest -Uri $BOOKING_ENDPOINT -Method POST -Body ($testData | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Turnstile Verification FAILED - Invalid token was accepted!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "✅ Turnstile Verification WORKING - Invalid token rejected (403 Forbidden)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Rejected but with unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host ""

# Test 3: Environment Variables Check
Write-Host "TEST 3: Environment Variables Check" -ForegroundColor Green
Write-Host "-----------------------------------------------"

$envFile = ".env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    
    $hasTurnstileSite = $envContent | Select-String "VITE_TURNSTILE_SITE_KEY"
    $hasTurnstileSecret = $envContent | Select-String "TURNSTILE_SECRET_KEY"
    
    if ($hasTurnstileSite) {
        Write-Host "✅ VITE_TURNSTILE_SITE_KEY configured" -ForegroundColor Green
    } else {
        Write-Host "❌ VITE_TURNSTILE_SITE_KEY missing in .env" -ForegroundColor Red
    }
    
    if ($hasTurnstileSecret) {
        Write-Host "✅ TURNSTILE_SECRET_KEY configured" -ForegroundColor Green
    } else {
        Write-Host "❌ TURNSTILE_SECRET_KEY missing in .env" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ .env file not found - using environment variables" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ""

# Summary
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If rate limiting passed: ✅ Protection working"
Write-Host "2. If Turnstile test passed: ✅ Token verification working"
Write-Host "3. If any test failed: Check BOT_PROTECTION_SETUP_GUIDE.md"
Write-Host ""
Write-Host "Monitor Cloudflare Turnstile dashboard for bot detection stats"
Write-Host "Dashboard: https://dash.cloudflare.com/turnstile"
Write-Host ""
