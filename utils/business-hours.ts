// ============================================
// BUSINESS HOURS UTILITY
// Calculates expiry time based on business hours (10 AM - 6 PM daily)
// Weekends are business days (97% of JB clinics operate on weekends)
// ============================================

const BUSINESS_START_HOUR = 10; // 10 AM
const BUSINESS_END_HOUR = 18;   // 6 PM
const BUSINESS_HOURS_PER_DAY = BUSINESS_END_HOUR - BUSINESS_START_HOUR; // 8 hours

/**
 * Calculate expiry time based on business hours
 * @param startTime - Starting timestamp
 * @param businessHoursToAdd - Number of business hours to add (e.g., 3)
 * @returns Date object with calculated expiry time
 * 
 * Examples:
 * - 2 PM booking + 3 hours = 5 PM same day
 * - 5 PM booking + 3 hours = 12 PM next day (skips 6 PM - 10 AM)
 * - 9 PM booking + 3 hours = 1 PM next day (moves to 10 AM, then +3 hours)
 */
export function calculateBusinessHoursExpiry(
  startTime: Date,
  businessHoursToAdd: number
): Date {
  const result = new Date(startTime);
  const currentHour = result.getHours();

  // If current time is outside business hours, move to next business day start
  if (currentHour < BUSINESS_START_HOUR) {
    // Before 10 AM - set to 10 AM same day
    result.setHours(BUSINESS_START_HOUR, 0, 0, 0);
  } else if (currentHour >= BUSINESS_END_HOUR) {
    // After 6 PM - set to 10 AM next day
    result.setDate(result.getDate() + 1);
    result.setHours(BUSINESS_START_HOUR, 0, 0, 0);
  }
  // else: within business hours, use current time

  // Convert business hours to milliseconds for precise calculation
  let millisecondsRemaining = businessHoursToAdd * 60 * 60 * 1000;

  while (millisecondsRemaining > 0) {
    // Calculate end of business day
    const endOfDay = new Date(result);
    endOfDay.setHours(BUSINESS_END_HOUR, 0, 0, 0);

    // Time remaining until end of business day (in milliseconds)
    const msUntilEndOfDay = endOfDay.getTime() - result.getTime();

    if (msUntilEndOfDay <= 0) {
      // Already past business hours, move to next day
      result.setDate(result.getDate() + 1);
      result.setHours(BUSINESS_START_HOUR, 0, 0, 0);
      continue;
    }

    if (millisecondsRemaining <= msUntilEndOfDay) {
      // Can fit remaining time within today's business hours
      result.setTime(result.getTime() + millisecondsRemaining);
      millisecondsRemaining = 0;
    } else {
      // Need to roll over to next business day
      millisecondsRemaining -= msUntilEndOfDay;
      result.setDate(result.getDate() + 1);
      result.setHours(BUSINESS_START_HOUR, 0, 0, 0);
    }
  }

  return result;
}

/**
 * Format business hours expiry for email display
 * @param expiryDate - The expiry Date object
 * @returns Formatted string (e.g., "1:00 PM, Thursday 12 June")
 */
export function formatExpiryTime(expiryDate: Date): string {
  const timeStr = expiryDate.toLocaleTimeString('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const dateStr = expiryDate.toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return `${timeStr}, ${dateStr}`;
}
