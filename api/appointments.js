// Simple in-memory store (for demo - consider Vercel KV for production)
// In production, use Vercel KV or a database for persistence
let appointmentsStore = [];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get appointments for a date range
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    const filtered = appointmentsStore.filter(apt => {
      return apt.date >= startDate && apt.date <= endDate;
    });
    
    return res.status(200).json({ appointments: filtered });
  }
  
  if (req.method === 'POST') {
    // Store a new appointment
    const { date, time } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({ error: 'date and time are required' });
    }
    
    const appointment = {
      id: Date.now().toString(),
      date,
      time,
      createdAt: new Date().toISOString()
    };
    
    appointmentsStore.push(appointment);
    
    return res.status(200).json({ success: true, appointment });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}




