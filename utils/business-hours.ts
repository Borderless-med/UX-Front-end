// ============================================
// BUSINESS HOURS UTILITY
// Calculates expiry time based on business hours (10 AM - 6 PM daily)
// Weekends are business days (97% of JB clinics operate on weekends)
// All calculations done in Singapore timezone (Asia/Singapore, UTC+8)
// ============================================

const BUSINESS_START_HOUR = 10; // 10 AM
const BUSINESS_END_HOUR = 18;   // 6 PM
const BUSINESS_HOURS_PER_DAY = BUSINESS_END_HOUR - BUSINESS_START_HOUR; // 8 hours
const SG_TIMEZONE_OFFSET = 8 * 60 * 60 * 1000; // UTC+8 in milliseconds

/**
 * Convert UTC date to Singapore timezone
 */
function toSingaporeTime(date: Date): Date {
  const utcTime = date.getTime();
  const sgTime = new Date(utcTime + SG_TIMEZONE_OFFSET);
  return sgTime;
}

/**
 * Get hour in Singapore timezone
 */
function getSingaporeHour(date: Date): number {
  const sgDate = toSingaporeTime(date);
  return sgDate.getUTCHours();
}

/**
 * Calculate expiry time by adding business hours to start time
 * All calculations done in Singapore timezone (UTC+8)
 * 
 * @param startTime - The start time (in UTC)
 * @param businessHoursToAdd - Number of business hours to add
 * @returns The expiry date/time (in UTC)
 */
export function calculateBusinessHoursExpiry(startTime: Date, businessHoursToAdd: number): Date {
  // Work in Singapore timezone throughout calculation
  const sgStartTime = toSingaporeTime(startTime);
  const result = new Date(sgStartTime);
  const currentHour = result.getUTCHours(); // Use UTC methods on SG-shifted time

  // If current time is outside business hours, move to next business day start
  if (currentHour < BUSINESS_START_HOUR) {
    // Before 10 AM - set to 10 AM same day
    result.setUTCHours(BUSINESS_START_HOUR, 0, 0, 0);
  } else if (currentHour >= BUSINESS_END_HOUR) {
    // After 6 PM - set to 10 AM next day
    result.setUTCDate(result.getUTCDate() + 1);
    result.setUTCHours(BUSINESS_START_HOUR, 0, 0, 0);
  }
  // else: within business hours, use current time

  // Convert business hours to milliseconds for precise calculation
  let millisecondsRemaining = businessHoursToAdd * 60 * 60 * 1000;

  while (millisecondsRemaining > 0) {
    // Calculate end of business day (in SG time)
    const endOfDay = new Date(result);
    endOfDay.setUTCHours(BUSINESS_END_HOUR, 0, 0, 0);

    // Time remaining until end of business day (in milliseconds)
    const msUntilEndOfDay = endOfDay.getTime() - result.getTime();

    if (msUntilEndOfDay <= 0) {
      // Already past business hours, move to next day
      result.setUTCDate(result.getUTCDate() + 1);
      result.setUTCHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }

    if (millisecondsRemaining <= msUntilEndOfDay) {
      // Can fit remaining time within today's business hours
      result.setTime(result.getTime() + millisecondsRemaining);
      millisecondsRemaining = 0;
    } else {
      // Need to roll over to next business day
      millisecondsRemaining -= msUntilEndOfDay;
      result.setUTCDate(result.getUTCDate() + 1);
      result.setUTCHours(BUSINESS_START_HOUR, 0, 0, 0);
    }
  }

  // Convert back to UTC for storage
  const utcResult = new Date(result.getTime() - SG_TIMEZONE_OFFSET);
  return utcResult;
}

/**
 * Format business hours expiry for email display
 * Displays time in Singapore timezone
 * 
 * @param expiryDate - The expiry Date object (in UTC)
 * @returns Formatted string in Singapore timezone (e.g., "1:00 PM, Thursday 12 June")
 */
export function formatExpiryTime(expiryDate: Date): string {
  // Convert to Singapore time for display
  const sgDate = toSingaporeTime(expiryDate);
  
  const timeStr = sgDate.toLocaleTimeString('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC', // Display as-is (already shifted to SG time)
  });

  const dateStr = sgDate.toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC', // Display as-is (already shifted to SG time)
  });

  return `${timeStr}, ${dateStr}`;
}
