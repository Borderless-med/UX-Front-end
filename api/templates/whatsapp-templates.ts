// ============================================
// WHATSAPP TEMPLATES
// Mappings to WhatsApp Business API templates
// Actual templates must be created and approved in Meta Business Manager
// ============================================

import { NotificationData } from '../services/notification-service';

export interface WhatsAppTemplate {
  templateName: string;
  variables: string[];
  buttons?: string[];
}

type WhatsAppTemplateFunction = (data: NotificationData) => WhatsAppTemplate;

// Template 1: Booking Confirmation (Patient)
const bookingConfirmationPatient: WhatsAppTemplateFunction = (data) => ({
  templateName: 'booking_confirmation_patient',
  variables: [
    data.patient_name || '',
    data.booking_ref || '',
    data.clinic_name || '',
    `${data.clinic_address}, ${data.clinic_city}, ${data.clinic_state} ${data.clinic_postcode}, ${data.clinic_country}`,
    data.treatment_type || '',
    data.formatted_date || '',
    data.time_slot || '',
  ],
});

// Template 2: Booking Alert (Clinic)
const bookingAlertClinic: WhatsAppTemplateFunction = (data) => ({
  templateName: 'booking_alert_clinic',
  variables: [
    data.clinic_name || '',
    data.booking_ref || '',
    data.patient_name || '',
    data.patient_whatsapp || '',
    data.treatment_type || '',
    data.formatted_date || '',
    data.time_slot || '',
    data.expires_at || '',
  ],
  buttons: [
    data.confirm_url || '',
    data.reject_url || '',
    data.alternatives_url || '',
  ],
});

// Template 3: Appointment Confirmed (Patient)
const appointmentConfirmed: WhatsAppTemplateFunction = (data) => ({
  templateName: 'appointment_confirmed',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.booking_ref || '',
    data.formatted_date || '',
    data.time_slot || '',
    `${data.clinic_address}, ${data.clinic_city}, ${data.clinic_state} ${data.clinic_postcode}, ${data.clinic_country}`,
    data.travel_guide_url || '',
    data.google_maps_url || '',
  ],
  buttons: [data.cancel_url || ''],
});

// Template 4: Alternatives Offered (Patient)
const alternativesOffered: WhatsAppTemplateFunction = (data) => ({
  templateName: 'alternatives_offered',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.original_date || '',
    data.original_time || '',
    `${data.clinic_address}, ${data.clinic_city}, ${data.clinic_state}, ${data.clinic_country}`,
    data.alternative_slots || '',
  ],
  buttons: [data.confirm_url || '', data.reject_url || ''],
});

// Template 5: Booking Expired (Patient)
const bookingExpired: WhatsAppTemplateFunction = (data) => ({
  templateName: 'booking_expired',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.booking_ref || '',
    `${data.clinic_address}, ${data.clinic_city}, ${data.clinic_state}, ${data.clinic_country}`,
    data.treatment_type || '',
    data.formatted_date || '',
  ],
  buttons: [
    `https://orachope.org/clinics?treatment=${encodeURIComponent(data.treatment_type || '')}`,
    'https://wa.me/6588104928',
  ],
});

// Template 6: Urgent Clinic Nudge
const urgentClinicNudge: WhatsAppTemplateFunction = (data) => ({
  templateName: 'urgent_clinic_nudge',
  variables: [
    data.clinic_name || '',
    data.booking_ref || '',
    data.expires_at || '',
    data.patient_name || '',
    data.treatment_type || '',
    data.formatted_date || '',
    data.time_slot || '',
  ],
  buttons: [
    data.confirm_url || '',
    data.reject_url || '',
    data.alternatives_url || '',
  ],
});

// Template 7: 24-Hour Reminder (Patient)
const appointmentReminder24h: WhatsAppTemplateFunction = (data) => ({
  templateName: 'appointment_reminder_24h',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.formatted_date || '',
    data.time_slot || '',
    `${data.clinic_address}, ${data.clinic_city}, ${data.clinic_state} ${data.clinic_postcode}, ${data.clinic_country}`,
    data.travel_guide_url || '',
  ],
  buttons: [data.clinic_card_url || '', data.google_maps_url || ''],
});

// Export all templates
export const whatsappTemplates: Record<string, WhatsAppTemplateFunction> = {
  booking_confirmation_patient: bookingConfirmationPatient,
  booking_alert_clinic: bookingAlertClinic,
  appointment_confirmed: appointmentConfirmed,
  alternatives_offered: alternativesOffered,
  booking_expired: bookingExpired,
  urgent_clinic_nudge: urgentClinicNudge,
  appointment_reminder_24h: appointmentReminder24h,
};
