# ============================================
# BREVO (Sendinblue) API TEST SCRIPT
# Purpose: Verify Brevo API key and account status
# Date: August 11, 2026
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BREVO API DIAGNOSTIC TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# STEP 1: Get API Key
# ============================================
Write-Host "STEP 1: Enter Brevo API Key" -ForegroundColor Yellow
Write-Host "You can find this in:" -ForegroundColor Gray
Write-Host "  1. Vercel: https://vercel.com/.../environment-variables" -ForegroundColor Gray
Write-Host "  2. Brevo: https://app.brevo.com/ -> Settings -> API Keys" -ForegroundColor Gray
Write-Host ""

$apiKey = Read-Host "Enter Brevo API Key (starts with 'xkeysib-')"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ API key is required" -ForegroundColor Red
    exit 1
}

Write-Host "✅ API Key received (length: $($apiKey.Length) chars)" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 2: Get Test Email Address
# ============================================
Write-Host "STEP 2: Enter Test Email Address" -ForegroundColor Yellow
$testEmail = Read-Host "Enter email to receive test (default: contact@orachope.org)"

if ([string]::IsNullOrWhiteSpace($testEmail)) {
    $testEmail = "contact@orachope.org"
}
Write-Host "✅ Test email: $testEmail" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 3: Prepare Test Payload
# ============================================
Write-Host "STEP 3: Preparing Test Email Payload" -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$body = @{
    sender = @{
        email = "contact@orachope.org"
        name = "OraChope.org"
    }
    to = @(
        @{
            email = $testEmail
        }
    )
    subject = "Brevo Diagnostic Test - $timestamp"
    htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Brevo Test</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h1 style="color: #0066ff;">🔍 Brevo (Sendinblue) Diagnostic Test</h1>
    <p>This is a test email sent from the Brevo diagnostic script.</p>
    
    <table style="margin: 20px 0; border-collapse: collapse;">
        <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Test Time:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">$timestamp</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Purpose:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Verify Brevo API key and account status</td>
        </tr>
        <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">From:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">contact@orachope.org</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">API Provider:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Brevo (formerly Sendinblue)</td>
        </tr>
    </table>
    
    <p style="color: #16a34a; font-weight: bold;">✅ If you received this email, Brevo is working correctly!</p>
    
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
    
    <p style="color: #666; font-size: 12px;">
        This is an automated test email.<br>
        Project: sg-smile-saver<br>
        Script: test-brevo.ps1
    </p>
</body>
</html>
"@
} | ConvertTo-Json -Depth 4

Write-Host "✅ Payload prepared" -ForegroundColor Green
Write-Host "   To: $testEmail" -ForegroundColor Gray
Write-Host "   Subject: Brevo Diagnostic Test - $timestamp" -ForegroundColor Gray
Write-Host ""

# ============================================
# STEP 4: Send Test Email
# ============================================
Write-Host "STEP 4: Sending Test Email to Brevo API" -ForegroundColor Yellow
Write-Host "Endpoint: https://api.brevo.com/v3/smtp/email" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest `
        -Uri "https://api.brevo.com/v3/smtp/email" `
        -Method POST `
        -Headers @{
            "Accept" = "application/json"
            "Content-Type" = "application/json"
            "api-key" = $apiKey
        } `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "✅ API REQUEST SUCCESSFUL" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "RESPONSE DETAILS" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response Body:" -ForegroundColor Gray
    $responseJson = $response.Content | ConvertFrom-Json
    $responseJson | ConvertTo-Json -Depth 5 | Write-Host
    Write-Host ""
    
    # Parse response
    if ($response.StatusCode -eq 201) {
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✅ BREVO IS WORKING!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Email Details:" -ForegroundColor Cyan
        if ($responseJson.messageId) {
            Write-Host "  Message ID: $($responseJson.messageId)" -ForegroundColor Gray
        }
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "  1. Check inbox: $testEmail" -ForegroundColor Gray
        Write-Host "  2. If email not received, check spam folder" -ForegroundColor Gray
        Write-Host "  3. If still not received, check Brevo dashboard for delivery status" -ForegroundColor Gray
        Write-Host "  4. If email received → Brevo working, can use as fallback" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "DIAGNOSIS: Brevo API is functional" -ForegroundColor Green
        Write-Host "RECOMMENDATION: Brevo can serve as reliable backup email service" -ForegroundColor Green
        Write-Host ""
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorResponse = $_.Exception.Response
    
    Write-Host "❌ API REQUEST FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR DETAILS" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host ""
    
    # Try to read error response body
    try {
        $stream = $errorResponse.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Response:" -ForegroundColor Gray
        $errorBody | Write-Host
        Write-Host ""
        
        # Parse common errors
        if ($statusCode -eq 401) {
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "DIAGNOSIS: INVALID API KEY" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host ""
            Write-Host "The API key is not valid. Possible reasons:" -ForegroundColor Yellow
            Write-Host "  1. API key was revoked/deleted in Brevo dashboard" -ForegroundColor Gray
            Write-Host "  2. API key is from a different Brevo account" -ForegroundColor Gray
            Write-Host "  3. API key doesn't have email sending permissions" -ForegroundColor Gray
            Write-Host ""
            Write-Host "FIX STEPS:" -ForegroundColor Cyan
            Write-Host "  1. Login to Brevo: https://app.brevo.com/" -ForegroundColor Gray
            Write-Host "  2. Go to Settings -> API Keys" -ForegroundColor Gray
            Write-Host "  3. Create new API key with 'Send emails' permission" -ForegroundColor Gray
            Write-Host "  4. Copy the API key (starts with 'xkeysib-')" -ForegroundColor Gray
            Write-Host "  5. Update Vercel environment variable: BREVO_API_KEY" -ForegroundColor Gray
            Write-Host "  6. Redeploy Vercel project" -ForegroundColor Gray
            Write-Host "  7. Re-run this test script with new key" -ForegroundColor Gray
            Write-Host ""
        } elseif ($statusCode -eq 403) {
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "DIAGNOSIS: PERMISSION ISSUE" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host ""
            Write-Host "The API key is valid but lacks permissions:" -ForegroundColor Yellow
            Write-Host "  1. API key doesn't have 'Send emails' permission" -ForegroundColor Gray
            Write-Host "  2. Account suspended" -ForegroundColor Gray
            Write-Host "  3. Daily quota exceeded (300 emails/day on free tier)" -ForegroundColor Gray
            Write-Host ""
            Write-Host "FIX STEPS:" -ForegroundColor Cyan
            Write-Host "  1. Check Brevo dashboard for account status" -ForegroundColor Gray
            Write-Host "  2. Verify API key has correct permissions" -ForegroundColor Gray
            Write-Host "  3. Check daily sending quota" -ForegroundColor Gray
            Write-Host "  4. Contact Brevo support if needed: support@brevo.com" -ForegroundColor Gray
            Write-Host ""
        } elseif ($statusCode -eq 400) {
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "DIAGNOSIS: INVALID REQUEST" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host ""
            Write-Host "The request format is invalid. Possible reasons:" -ForegroundColor Yellow
            Write-Host "  1. Sender email not verified in Brevo" -ForegroundColor Gray
            Write-Host "  2. Invalid email format" -ForegroundColor Gray
            Write-Host "  3. Missing required fields" -ForegroundColor Gray
            Write-Host ""
            Write-Host "FIX STEPS:" -ForegroundColor Cyan
            Write-Host "  1. Login to Brevo dashboard" -ForegroundColor Gray
            Write-Host "  2. Go to Senders & IP" -ForegroundColor Gray
            Write-Host "  3. Verify sender email: contact@orachope.org" -ForegroundColor Gray
            Write-Host "  4. Check domain authentication (SPF/DKIM)" -ForegroundColor Gray
            Write-Host ""
        }
        
    } catch {
        Write-Host "Could not read error response body" -ForegroundColor Gray
        Write-Host $_.Exception.Message -ForegroundColor Gray
    }
    
    Write-Host ""
}

# ============================================
# STEP 5: Summary & Recommendations
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTIC COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tested at: $timestamp" -ForegroundColor Gray
Write-Host "Test recipient: $testEmail" -ForegroundColor Gray
Write-Host ""
Write-Host "COMPARISON: Brevo vs SMTP2GO" -ForegroundColor Yellow
Write-Host ""
Write-Host "Brevo (Sendinblue):" -ForegroundColor Cyan
Write-Host "  ✅ Free tier: 300 emails/day (9,000/month)" -ForegroundColor Gray
Write-Host "  ✅ More generous limits" -ForegroundColor Gray
Write-Host "  ✅ Better deliverability reputation" -ForegroundColor Gray
Write-Host "  ⚠️  Requires sender verification" -ForegroundColor Gray
Write-Host ""
Write-Host "SMTP2GO:" -ForegroundColor Cyan
Write-Host "  ✅ Free tier: 1,000 emails/month" -ForegroundColor Gray
Write-Host "  ✅ Simple API" -ForegroundColor Gray
Write-Host "  ✅ Fast response times" -ForegroundColor Gray
Write-Host "  ⚠️  Lower monthly quota" -ForegroundColor Gray
Write-Host ""
Write-Host "RECOMMENDATION:" -ForegroundColor Yellow
Write-Host "  Use both with fallback logic:" -ForegroundColor Gray
Write-Host "  1. Try SMTP2GO first (fast)" -ForegroundColor Gray
Write-Host "  2. Fall back to Brevo if SMTP2GO fails" -ForegroundColor Gray
Write-Host "  3. Total capacity: ~10,000 emails/month" -ForegroundColor Gray
Write-Host ""
