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
  | 'booking_confirmation_patient'
  | 'booking_alert_clinic'
  | 'appointment_confirmed'
  | 'alternatives_offered'
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
          const whatsappResult = await this.sendWhatsApp(type, recipient, data);
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
    recipient: NotificationRecipient,
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

    const { templateName, variables, buttons } = template(data);

    // WhatsApp Business API integration
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!whatsappToken || !whatsappPhoneNumberId) {
      throw new Error('WhatsApp credentials not configured');
    }

    // Format phone number (remove non-digits except +)
    const formattedPhone = recipient.whatsapp.replace(/[^\d+]/g, '');

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
            parameters: variables.map((value) => ({
              type: 'text',
              text: value,
            })),
          },
        ],
      },
    };

    // Add buttons if present
    if (buttons && buttons.length > 0) {
      payload.template.components.push({
        type: 'button',
        sub_type: 'url',
        index: 0,
        parameters: buttons.map((url) => ({
          type: 'text',
          text: url,
        })),
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
      console.log(`WhatsApp sent to ${recipient.whatsapp}`);
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
