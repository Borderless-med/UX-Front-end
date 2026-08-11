# ============================================
# SMTP2GO API TEST - DIFFERENT SENDER
# Purpose: Test if FROM == TO is the issue (hypothesis test)
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SMTP2GO HYPOTHESIS TEST" -ForegroundColor Cyan
Write-Host "Testing if FROM == TO causes 400 error" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get API Key
$apiKey = Read-Host "Enter SMTP2GO API Key"
Write-Host ""

# ============================================
# TEST 1: FROM == TO (Expected to fail with 400)
# ============================================
Write-Host "TEST 1: Sending FROM contact@orachope.org TO contact@orachope.org" -ForegroundColor Yellow
Write-Host "Expected: 400 error (if hypothesis is correct)" -ForegroundColor Gray
Write-Host ""

$payload1 = @{
    api_key = $apiKey
    to = @("contact@orachope.org")
    sender = "contact@orachope.org"
    subject = "Test 1: FROM == TO"
    html_body = "<p>Testing FROM == TO scenario</p>"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "https://api.smtp2go.com/v3/email/send" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload1 `
        -ErrorAction Stop
    
    Write-Host "[SUCCESS] TEST 1 PASSED: Status 200" -ForegroundColor Green
    Write-Host "Result: FROM == TO is ALLOWED by SMTP2GO" -ForegroundColor Green
    Write-Host ""
} catch {
    $statusCode1 = $_.Exception.Response.StatusCode.value__
    Write-Host "[FAILED] TEST 1 FAILED: Status $statusCode1" -ForegroundColor Red
    
    if ($statusCode1 -eq 400) {
        Write-Host "Result: FROM == TO appears to be REJECTED by SMTP2GO" -ForegroundColor Yellow
    }
    Write-Host ""
}

# ============================================
# TEST 2: FROM != TO (Expected to succeed)
# ============================================
Write-Host "TEST 2: Sending FROM noreply@orachope.org TO contact@orachope.org" -ForegroundColor Yellow
Write-Host "Expected: 200 success (if hypothesis is correct)" -ForegroundColor Gray
Write-Host ""

$payload2 = @{
    api_key = $apiKey
    to = @("contact@orachope.org")
    sender = "noreply@orachope.org"
    subject = "Test 2: FROM != TO"
    html_body = "<p>Testing FROM != TO scenario</p>"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "https://api.smtp2go.com/v3/email/send" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload2 `
        -ErrorAction Stop
    
    Write-Host "[SUCCESS] TEST 2 PASSED: Status 200" -ForegroundColor Green
    Write-Host "Result: FROM != TO works!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check inbox: contact@orachope.org" -ForegroundColor Cyan
    Write-Host ""
} catch {
    $statusCode2 = $_.Exception.Response.StatusCode.value__
    Write-Host "[FAILED] TEST 2 ALSO FAILED: Status $statusCode2" -ForegroundColor Red
    
    if ($statusCode2 -eq 400) {
        Write-Host "Result: FROM != TO also rejected - NOT a FROM==TO issue" -ForegroundColor Yellow
        Write-Host "Likely cause: Sender domain NOT VERIFIED in SMTP2GO" -ForegroundColor Yellow
    }
    Write-Host ""
}

# ============================================
# CONCLUSION
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HYPOTHESIS TEST COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($statusCode1 -eq 400 -and !$statusCode2) {
    Write-Host "[CONFIRMED] HYPOTHESIS CONFIRMED:" -ForegroundColor Green
    Write-Host "   SMTP2GO rejects emails where FROM == TO" -ForegroundColor Green
    Write-Host ""
    Write-Host "FIX: Change admin email sender to noreply@orachope.org" -ForegroundColor Cyan
} elseif ($statusCode1 -eq 400 -and $statusCode2 -eq 400) {
    Write-Host "[REJECTED] HYPOTHESIS REJECTED:" -ForegroundColor Red
    Write-Host "   Both FROM == TO and FROM != TO fail with 400" -ForegroundColor Red
    Write-Host ""
    Write-Host "REAL CAUSE: Sender domain orachope.org NOT VERIFIED" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "FIX:" -ForegroundColor Cyan
    Write-Host "1. Login to SMTP2GO: https://www.smtp2go.com/" -ForegroundColor Gray
    Write-Host "2. Settings > Sender Domains" -ForegroundColor Gray
    Write-Host "3. Add and verify orachope.org domain" -ForegroundColor Gray
    Write-Host "4. Follow DNS setup instructions" -ForegroundColor Gray
} else {
    Write-Host "WARNING: UNEXPECTED RESULT - Check both tests above" -ForegroundColor Yellow
}

Write-Host ""
