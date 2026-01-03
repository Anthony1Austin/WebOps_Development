import { availability } from './availability.js';

// Cache for appointments
let appointmentsCache = null;
let cacheDate = null;

/**
 * Get day name from date
 */
function getDayName(date) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

/**
 * Check if date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date) {
  const dayName = getDayName(date);
  return dayName === 'saturday' || dayName === 'sunday';
}

/**
 * Fetch scheduled appointments for a date range
 */
async function getScheduledAppointments(startDate, endDate) {
  const today = new Date().toISOString().split('T')[0];
  
  // Use cache if same day
  if (appointmentsCache && cacheDate === today) {
    return appointmentsCache;
  }
  
  try {
    const response = await fetch(`/api/appointments?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    appointmentsCache = data.appointments || [];
    cacheDate = today;
    return appointmentsCache;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

/**
 * Get appointments for a specific date
 */
async function getAppointmentsForDate(date) {
  const dateString = date.toISOString().split('T')[0];
  const appointments = await getScheduledAppointments(dateString, dateString);
  return appointments.filter(apt => apt.date === dateString);
}

/**
 * Generate time slots for a given time range
 */
function generateTimeSlots(start, end, interval) {
  const slots = [];
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeString);
    
    currentMin += interval;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }
  
  return slots;
}

/**
 * Check if a time range is blocked
 */
function isTimeBlocked(date, time) {
  const dayName = getDayName(date);
  const dateString = date.toISOString().split('T')[0];
  
  // Check if entire date is blocked
  if (availability.blockedDates.includes(dateString)) {
    return true;
  }
  
  // Check blocked time ranges
  for (const block of availability.blockedTimeRanges) {
    // Check day-based blocks
    if (block.day && block.day === dayName) {
      if (!block.available && time >= block.start && time < block.end) {
        return true;
      }
    }
    
    // Check date-specific blocks
    if (block.date && block.date === dateString) {
      if (!block.available && time >= block.start && time < block.end) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get available time slots for a specific date
 */
export async function getAvailableTimeSlots(date) {
  const dayName = getDayName(date);
  const defaultHours = availability.defaultHours[dayName];
  
  if (!defaultHours) {
    return []; // No default hours for this day (Sat/Sun)
  }
  
  // Generate all time slots for the day
  const allSlots = generateTimeSlots(
    defaultHours.start,
    defaultHours.end,
    availability.timeSlotInterval
  );
  
  // Filter out blocked times
  let availableSlots = allSlots.filter(time => !isTimeBlocked(date, time));
  
  // Check appointment-based blocking (3+ appointments rule)
  const appointments = await getAppointmentsForDate(date);
  if (appointments.length >= availability.maxAppointmentsBeforeBlock) {
    const blockRange = availability.blockTimeRange;
    const scheduledTimes = appointments.map(apt => apt.time);
    
    availableSlots = availableSlots.filter(time => {
      // If time is in block range (08:00-18:00)
      if (time >= blockRange.start && time < blockRange.end) {
        // Only allow if it's a scheduled appointment time
        return scheduledTimes.includes(time);
      }
      // Times outside block range (18:00-21:00) are still available
      return true;
    });
  }
  
  return availableSlots;
}

/**
 * Get available dates (next N days with available slots)
 */
export async function getAvailableDates() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 1; i <= availability.daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const slots = await getAvailableTimeSlots(date);
    if (slots.length > 0) {
      dates.push(date);
    }
  }
  
  return dates;
}

/**
 * Format date for display
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format time for display
 */
export function formatTime(time) {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

