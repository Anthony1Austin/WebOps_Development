export const availability = {
  // Default available hours for each day
  defaultHours: {
    monday: { start: '08:00', end: '21:00' },
    tuesday: { start: '08:00', end: '21:00' },
    wednesday: { start: '08:00', end: '21:00' },
    thursday: { start: '08:00', end: '21:00' },
    friday: { start: '08:00', end: '21:00' },
    // Saturday and Sunday - no default hours (upon request only)
    saturday: null,
    sunday: null
  },
  
  // Time slot interval (30 minutes)
  timeSlotInterval: 30,
  
  // Blocked time ranges on specific days
  blockedTimeRanges: [
    // Block Wednesday and Thursday after 15:00
    { day: 'wednesday', start: '15:00', end: '21:00' },
    { day: 'thursday', start: '15:00', end: '21:00' }
  ],
  
  // Major holidays (US)
  blockedDates: [
    // 2024
    '2024-01-01',   // New Year's Day
    '2024-01-15',   // Martin Luther King Jr. Day
    '2024-02-19',   // Presidents' Day
    '2024-05-27',   // Memorial Day
    '2024-07-04',   // Independence Day
    '2024-09-02',   // Labor Day
    '2024-10-14',   // Columbus Day
    '2024-11-11',   // Veterans Day
    '2024-11-28',   // Thanksgiving
    '2024-12-25',   // Christmas
    
    // 2025
    '2025-01-01',   // New Year's Day
    '2025-01-20',   // Martin Luther King Jr. Day
    '2025-02-17',   // Presidents' Day
    '2025-05-26',   // Memorial Day
    '2025-07-04',   // Independence Day
    '2025-09-01',   // Labor Day
    '2025-10-13',   // Columbus Day
    '2025-11-11',   // Veterans Day
    '2025-11-27',   // Thanksgiving
    '2025-12-25'    // Christmas
  ],
  
  // Days in advance to show
  daysAhead: 30,
  
  // Maximum appointments per day before blocking 08:00-18:00
  maxAppointmentsBeforeBlock: 3,
  
  // Time range to block when max appointments reached
  blockTimeRange: { start: '08:00', end: '18:00' }
};

