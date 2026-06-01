// ============================================
// EMAIL TEMPLATES
// All 7 email notification templates
// ============================================

import { NotificationData } from '../services/notification-service';

export interface EmailTemplate {
  subject: string;
  html: string;
}

type EmailTemplateFunction = (data: NotificationData) => EmailTemplate;

// Template 1: Booking Confirmation (Patient)
const bookingConfirmationPatient: EmailTemplateFunction = (data) => ({
  subject: `✅ Booking Request Received - ${data.booking_ref}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Booking Request Received!</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your booking request is being processed</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0 0 10px; font-size: 20px;">Booking Reference: ${data.booking_ref}</h2>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Please keep this reference number for your records</p>
          </div>
          
          <h3 style="color: #374151; margin: 20px 0 10px;">Appointment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Patient Name:</td><td style="padding: 8px 0;">${data.patient_name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Clinic:</td><td style="padding: 8px 0;">${data.clinic_name}<br><span style="font-size: 13px; color: #6b7280;">${data.clinic_address}<br>${data.clinic_city}, ${data.clinic_state} ${data.clinic_postcode}<br>${data.clinic_country}</span></td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Treatment:</td><td style="padding: 8px 0;">${data.treatment_type}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Date:</td><td style="padding: 8px 0;">${data.formatted_date}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Time:</td><td style="padding: 8px 0;">${data.time_slot}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">WhatsApp:</td><td style="padding: 8px 0;">${data.patient_whatsapp}</td></tr>
          </table>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #92400e; margin: 0 0 8px; font-size: 16px;">⏰ What Happens Next?</h4>
            <p style="margin: 0; color: #92400e; font-size: 14px;">The clinic will respond within 3 hours to confirm your appointment. We'll notify you immediately via WhatsApp and email.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; margin: 0;">Questions? Contact us:</p>
            <p style="color: #2563eb; margin: 5px 0; font-weight: 600;">WhatsApp: +65 8810 4928</p>
            <p style="color: #2563eb; margin: 5px 0; font-weight: 600;">Email: contact@orachope.org</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">© 2026 OraChope.org | Making dental care accessible across borders</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

// Template 2: Booking Alert (Clinic)
const bookingAlertClinic: EmailTemplateFunction = (data) => ({
  subject: `🔔 NEW BOOKING - ${data.booking_ref} | ${data.clinic_name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <div style="background: #dc2626; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 18px;">FOR: ${data.clinic_name}</h2>
        </div>
        
        <h1 style="margin: 0 0 10px; color: #1e3a8a; font-size: 24px;">NEW BOOKING REQUEST</h1>
        <p style="margin: 0 0 20px; color: #334155; font-size: 14px;">Reference: <strong>${data.booking_ref}</strong></p>
        
        <h3 style="margin: 20px 0 10px; color: #374151;">Patient Information</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Name:</td><td style="padding: 6px 0;">${data.patient_name}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">WhatsApp:</td><td style="padding: 6px 0;">${data.patient_whatsapp}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Email:</td><td style="padding: 6px 0;">${data.patient_email}</td></tr>
        </table>
        
        <h3 style="margin: 20px 0 10px; color: #374151;">Appointment Request</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Treatment:</td><td style="padding: 6px 0;">${data.treatment_type}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Date:</td><td style="padding: 6px 0;">${data.formatted_date}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Time:</td><td style="padding: 6px 0;">${data.time_slot}</td></tr>
        </table>
        
        <div style="background: #fef2f2; border: 2px solid #dc2626; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="color: #991b1b; margin: 0 0 8px;">⏰ ACTION REQUIRED WITHIN 3 HOURS</h4>
          <p style="margin: 0; color: #991b1b; font-size: 14px;">This booking will AUTO-EXPIRE at ${data.expires_at} if you do not respond.</p>
        </div>
        
        <div style="margin: 30px 0;">
          <p style="text-align: center; margin: 0 0 16px; color: #64748b; font-size: 14px; font-weight: 600;">Choose your response:</p>
          <a href="${data.confirm_url}" style="display: block; background: #059669; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 0 12px; text-align: center; font-size: 15px;">✓ Confirm Appointment</a>
          <a href="${data.alternatives_url}" style="display: block; background: #3b82f6; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 0 12px; text-align: center; font-size: 15px;">↻ Suggest Alternative Times</a>
          <a href="${data.reject_url}" style="display: block; background: #6b7280; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0; text-align: center; font-size: 15px;">✕ Decline Booking</a>
        </div>
        
        <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">OraChope.org | Partner Support: contact@orachope.org</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

// Template 3: Appointment Confirmed (Patient)
const appointmentConfirmed: EmailTemplateFunction = (data) => ({
  subject: `🎉 Appointment Confirmed - ${data.booking_ref}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Appointment Confirmed!</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Great news ${data.patient_name}!</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 20px;"><strong>${data.clinic_name}</strong> has confirmed your appointment.</p>
          
          <div style="background: #f0fdf4; border: 2px solid #22c55e; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin: 0 0 15px;">✅ Confirmed Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; font-weight: 600; color: #166534;">Reference:</td><td style="padding: 6px 0;">${data.booking_ref}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600; color: #166534;">Date:</td><td style="padding: 6px 0;">${data.formatted_date}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600; color: #166534;">Time:</td><td style="padding: 6px 0;">${data.time_slot}</td></tr>
            </table>
          </div>
          
          <h3 style="color: #374151; margin: 20px 0 10px;">📍 Location</h3>
          <p style="margin: 0; color: #6b7280; line-height: 1.6;">
            ${data.clinic_name}<br>
            ${data.clinic_address}<br>
            ${data.clinic_city}, ${data.clinic_state} ${data.clinic_postcode}<br>
            ${data.clinic_country}
          </p>
          
          <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #1e40af; margin: 0 0 10px;">📍 Travel Guide & Directions</h4>
            <p style="margin: 0 0 10px; color: #1e40af; font-size: 14px;">Visit <a href="${data.travel_guide_url}" style="color: #2563eb; font-weight: 600;">OraChope.org/travel-guide</a> for SG→JB travel tips</p>
            <a href="${data.google_maps_url}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 600; margin-top: 10px;">View on Google Maps</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0;">⏰ We'll send you a reminder 24 hours before your appointment.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px;">Need to cancel?</p>
            <a href="${data.cancel_url}" style="display: inline-block; background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 600;">Cancel This Booking</a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">© 2026 OraChope.org | Making dental care accessible</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

// Template 4: Alternatives Offered (Patient)
const alternativesOffered: EmailTemplateFunction = (data) => ({
  subject: `📅 Alternative Slots Available - ${data.booking_ref}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <h1 style="margin: 0 0 10px; color: #2563eb; font-size: 24px;">📅 Alternative Slots Available</h1>
        <p style="margin: 0 0 20px; color: #6b7280;">Hi ${data.patient_name},</p>
        
        <p style="margin: 0 0 15px; color: #374151;"><strong>${data.clinic_name}</strong> cannot accommodate your requested time:</p>
        <div style="background: #f8fafc; padding: 12px; border-left: 4px solid #dc2626; margin: 0 0 20px;">
          <strong>${data.original_date}, ${data.original_time}</strong>
        </div>
        
        <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="color: #1e40af; margin: 0 0 10px;">🏥 Clinic Location</h4>
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            ${data.clinic_name}<br>
            ${data.clinic_address}<br>
            ${data.clinic_city}, ${data.clinic_state}<br>
            ${data.clinic_country}
          </p>
        </div>
        
        <p style="margin: 20px 0 10px; color: #374151; font-weight: 600;">However, they've offered these alternatives:</p>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 0 0 20px;">
          ${data.alternative_slots}
        </div>
        
        <p style="margin: 20px 0; color: #6b7280;">Are you interested in these alternatives?</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.confirm_url}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">✅ YES, PICK A SLOT</a>
          <a href="${data.reject_url}" style="display: inline-block; background: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">❌ NO, FIND OTHER CLINIC</a>
        </div>
        
        <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">© 2026 OraChope.org</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

// Template 5: Booking Expired (Patient)
const bookingExpired: EmailTemplateFunction = (data) => ({
  subject: `⏰ Booking Expired - ${data.booking_ref}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <h1 style="margin: 0 0 10px; color: #dc2626; font-size: 24px;">⏰ Booking Expired</h1>
        <p style="margin: 0 0 20px; color: #6b7280;">Hi ${data.patient_name},</p>
        
        <p style="margin: 0 0 15px; color: #374151;">Unfortunately, <strong>${data.clinic_name}</strong> did not respond to your booking request within 3 hours.</p>
        
        <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 0 0 20px;">
          <p style="margin: 0; color: #991b1b;"><strong>Reference: ${data.booking_ref}</strong> (Expired)</p>
        </div>
        
        <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="color: #1e40af; margin: 0 0 10px;">🏥 Original Clinic</h4>
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            ${data.clinic_name}<br>
            ${data.clinic_address}<br>
            ${data.clinic_city}, ${data.clinic_state}<br>
            ${data.clinic_country}
          </p>
        </div>
        
        <p style="margin: 20px 0; color: #374151;">We can help you find another clinic for <strong>${data.treatment_type}</strong> on <strong>${data.formatted_date}</strong>.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://orachope.org/clinics?treatment=${encodeURIComponent(data.treatment_type || '')}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">🔍 BROWSE OTHER CLINICS</a>
          <a href="https://wa.me/6588104928" style="display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">💬 CONTACT SUPPORT</a>
        </div>
        
        <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 20px 0;">We apologize for the inconvenience.</p>
        
        <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">© 2026 OraChope.org</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

// Template 6: Urgent Clinic Nudge
const urgentClinicNudge: EmailTemplateFunction = (data) => ({
  subject: `🚨 URGENT: Booking Expiring - ${data.booking_ref}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <div style="background: #dc2626; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 18px;">FOR: ${data.clinic_name}</h2>
        </div>
        
        <h1 style="margin: 0 0 10px; color: #dc2626; font-size: 24px;">🚨 URGENT: BOOKING EXPIRING</h1>
        <p style="margin: 0 0 20px; color: #334155; font-size: 14px;">Reference: <strong>${data.booking_ref}</strong></p>
        
        <div style="background: #fef2f2; border: 3px solid #dc2626; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
          <h3 style="color: #991b1b; margin: 0 0 10px; font-size: 20px;">⏰ AUTO-EXPIRES IN 30 MINUTES</h3>
          <p style="color: #991b1b; margin: 0; font-size: 16px; font-weight: 600;">Expiry time: ${data.expires_at}</p>
        </div>
        
        <h3 style="margin: 20px 0 10px; color: #374151;">Patient Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Name:</td><td style="padding: 6px 0;">${data.patient_name}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Treatment:</td><td style="padding: 6px 0;">${data.treatment_type}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Date:</td><td style="padding: 6px 0;">${data.formatted_date}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Time:</td><td style="padding: 6px 0;">${data.time_slot}</td></tr>
        </table>
        
        <div style="background: #fffbeb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 13px;"><strong>Note:</strong> If you offer alternatives, expiry will extend by 60 minutes.</p>
        </div>
        
        <h3 style="color: #dc2626; margin: 20px 0 10px;">PLEASE RESPOND IMMEDIATELY:</h3>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.confirm_url}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">✅ CONFIRM NOW</a>
          <a href="${data.reject_url}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">❌ REJECT NOW</a>
          <a href="${data.alternatives_url}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">🔄 OFFER ALTERNATIVES</a>
        </div>
        
        <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">OraChope.org | Partner Support: contact@orachope.org</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

// Template 7: 24-Hour Reminder (Patient)
const appointmentReminder24h: EmailTemplateFunction = (data) => ({
  subject: `⏰ Appointment Tomorrow - ${data.clinic_name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">⏰ Appointment Reminder</h1>
          <p style="margin: 10px 0 0; font-size: 18px; font-weight: 600;">Your appointment is TOMORROW!</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">Hi ${data.patient_name}, 🎯</p>
          
          <div style="background: #fff7ed; border: 2px solid #f59e0b; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #92400e; margin: 0 0 15px;">📋 Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; font-weight: 600; color: #78350f;">Clinic:</td><td style="padding: 6px 0;">${data.clinic_name}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600; color: #78350f;">Date:</td><td style="padding: 6px 0;">${data.formatted_date}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600; color: #78350f;">Time:</td><td style="padding: 6px 0;">${data.time_slot}</td></tr>
            </table>
          </div>
          
          <h3 style="color: #374151; margin: 20px 0 10px;">📍 Location</h3>
          <p style="margin: 0; color: #6b7280; line-height: 1.6;">
            ${data.clinic_name}<br>
            ${data.clinic_address}<br>
            ${data.clinic_city}, ${data.clinic_state} ${data.clinic_postcode}<br>
            ${data.clinic_country}
          </p>
          
          <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #1e40af; margin: 0 0 10px;">🚗 TRAVEL GUIDE (SG → JB)</h4>
            <p style="margin: 0 0 10px; color: #1e40af; font-size: 14px;">Visit <a href="${data.travel_guide_url}" style="color: #2563eb; font-weight: 600;">OraChope.org/travel-guide</a> for detailed travel tips</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.clinic_card_url}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">📍 VIEW CLINIC DETAILS<br><span style="font-size: 12px; opacity: 0.9;">(Map & Directions)</span></a>
            <a href="${data.google_maps_url}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">💬 CONTACT CLINIC</a>
          </div>
          
          <p style="text-align: center; color: #6b7280; font-size: 16px; margin: 30px 0;">See you tomorrow! Safe travels 🚗</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">© 2026 OraChope.org | Making dental care accessible</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

// Export all templates
export const emailTemplates: Record<string, EmailTemplateFunction> = {
  booking_confirmation_patient: bookingConfirmationPatient,
  booking_alert_clinic: bookingAlertClinic,
  appointment_confirmed: appointmentConfirmed,
  alternatives_offered: alternativesOffered,
  booking_expired: bookingExpired,
  urgent_clinic_nudge: urgentClinicNudge,
  appointment_reminder_24h: appointmentReminder24h,
};
