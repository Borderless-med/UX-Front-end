/**
 * WhatsApp Template Configuration
 * 
 * This file centralizes WhatsApp Business API template management.
 * When Meta approves new templates, simply update the template names
 * and variable mappings here - no changes needed to core logic.
 * 
 * CURRENT STATUS: Using approved "booking_request_received" template
 * FUTURE: Switch to "authentication_otp" when Meta grants Advanced Access
 */

export interface WhatsAppTemplateVariable {
  type: 'text';
  text: string;
}

export interface WhatsAppTemplateConfig {
  name: string;
  language: string;
  variables: string[]; // Variable names for documentation
  mapToVariables: (...values: string[]) => WhatsAppTemplateVariable[];
}

// ============================================
// OTP DELIVERY TEMPLATES
// ============================================

/**
 * CURRENT: Dynamic OTP delivery using approved booking template
 * Uses: booking_request_received (Meta Approved ✅)
 * Method: Injects "VERIFICATION CODE: {dynamic_otp}" into booking_ref variable
 * Storage: OTP stored in otp_verifications table with 5-minute expiry
 * 
 * Note: This is a "piggyback" approach using the booking confirmation template
 * to deliver OTP codes. When Meta approves a dedicated authentication template,
 * migrate to OTP_DELIVERY_TEMPLATE_WHATSAPP_PRODUCTION below.
 */
export const OTP_DELIVERY_TEMPLATE_WHATSAPP: WhatsAppTemplateConfig = {
  name: 'booking_request_received', // Approved template
  language: 'en',
  variables: [
    'patient_name',     // First name of patient
    'booking_ref',      // Contains "VERIFICATION CODE: {dynamic_otp}"
    'clinic_name',      // "OraChope Verification"
    'clinic_address',   // "Singapore & Johor Bahru"
    'treatment_type',   // "Account Verification"
    'requested_date',   // Current date
    'time_slot'         // "Within 5 minutes"
  ],
  mapToVariables: (otpCode: string, patientName: string) => {
    const firstName = patientName.split(' ')[0];
    return [
      { type: 'text', text: firstName },
      { type: 'text', text: `VERIFICATION CODE: ${otpCode}` },
      { type: 'text', text: 'OraChope Verification' },
      { type: 'text', text: 'Singapore & Johor Bahru' },
      { type: 'text', text: 'Account Verification' },
      { type: 'text', text: new Date().toLocaleDateString('en-SG', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      })},
      { type: 'text', text: 'Within 5 minutes' }
    ];
  }
};

/**
 * FUTURE: Proper Authentication OTP Template (when approved)
 * Uncomment and use this when Meta grants Advanced Access + Authentication Template
 */
/*
export const OTP_DELIVERY_TEMPLATE_WHATSAPP_PRODUCTION: WhatsAppTemplateConfig = {
  name: 'authentication_otp', // Your approved template name
  language: 'en',
  variables: [
    'otp_code',
    'expiry_minutes'
  ],
  mapToVariables: (otpCode: string, expiryMinutes: string = '5') => [
    { type: 'text', text: otpCode },
    { type: 'text', text: expiryMinutes }
  ]
};
*/

// ============================================
// BOOKING CONFIRMATION TEMPLATES
// ============================================

/**
 * Booking confirmation sent after successful appointment booking
 * Uses: booking_request_received (Meta Approved ✅)
 */
export const BOOKING_CONFIRMATION_TEMPLATE: WhatsAppTemplateConfig = {
  name: 'booking_request_received',
  language: 'en',
  variables: [
    'patient_name',
    'booking_ref',
    'clinic_name',
    'clinic_address',
    'treatment_type',
    'requested_date',
    'time_slot'
  ],
  mapToVariables: (
    patientName: string,
    bookingRef: string,
    clinicName: string,
    clinicAddress: string,
    treatmentType: string,
    requestedDate: string,
    timeSlot: string
  ) => [
    { type: 'text', text: patientName.split(' ')[0] },
    { type: 'text', text: bookingRef },
    { type: 'text', text: clinicName },
    { type: 'text', text: clinicAddress },
    { type: 'text', text: treatmentType },
    { type: 'text', text: requestedDate },
    { type: 'text', text: timeSlot }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format phone number for WhatsApp API (no spaces, no + prefix)
 */
export function formatWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Build WhatsApp API request body
 */
export function buildWhatsAppTemplateRequest(
  recipientPhone: string,
  template: WhatsAppTemplateConfig,
  variables: WhatsAppTemplateVariable[]
) {
  return {
    messaging_product: 'whatsapp',
    to: formatWhatsAppNumber(recipientPhone),
    type: 'template',
    template: {
      name: template.name,
      language: { code: template.language },
      components: [
        {
          type: 'body',
          parameters: variables.map((v, index) => ({
            ...v,
            parameter_name: template.variables[index] // Required by production API
          }))
        }
      ]
    }
  };
}

// ============================================
// MIGRATION SWITCH
// ============================================

/**
 * THE SWITCH: Change this when Meta approves Authentication Template
 * 
 * Current: Uses booking_request_received (piggyback method)
 * Future: Uncomment line below and change to OTP_DELIVERY_TEMPLATE_WHATSAPP_PRODUCTION
 */
export const ACTIVE_OTP_TEMPLATE = OTP_DELIVERY_TEMPLATE_WHATSAPP;
// export const ACTIVE_OTP_TEMPLATE = OTP_DELIVERY_TEMPLATE_WHATSAPP_PRODUCTION; // Enable after Meta approval

export const ACTIVE_BOOKING_TEMPLATE = BOOKING_CONFIRMATION_TEMPLATE;
