# Quick Test Script for WhatsApp OTP

## Test OTP Flow (Local Development)

### 1. Start Dev Server
```powershell
npm run dev
```

### 2. Test OTP Request
```powershell
# Request OTP
curl -X POST http://localhost:5173/api/request-booking-otp `
  -H "Content-Type: application/json" `
  -d '{
    "whatsapp": "+65 82229202",
    "patient_name": "Test User"
  }'

# Expected Response:
# {
#   "success": true,
#   "booking_hash": "abc123...",
#   "expires_in": 300
# }
#
# Check console for OTP code (when WHATSAPP_ENABLED=false)
```

### 3. Test OTP Verification
```powershell
# Use the booking_hash from step 2 and OTP from console
curl -X POST http://localhost:5173/api/send-appointment-confirmation `
  -H "Content-Type: application/json" `
  -d '{
    "patient_name": "Test User",
    "email": "test@example.com",
    "whatsapp": "+65 82229202",
    "treatment_type": "Dental Checkup/Examination",
    "preferred_date": "2026-07-20",
    "time_slot": "10:00",
    "clinic_location": "Bukit Indah",
    "consent_given": true,
    "create_account": false,
    "turnstile_token": "dummy-token-for-testing",
    "otp_code": "123456",
    "booking_hash": "YOUR_BOOKING_HASH_HERE"
  }'
```

### 4. Test Rate Limiting
```powershell
# Run this 4 times - 4th should fail with rate limit
for ($i=1; $i -le 4; $i++) {
  Write-Host "Request $i"
  curl -X POST http://localhost:5173/api/request-booking-otp `
    -H "Content-Type: application/json" `
    -d '{
      "whatsapp": "+65 82229202",
      "patient_name": "Test User"
    }'
  Start-Sleep -Seconds 1
}
```

## Test Database Queries

### Check OTP Records
```sql
-- View all OTP records
SELECT 
  whatsapp,
  otp_code,
  verified,
  expires_at,
  attempts,
  created_at
FROM public.booking_otp_verification
ORDER BY created_at DESC
LIMIT 10;
```

### Check Active (Non-Expired) OTPs
```sql
SELECT 
  whatsapp,
  otp_code,
  verified,
  expires_at,
  EXTRACT(EPOCH FROM (expires_at - now())) as seconds_remaining
FROM public.booking_otp_verification
WHERE expires_at > now()
  AND verified = false
ORDER BY created_at DESC;
```

### Check Verification Success Rate
```sql
SELECT 
  COUNT(*) as total_otps,
  SUM(CASE WHEN verified THEN 1 ELSE 0 END) as verified_count,
  ROUND(100.0 * SUM(CASE WHEN verified THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate_percent
FROM public.booking_otp_verification
WHERE created_at > now() - INTERVAL '24 hours';
```

### Manual OTP Cleanup
```sql
-- Delete expired OTPs older than 1 hour
DELETE FROM public.booking_otp_verification
WHERE expires_at < now() - INTERVAL '1 hour';
```

## Test WhatsApp Template (Production Only)

### 1. Check Template Status
Go to: https://business.facebook.com/latest/whatsapp_manager/message_templates

Look for: `otp_verification` template  
Status should be: **Approved** ✅

### 2. Send Test OTP
```powershell
# Make sure WHATSAPP_ENABLED=true in Vercel
# Use your real WhatsApp number

# Fill form on https://orachope.org/book
# Click "Send Verification Code"
# Check your WhatsApp for message
```

## Troubleshooting

### OTP Not Sent
1. Check `WHATSAPP_ENABLED` in environment
2. Check Vercel logs for errors
3. Verify WhatsApp template is approved
4. Check Meta Business Manager for delivery status

### OTP Verification Fails
1. Check OTP hasn't expired (5 min limit)
2. Verify booking_hash matches
3. Check WhatsApp number format matches exactly
4. Review attempts count (max 3)

### Rate Limit Hit
1. Wait 1 hour for reset
2. Or use different WhatsApp number
3. Check rate limit settings in code

### Database Errors
1. Verify migration was applied:
   ```sql
   SELECT * FROM pg_tables WHERE tablename = 'booking_otp_verification';
   ```
2. Check RLS policies are enabled
3. Verify indexes exist

## Expected Logs

### Successful OTP Request
```
🔐 Generating OTP for +65 82229202 - Hash: abc123...
📱 WhatsApp disabled - OTP would be: 123456  (or)
✅ OTP sent to WhatsApp: +65 82229202
✅ OTP sent successfully - expires in 5 minutes
```

### Successful OTP Verification
```
🔐 Verifying OTP - Hash: abc123..., WhatsApp: +65 82229202
✅ OTP verified successfully
✅ All security checks passed - processing booking
```

### Failed Verification
```
❌ Invalid OTP code
⏰ OTP expired
⚠️ Max OTP attempts exceeded
```

## Performance Benchmarks

- OTP generation: <100ms
- WhatsApp delivery: 2-5 seconds
- OTP verification: <50ms
- Total added time to booking: ~30 seconds

## Security Checks

- [x] OTP is random (6 digits)
- [x] OTP expires in 5 minutes
- [x] Max 3 verification attempts
- [x] Rate limiting: 3 requests/hour
- [x] Booking hash prevents reuse
- [x] WhatsApp number must match
- [x] OTPs cleaned up after 1 hour
