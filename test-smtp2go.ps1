# ============================================
# SMTP2GO API TEST SCRIPT
# Purpose: Verify SMTP2GO API key and account status
# Date: August 11, 2026
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SMTP2GO API DIAGNOSTIC TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# STEP 1: Get API Key
# ============================================
Write-Host "STEP 1: Enter SMTP2GO API Key" -ForegroundColor Yellow
Write-Host "You can find this in:" -ForegroundColor Gray
Write-Host "  1. Vercel: https://vercel.com/.../environment-variables" -ForegroundColor Gray
Write-Host "  2. SMTP2GO: https://www.smtp2go.com/ -> Settings -> API Keys" -ForegroundColor Gray
Write-Host ""

$apiKey = Read-Host "Enter SMTP2GO API Key (or press Enter to use test placeholder)"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    $apiKey = "your-smtp2go-api-key"
    Write-Host "⚠️  Using placeholder key (will fail - for demonstration only)" -ForegroundColor Yellow
} else {
    Write-Host "✅ API Key received (length: $($apiKey.Length) chars)" -ForegroundColor Green
}
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
    api_key = $apiKey
    to = @($testEmail)
    sender = "contact@orachope.org"
    subject = "SMTP2GO Diagnostic Test - $timestamp"
    html_body = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SMTP2GO Test</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h1 style="color: #2563eb;">🔍 SMTP2GO Diagnostic Test</h1>
    <p>This is a test email sent from the SMTP2GO diagnostic script.</p>
    
    <table style="margin: 20px 0; border-collapse: collapse;">
        <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Test Time:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">$timestamp</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Purpose:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Verify SMTP2GO API key and account status</td>
        </tr>
        <tr style="background-color: #f3f4f6;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">From:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">contact@orachope.org</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">API Provider:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">SMTP2GO</td>
        </tr>
    </table>
    
    <p style="color: #16a34a; font-weight: bold;">✅ If you received this email, SMTP2GO is working correctly!</p>
    
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
    
    <p style="color: #666; font-size: 12px;">
        This is an automated test email.<br>
        Project: sg-smile-saver<br>
        Script: test-smtp2go.ps1
    </p>
</body>
</html>
"@
} | ConvertTo-Json -Depth 3

Write-Host "✅ Payload prepared" -ForegroundColor Green
Write-Host "   To: $testEmail" -ForegroundColor Gray
Write-Host "   Subject: SMTP2GO Diagnostic Test - $timestamp" -ForegroundColor Gray
Write-Host ""

# ============================================
# STEP 4: Send Test Email
# ============================================
Write-Host "STEP 4: Sending Test Email to SMTP2GO API" -ForegroundColor Yellow
Write-Host "Endpoint: https://api.smtp2go.com/v3/email/send" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest `
        -Uri "https://api.smtp2go.com/v3/email/send" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
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
    if ($response.StatusCode -eq 200) {
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✅ SMTP2GO IS WORKING!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Email Details:" -ForegroundColor Cyan
        if ($responseJson.data.email_id) {
            Write-Host "  Email ID: $($responseJson.data.email_id)" -ForegroundColor Gray
        }
        if ($responseJson.data.succeeded) {
            Write-Host "  Succeeded: $($responseJson.data.succeeded)" -ForegroundColor Green
        }
        if ($responseJson.data.failed) {
            Write-Host "  Failed: $($responseJson.data.failed)" -ForegroundColor $(if ($responseJson.data.failed -gt 0) { "Red" } else { "Gray" })
        }
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "  1. Check inbox: $testEmail" -ForegroundColor Gray
        Write-Host "  2. If email not received, check spam folder" -ForegroundColor Gray
        Write-Host "  3. If still not received, check SMTP2GO dashboard for delivery status" -ForegroundColor Gray
        Write-Host "  4. If email received → SMTP2GO working, issue is in Vercel configuration" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "DIAGNOSIS: SMTP2GO API is functional" -ForegroundColor Green
        Write-Host "ROOT CAUSE: Likely Vercel environment variable issue" -ForegroundColor Yellow
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
        if ($errorBody -like "*Invalid API key*" -or $statusCode -eq 401) {
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "DIAGNOSIS: INVALID API KEY" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host ""
            Write-Host "The API key is not valid. Possible reasons:" -ForegroundColor Yellow
            Write-Host "  1. API key is a placeholder (your-smtp2go-api-key)" -ForegroundColor Gray
            Write-Host "  2. API key was revoked/deleted in SMTP2GO dashboard" -ForegroundColor Gray
            Write-Host "  3. API key is from a different SMTP2GO account" -ForegroundColor Gray
            Write-Host "  4. API key expired" -ForegroundColor Gray
            Write-Host ""
            Write-Host "FIX STEPS:" -ForegroundColor Cyan
            Write-Host "  1. Login to SMTP2GO: https://www.smtp2go.com/" -ForegroundColor Gray
            Write-Host "  2. Go to Settings -> API Keys" -ForegroundColor Gray
            Write-Host "  3. Create new API key (or verify existing one)" -ForegroundColor Gray
            Write-Host "  4. Copy the API key (starts with 'api-')" -ForegroundColor Gray
            Write-Host "  5. Update Vercel environment variable: SMTP2GO_API_KEY" -ForegroundColor Gray
            Write-Host "  6. Redeploy Vercel project" -ForegroundColor Gray
            Write-Host "  7. Re-run this test script with new key" -ForegroundColor Gray
            Write-Host ""
        } elseif ($statusCode -eq 403) {
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "DIAGNOSIS: ACCOUNT ISSUE" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host ""
            Write-Host "The API key is valid but account has restrictions. Possible reasons:" -ForegroundColor Yellow
            Write-Host "  1. Monthly quota exceeded (1,000 emails/month on free tier)" -ForegroundColor Gray
            Write-Host "  2. Account suspended (payment issue, ToS violation)" -ForegroundColor Gray
            Write-Host "  3. Sender domain not verified" -ForegroundColor Gray
            Write-Host ""
            Write-Host "FIX STEPS:" -ForegroundColor Cyan
            Write-Host "  1. Login to SMTP2GO dashboard" -ForegroundColor Gray
            Write-Host "  2. Check account status and quota" -ForegroundColor Gray
            Write-Host "  3. Contact SMTP2GO support: support@smtp2go.com" -ForegroundColor Gray
            Write-Host "  4. OR: Switch to Brevo as primary email provider" -ForegroundColor Gray
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
Write-Host "API Key tested: $(if ($apiKey -eq 'your-smtp2go-api-key') { 'PLACEHOLDER' } else { 'USER PROVIDED' })" -ForegroundColor Gray
Write-Host "Test recipient: $testEmail" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Review the diagnosis above" -ForegroundColor Gray
Write-Host "  2. Follow the recommended fix steps" -ForegroundColor Gray
Write-Host "  3. After fixing, re-run this script to verify" -ForegroundColor Gray
Write-Host "  4. Then update Vercel environment variables" -ForegroundColor Gray
Write-Host "  5. Deploy and test in production" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed fix guide, see: SMTP2GO_DIAGNOSTIC_PLAN.md" -ForegroundColor Cyan
Write-Host ""
