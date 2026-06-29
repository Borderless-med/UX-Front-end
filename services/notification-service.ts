// ============================================
// UNIFIED NOTIFICATION SERVICE
// Handles both Email and WhatsApp notifications
// Support for future channels (SMS, etc.)
// ============================================

import { createClient } from '@supabase/supabase-js';
import { emailTemplates } from '../templates/email-templates.js';
import { whatsappTemplates } from '../templates/whatsapp-templates.js';

// Notification types
export type NotificationType =
  | 'booking_request_received'
  | 'booking_confirmation_patient'
  | 'booking_alert_clinic'
  | 'appointment_confirmed'
  | 'alternatives_offered'  // Deprecated - use specific slot count templates
  | 'alternatives_offered_1slot'
  | 'alternatives_offered_2slot'
  | 'alternatives_offered_3slot'
  | 'booking_expired'
  | 'urgent_clinic_nudge'
  | 'appointment_reminder_24h'
  | 'confirmed'
  | 'clinic_booking_confirmed'
  | 'alternative_accepted'
  | 'booking_rejected';

// Channel types
export type NotificationChannel = 'email' | 'whatsapp';

// Notification recipient
export interface NotificationRecipient {
  name: string;
  email?: string;
  whatsapp?: string;
}

// Notification data (template variables)
export interface NotificationData {
  booking_ref?: string;
  patient_name?: string;
  patient_email?: string;
  patient_whatsapp?: string;
  clinic_name?: string;
  clinic_address?: string;
  clinic_city?: string;
  clinic_state?: string;
  clinic_postcode?: string;
  clinic_country?: string;
  treatment_type?: string;
  formatted_date?: string;
  time_slot?: string;
  expires_at?: string;
  alternative_slots?: string;
  original_date?: string;
  original_time?: string;
  travel_guide_url?: string;
  google_maps_url?: string;
  clinic_card_url?: string;
  cancel_url?: string;
  confirm_url?: string;
  reject_url?: string;
  alternatives_url?: string;
  [key: string]: any;
}

// Notification result
export interface NotificationResult {
  channel: NotificationChannel;
  success: boolean;
  sent_at: string;
  error?: string;
}

// Main Notification Service Class
export class NotificationService {
  private supabase: any;
  private whatsappEnabled: boolean;
  private smtpUser: string;

  private getFirstButtonBaseSegment(templateName: string): string | null {
    const urlTemplates: Record<string, string> = {
      alternatives_offered_2slot: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
      alternatives_offered_2slot_v2: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
      alternatives_offered_2slot_v4: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
      alternatives_offered_3slot: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
      alternatives_offered_3slot_v3: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
      alternatives_offered_3slot_v5: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
      appointment_confirmed: 'https://www.orachope.org/api/cancel-appointment?token={{1}}',
      appointment_confirmed_v9: 'https://www.orachope.org/api/cancel-appointment?token={{1}}',
      appointment_confirmation_v3: 'https://www.orachope.org/api/cancel-appointment?token={{1}}',
      appointment_confirmation_1: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
      urgent_clinic_nudge: 'https://www.orachope.org/api/clinic/respond/{{1}}',
      urgent_clinic_nudge_v5: 'https://www.orachope.org/api/clinic/respond/{{1}}',
      urgent_clinic_nudge_v7: 'https://www.orachope.org/api/clinic/respond/{{1}}',
      booking_alert_clinic: 'https://www.orachope.org/api/clinic/respond/{{1}}',
      booking_alert_clinic_v5: 'https://www.orachope.org/api/clinic/respond/{{1}}',
      booking_alert_clinic_v7: 'https://www.orachope.org/api/clinic/respond/{{1}}',
    };

    const templateUrl = urlTemplates[templateName];
    if (!templateUrl || !templateUrl.includes('{{1}}')) {
      return null;
    }

    return templateUrl.split('{{1}}')[0];
  }

  private normalizeWhatsAppButtonValue(templateName: string, buttonValue: string): string {
    const value = (buttonValue || '').trim();
    if (!value) {
      return value;
    }

    const basePrefix = this.getFirstButtonBaseSegment(templateName);

    if (basePrefix?.includes('/api/clinic/respond/')) {
      // For clinic templates we send only the suffix: BOOKING_REF?action=...&token=...
      const marker = '/api/clinic/respond/';
      const markerIndex = value.indexOf(marker);
      if (markerIndex >= 0) {
        return value.slice(markerIndex + marker.length);
      }

      if (/^[A-Z0-9-]+\?action=/.test(value)) {
        return value;
      }
    }

    if (basePrefix?.includes('/api/patient/booking-response?token=') || basePrefix?.includes('/api/cancel-appointment?token=')) {
      // For patient templates we send a stuffed query string into the token variable.
      // Example output: action=accept&ref=APT-123&slot=...&token=abc
      if (!value.includes('://') && value.includes('=')) {
        return value.replace(/^\?/, '');
      }

      try {
        const parsed = new URL(value);
        return parsed.search.replace(/^\?/, '');
      } catch {
        return value;
      }
    }

    return value;
  }

  constructor(config: {
    supabaseUrl: string;
    supabaseKey: string;
    whatsappEnabled?: boolean;
    smtpUser: string;
  }) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    this.whatsappEnabled = config.whatsappEnabled || false;
    this.smtpUser = config.smtpUser;
  }

  /**
   * Send notification via specified channels
   */
  async send(
    type: NotificationType,
    recipient: NotificationRecipient,
    data: NotificationData,
    channels: NotificationChannel[] = ['email']
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    // Send via each requested channel
    for (const channel of channels) {
      try {
        if (channel === 'email' && recipient.email) {
          const emailResult = await this.sendEmail(type, recipient, data);
          results.push(emailResult);
        } else if (channel === 'whatsapp' && recipient.whatsapp) {
          const whatsappResult = await this.sendWhatsApp(type, recipient.whatsapp, data);
          results.push(whatsappResult);
        }
      } catch (error) {
        console.error(`Failed to send ${channel} notification:`, error);
        results.push({
          channel,
          success: false,
          sent_at: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Send email notification
   */
  private async sendEmail(
    type: NotificationType,
    recipient: NotificationRecipient,
    data: NotificationData
  ): Promise<NotificationResult> {
    const template = emailTemplates[type];
    if (!template) {
      throw new Error(`Email template not found for type: ${type}`);
    }

    const { subject, html } = template(data);

    // Try SMTP2GO first, fallback to Brevo
    const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (smtp2goApiKey) {
      const response = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: smtp2goApiKey,
          to: [recipient.email],
          sender: this.smtpUser,
          subject,
          html_body: html,
        }),
      });

      if (response.ok) {
        console.log(`Email sent via SMTP2GO to ${recipient.email}`);
        return {
          channel: 'email',
          success: true,
          sent_at: new Date().toISOString(),
        };
      }
    }

    if (brevoApiKey) {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify({
          sender: { email: this.smtpUser, name: 'OraChope.org' },
          to: [{ email: recipient.email }],
          subject,
          htmlContent: html,
        }),
      });

      if (response.ok) {
        console.log(`Email sent via Brevo to ${recipient.email}`);
        return {
          channel: 'email',
          success: true,
          sent_at: new Date().toISOString(),
        };
      }
    }

    throw new Error('Failed to send email via all providers');
  }

  /**
   * Send WhatsApp notification
   */
  private async sendWhatsApp(
    type: NotificationType,
    whatsappNumber: string,
    data: NotificationData
  ): Promise<NotificationResult> {
    if (!this.whatsappEnabled) {
      console.log('WhatsApp disabled, skipping...');
      return {
        channel: 'whatsapp',
        success: false,
        sent_at: new Date().toISOString(),
        error: 'WhatsApp not enabled',
      };
    }

    const template = whatsappTemplates[type];
    if (!template) {
      throw new Error(`WhatsApp template not found for type: ${type}`);
    }

    const { templateName, variables, variableNames, buttons, buttonHasVariable } = template(data);

    // WhatsApp Business API integration
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!whatsappToken || !whatsappPhoneNumberId) {
      throw new Error('WhatsApp credentials not configured');
    }

    // Format phone number (remove non-digits except +)
    const formattedPhone = whatsappNumber.replace(/[^\d+]/g, '');

    const payload: any = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: variables.map((value, index) => {
              const parameter: Record<string, string> = {
                type: 'text',
                text: value,
              };

              if (variableNames?.[index]) {
                parameter.parameter_name = variableNames[index];
              }

              return parameter;
            }),
          },
        ],
      },
    };

    // Add buttons if present
    if (buttons && buttons.length > 0) {
      buttons.forEach((buttonValue, index) => {
        if (buttonHasVariable?.[index] === false) {
          return;
        }

        payload.template.components.push({
          type: 'button',
          sub_type: 'url',
          index,
          parameters: [
            {
              type: 'text',
              text: this.normalizeWhatsAppButtonValue(templateName, buttonValue),
            },
          ],
        });
      });
    }

    const response = await fetch(
      `https://graph.facebook.com/v17.0/${whatsappPhoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      console.log(`WhatsApp sent to ${whatsappNumber}`);
      return {
        channel: 'whatsapp',
        success: true,
        sent_at: new Date().toISOString(),
      };
    }

    const errorData = await response.json();
    throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`);
  }

  /**
   * Log notification in database
   */
  async logNotification(
    bookingRef: string,
    type: NotificationType,
    results: NotificationResult[]
  ): Promise<void> {
    try {
      const { data: booking } = await this.supabase
        .from('appointment_bookings')
        .select('notifications_sent')
        .eq('booking_ref', bookingRef)
        .single();

      if (!booking) {
        console.error(`Booking not found: ${bookingRef}`);
        return;
      }

      const existingNotifications = booking.notifications_sent || [];
      const newNotification = {
        type,
        sent_at: new Date().toISOString(),
        channels: results,
      };

      await this.supabase
        .from('appointment_bookings')
        .update({
          notifications_sent: [...existingNotifications, newNotification],
        })
        .eq('booking_ref', bookingRef);

      console.log(`Logged notification for booking ${bookingRef}`);
    } catch (error) {
      console.error('Failed to log notification:', error);
    }
  }
}
