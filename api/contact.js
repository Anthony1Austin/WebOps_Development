import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      'first-name': firstName, 
      'last-name': lastName, 
      email, 
      phone, 
      'project-type': projectType, 
      'appointment-date': appointmentDate,
      'appointment-time': appointmentTime,
      message 
    } = req.body;

    // Validate required fields (appointment is optional)
    if (!firstName || !lastName || !email || !phone || !projectType || !message) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // Validate phone format (basic validation)
    const phonePattern = /^[0-9+\-().\s]+$/;
    if (!phonePattern.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const fullName = `${firstName} ${lastName}`;
    
    // Format appointment date/time (if provided)
    let formattedDate = '';
    let formattedTime = '';
    
    if (appointmentDate && appointmentTime) {
      const appointmentDateObj = new Date(appointmentDate);
      formattedDate = appointmentDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const [hours, minutes] = appointmentTime.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      formattedTime = `${displayHour}:${minutes} ${ampm}`;
    }

    // Send email to business
    const businessEmail = await resend.emails.send({
      from: 'WebOps Development <info@webopsdevelopment.com>',
      to: ['info@webopsdevelopment.com'],
      subject: `New Contact Form Submission - ${projectType}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Preferred Appointment:</strong> ${appointmentDate && appointmentTime ? `${formattedDate} at ${formattedTime}` : 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (businessEmail.error) {
      console.error('Resend error (business):', businessEmail.error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Send confirmation email to prospect
    const confirmationEmail = await resend.emails.send({
      from: 'WebOps Development <info@webopsdevelopment.com>',
      to: [email],
      subject: 'Thank You for Contacting WebOps Development',
      html: `
        <h2>Thank You for Reaching Out!</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for contacting WebOps Development. We've received your inquiry and are excited to discuss your ${projectType} project.</p>
        ${appointmentDate && appointmentTime ? `
        <p><strong>Your Appointment Request:</strong></p>
        <p>Date: ${formattedDate}<br>
        Time: ${formattedTime}</p>
        <p>We will contact you at ${phone} or ${email} to confirm this appointment time and discuss your project needs.</p>
        ` : `
        <p>We will contact you at ${phone} or ${email} to discuss your project needs and schedule a convenient time to talk.</p>
        `}
        <p>If you need to reschedule or have any questions, please don't hesitate to reach out to us at info@webopsdevelopment.com or call us at (330) 737-1139.</p>
        <p>We look forward to speaking with you!</p>
        <p>Best regards,<br>
        WebOps Development LLC</p>
      `,
    });

    if (confirmationEmail.error) {
      console.error('Resend error (confirmation):', confirmationEmail.error);
      // Don't fail the request if confirmation email fails
    }

    // Store the appointment (if provided)
    if (appointmentDate && appointmentTime) {
      try {
        // Determine the base URL for the API call
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers.host || process.env.VERCEL_URL || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;
        
        // Store appointment via API
        const response = await fetch(`${baseUrl}/api/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: appointmentDate, time: appointmentTime })
        });
        
        if (!response.ok) {
          console.warn('Failed to store appointment, but continuing...');
        }
      } catch (error) {
        console.error('Failed to store appointment:', error);
        // Don't fail the request if appointment storage fails
      }
    }

    return res.status(200).json({ success: true, data: businessEmail.data });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

