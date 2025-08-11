// Singapore public holidays for 2025 to block in date picker
export const singaporeHolidays2025 = [
  new Date('2025-01-01'), // New Year's Day
  new Date('2025-01-29'), // Chinese New Year Day 1
  new Date('2025-01-30'), // Chinese New Year Day 2
  new Date('2025-04-18'), // Good Friday
  new Date('2025-04-30'), // Hari Raya Puasa (estimated)
  new Date('2025-08-09'), // National Day
  new Date('2025-07-07'), // Hari Raya Haji (estimated)
  new Date('2025-10-20'), // Deepavali (estimated)
  new Date('2025-12-25'), // Christmas Day
];

// Helper function to check if a date is a Singapore holiday
export const isSingaporeHoliday = (date: Date): boolean => {
  return singaporeHolidays2025.some(holiday => 
    holiday.getTime() === date.getTime()
  );
};

// Helper function to check if a date is a weekend
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

// Helper function to check if a date should be disabled in date picker
export const isDateDisabled = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  // Disable if: past date, more than 30 days away, weekend, or holiday
  return date < today || 
         date > thirtyDaysFromNow || 
         isWeekend(date) || 
         isSingaporeHoliday(date);
};