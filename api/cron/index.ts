// ============================================
// UNIFIED CRON JOB HANDLER
// Routes to different cron jobs based on 'job' query parameter
// Consolidates multiple serverless functions to stay under Vercel limit
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import individual job handlers from lib/cron directory
// (lib directory is outside api/, so these won't be deployed as separate serverless functions)
import checkExpiredBookingsHandler from '../../lib/cron/check-expired-bookings.js';
import sendAppointmentRemindersHandler from '../../lib/cron/send-appointment-reminders.js';
import sendUrgentNudgesHandler from '../../lib/cron/send-urgent-nudges.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Get the job type from query parameter
  const job = req.query.job as string;

  // Route to appropriate job handler
  switch (job) {
    case 'check-expired-bookings':
      return checkExpiredBookingsHandler(req, res);
    
    case 'send-appointment-reminders':
      return sendAppointmentRemindersHandler(req, res);
    
    case 'send-urgent-nudges':
      return sendUrgentNudgesHandler(req, res);
    
    default:
      return res.status(400).json({
        error: 'Invalid job parameter',
        message: 'Use ?job=check-expired-bookings, ?job=send-appointment-reminders, or ?job=send-urgent-nudges',
      });
  }
}
