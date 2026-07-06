// ============================================
// WHATSAPP TEMPLATES
// Mappings to WhatsApp Business API templates
// Actual templates must be created and approved in Meta Business Manager
// ============================================

import { NotificationData } from '../services/notification-service.js';

export interface WhatsAppTemplate {
  templateName: string;
  variables: string[];
  variableNames?: string[];
  buttons?: string[];
  buttonHasVariable?: boolean[];
}

type WhatsAppTemplateFunction = (data: NotificationData) => WhatsAppTemplate;

// Template 1: Booking Request Received (Patient)
const bookingRequestReceived: WhatsAppTemplateFunction = (data) => ({
  templateName: 'booking_request_received',
  variables: [
    data.patient_name || '',
    data.booking_ref || '',
    data.clinic_name || '',
    data.clinic_address || '',
    data.treatment_type || '',
    data.requested_date || data.formatted_date || '',
    data.time_slot || '',
  ],
  variableNames: [
    'patient_name',
    'booking_ref',
    'clinic_name',
    'clinic_address',
    'treatment_type',
    'requested_date',
    'time_slot',
  ],
  buttons: [data.travel_guide_url || 'https://orachope.org/travel-guide'],
  buttonHasVariable: [false],
});

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
  templateName: 'booking_alert_clinic_v7',
  variables: [
    data.clinic_name || '',
    data.booking_ref || '',
    data.patient_name || '',
    data.treatment_type || '',
    data.requested_time || `${data.formatted_date || ''}${data.time_slot ? ` ${data.time_slot}` : ''}`.trim(),
    data.expires_at || '',
  ],
  variableNames: [
    'clinic_name',
    'booking_ref',
    'patient_name',
    'treatment_type',
    'requested_time',
    'expires_at',
  ],
  buttons: [data.clinic_response_url || data.confirm_url || data.alternatives_url || data.reject_url || ''],
  buttonHasVariable: [true],
});

// Template 3: Appointment Confirmed (Patient)
const appointmentConfirmed: WhatsAppTemplateFunction = (data) => ({
  templateName: 'appointment_confirmation_v3',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.booking_ref || '',
    data.formatted_date || data.appointment_date || '',
    data.time_slot || data.appointment_time || '',
    `${data.clinic_address}, ${data.clinic_city}, ${data.clinic_state} ${data.clinic_postcode}, ${data.clinic_country}`,
  ],
  variableNames: [
    'patient_name',
    'clinic_name',
    'booking_ref',
    'appointment_date',
    'appointment_time',
    'clinic_address',
  ],
  buttons: [
    data.google_maps_url || data.travel_guide_url || '',
    data.cancel_url || '',
  ],
  buttonHasVariable: [true, true],
});

// Template 4A: Alternatives Offered - 1 Slot (Patient)
// ============================================
// META BUSINESS MANAGER TEMPLATE STRUCTURE:
// ============================================
// Template Name: alternatives_offered_1slot
// Category: UTILITY
// Language: English (en)
// 
// Header (TEXT): "Alternative Time Available"
// 
// Body:
// Hi {{1}}, {{2}} cannot accommodate your original request:
// 
// {{3}} at {{4}} ❌
// 
// They've offered this alternative time. Tap to confirm:
// 
// Not interested? Visit orachope.org/clinics
// 
// Footer: "OraChope.org"
// 
// Buttons (CTA URL):
// Button 1: Text = {{5}}, URL = {{6}}
// 
// Variables:
// {{1}} = patient_name
// {{2}} = clinic_name
// {{3}} = original_date (e.g., "2026-06-11")
// {{4}} = original_time (e.g., "15:00")
// {{5}} = slot1_button_text (e.g., "📅 Fri 13 Jun, 10:00 AM")
// {{6}} = slot1_url
// ============================================
const alternativesOffered1Slot: WhatsAppTemplateFunction = (data) => ({
  templateName: 'alternatives_offered_1slot',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.original_date || '',
    data.original_time || '',
    data.slot1_button_text || '',  // e.g., "📅 Fri 13 Jun, 10:00 AM"
  ],
  buttons: [
    data.slot1_url || '',  // Button 1: Only slot
  ],
});

// Template 4B: Alternatives Offered - 2 Slots (Patient)
// ============================================
// META BUSINESS MANAGER TEMPLATE STRUCTURE:
// ============================================
// Template Name: alternatives_offered_2slot
// Category: UTILITY
// Language: English (en)
// 
// Header (TEXT): "Alternative Times Available"
// 
// Body:
// Hi {{1}}, {{2}} cannot accommodate your original request:
// 
// {{3}} at {{4}} ❌
// 
// They've offered these 2 alternative times. Tap to confirm:
// 
// Not interested? Visit orachope.org/clinics
// 
// Footer: "OraChope.org"
// 
// Buttons (CTA URL):
// Button 1: Text = {{5}}, URL = {{6}}
// Button 2: Text = {{7}}, URL = {{8}}
// 
// Variables:
// {{1}} = patient_name
// {{2}} = clinic_name
// {{3}} = original_date (e.g., "2026-06-11")
// {{4}} = original_time (e.g., "15:00")
// {{5}} = slot1_button_text (e.g., "📅 Fri 13 Jun, 10:00 AM")
// {{6}} = slot1_url
// {{7}} = slot2_button_text (e.g., "📅 Sat 14 Jun, 2:00 PM")
// {{8}} = slot2_url
// ============================================
const alternativesOffered2Slot: WhatsAppTemplateFunction = (data) => ({
  templateName: 'alternatives_offered_2slot_v4',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.slot1_details || data.original_date || '',
    data.slot2_details || data.original_time || '',
  ],
  variableNames: [
    'patient_name',
    'clinic_name',
    'slot_1_details',
    'slot_2_details',
  ],
  buttons: [
    data.slot1_url || '',  // Button 1: First alternative slot
    data.slot2_url || '',  // Button 2: Second alternative slot
  ],
  buttonHasVariable: [true, true],
});

// Template 4C: Alternatives Offered - 3 Slots (Patient)
// ============================================
// META BUSINESS MANAGER TEMPLATE STRUCTURE:
// ============================================
// Template Name: alternatives_offered_3slot
// Category: UTILITY
// Language: English (en)
// 
// Header (TEXT): "Alternative Times Available"
// 
// Body:
// Hi {{1}}, {{2}} cannot accommodate your original request:
// 
// {{3}} at {{4}} ❌
// 
// They've offered these 3 alternative times. Tap to confirm:
// 
// Not interested? Visit orachope.org/clinics
// 
// Footer: "OraChope.org"
// 
// Buttons (CTA URL):
// Button 1: Text = {{5}}, URL = {{6}}
// Button 2: Text = {{7}}, URL = {{8}}
// Button 3: Text = {{9}}, URL = {{10}}
// 
// Variables:
// {{1}} = patient_name
// {{2}} = clinic_name
// {{3}} = original_date (e.g., "2026-06-11")
// {{4}} = original_time (e.g., "15:00")
// {{5}} = slot1_button_text (e.g., "📅 Fri 13 Jun, 10:00 AM")
// {{6}} = slot1_url
// {{7}} = slot2_button_text (e.g., "📅 Sat 14 Jun, 2:00 PM")
// {{8}} = slot2_url
// {{9}} = slot3_button_text (e.g., "📅 Mon 16 Jun, 9:00 AM")
// {{10}} = slot3_url
// ============================================
const alternativesOffered3Slot: WhatsAppTemplateFunction = (data) => ({
  templateName: 'alternatives_offered_3slot_v5',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.slot1_details || data.original_date || '',
    data.slot2_details || data.original_time || '',
    data.slot3_details || '',
    data.slot3_url || '',
  ],
  variableNames: [
    'patient_name',
    'clinic_name',
    'slot_1_details',
    'slot_2_details',
    'slot_3_details',
    'slot_3_url',
  ],
  buttons: [
    data.slot1_url || '',  // Button 1: First alternative slot
    data.slot2_url || '',  // Button 2: Second alternative slot
  ],
  buttonHasVariable: [true, true],
});

// Template 5: Booking Expired (Patient)
const bookingExpired: WhatsAppTemplateFunction = (data) => ({
  templateName: 'booking_expired',
  variables: [
    data.patient_name || '',
    data.booking_ref || '',
    data.clinic_name || '',
    data.treatment_type || '',
    data.formatted_date || '',
  ],
  variableNames: [
    'patient_name',
    'booking_ref',
    'clinic_name',
    'treatment_type',
    'requested_date',
  ],
  buttons: [
    `https://orachope.org/clinics?treatment=${encodeURIComponent(data.treatment_type || '')}`,
    'https://wa.me/6581926158',
  ],
  buttonHasVariable: [true, false],
});

// Template 6: Urgent Clinic Nudge
const urgentClinicNudge: WhatsAppTemplateFunction = (data) => ({
  templateName: 'urgent_clinic_nudge_v7',
  variables: [
    data.clinic_name || '',
    data.booking_ref || '',
    data.expires_at || '',
    data.patient_name || '',
    data.treatment_type || '',
    data.time_slot || '',
  ],
  variableNames: [
    'clinic_name',
    'booking_ref',
    'expires_at',
    'patient_name',
    'treatment_type',
    'time_slot',
  ],
  buttons: [data.confirm_url || data.alternatives_url || data.reject_url || ''],
  buttonHasVariable: [true],
});

// Template 7: 24-Hour Reminder (Patient)
const appointmentReminder24h: WhatsAppTemplateFunction = (data) => ({
  templateName: 'appointment_reminder_24h',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.formatted_date || '',
    data.time_slot || '',
    `${data.clinic_address}, ${data.clinic_city}, ${data.clinic_state} ${data.clinic_postcode}, ${data.clinic_country}`.replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim(),
  ],
  variableNames: [
    'patient_name',
    'clinic_name',
    'appointment_date',
    'appointment_time',
    'clinic_address',
  ],
  buttons: [data.google_maps_query || '', data.cancel_ref_payload || data.booking_ref || ''],
  buttonHasVariable: [true, true],
});

// Template 8: Appointment Reschedule - 1 alternative slot
const appointmentReschedule1: WhatsAppTemplateFunction = (data) => ({
  templateName: 'appointment_reschedule_1',
  variables: [
    data.patient_name || '',
    data.clinic_name || '',
    data.original_date || '',
    data.original_time || '',
    data.slot1_details || data.alt_slot_details || '',
  ],
  variableNames: [
    'patient_name',
    'clinic_name',
    'original_date',
    'original_time',
    'alt_slot_details',
  ],
  buttons: [data.slot1_url || ''],
  buttonHasVariable: [true],
});

// Template 9: Alternative Accepted - Clinic Notification
const alternativeAcceptedClinic: WhatsAppTemplateFunction = (data) => ({
  templateName: 'alternative_accepted_clinic_v1',
  variables: [
    data.clinic_name || '',
    data.patient_name || '',
    data.booking_ref || '',
    data.confirmed_date || data.formatted_date || '',
    data.confirmed_time || data.time_slot || '',
    data.treatment_type || '',
    data.patient_whatsapp || '',
    data.patient_email || '',
  ],
  variableNames: [
    'clinic_name',
    'patient_name',
    'booking_ref',
    'confirmed_date',
    'confirmed_time',
    'treatment_type',
    'patient_whatsapp',
    'patient_email',
  ],
  buttons: [],
  buttonHasVariable: [],
});

// Export all templates
export const whatsappTemplates: Record<string, WhatsAppTemplateFunction> = {
  booking_request_received: bookingRequestReceived,
  booking_confirmation_patient: bookingConfirmationPatient,
  booking_alert_clinic: bookingAlertClinic,
  appointment_confirmed: appointmentConfirmed,
  alternatives_offered_1slot: alternativesOffered1Slot,
  alternatives_offered_2slot: alternativesOffered2Slot,
  alternatives_offered_3slot: alternativesOffered3Slot,
  booking_expired: bookingExpired,
  urgent_clinic_nudge: urgentClinicNudge,
  appointment_reminder_24h: appointmentReminder24h,
  appointment_reschedule_1: appointmentReschedule1,
  alternative_accepted_clinic: alternativeAcceptedClinic,
  // Aliases for compatibility
  confirmed: appointmentConfirmed,
  clinic_booking_confirmed: bookingAlertClinic,
  alternative_accepted: appointmentConfirmed,
  booking_rejected: bookingExpired,
};
