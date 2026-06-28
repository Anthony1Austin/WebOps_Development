import { Resend } from 'resend';
import { rateLimitContact } from '../lib/rate-limit.js';

const resend = new Resend(process.env.RESEND_API_KEY);

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) {
    return xff.split(',')[0].trim();
  }
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string') return real.trim();
  return 'unknown';
}

async function verifyTurnstileToken(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return false;
  }
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token || '');
  if (remoteip && remoteip !== 'unknown') {
    body.set('remoteip', remoteip);
  }
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await r.json();
  return data.success === true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.error('TURNSTILE_SECRET_KEY is not set');
    return res.status(503).json({ error: 'Contact form is temporarily unavailable.' });
  }

  const clientIp = getClientIp(req);

  try {
    const rate = await rateLimitContact(clientIp);
    if (!rate.success) {
      const retryAfter =
        typeof rate.reset === 'number' && rate.reset > 0
          ? Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000))
          : 900;
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({ error: 'Too many submissions. Please try again later.' });
    }
  } catch (e) {
    console.error('Rate limit error (allowing request):', e);
  }

  try {
    const {
      'first-name': firstName,
      'last-name': lastName,
      email,
      phone,
      website: honeypotWebsite,
      'project-type': projectType,
      'appointment-date': appointmentDate,
      'appointment-time': appointmentTime,
      message,
      'cf-turnstile-response': turnstileToken,
    } = req.body;

    // Honeypot: bots often fill this; respond success without sending mail
    if (honeypotWebsite != null && String(honeypotWebsite).trim() !== '') {
      return res.status(200).json({ success: true });
    }

    const turnstileOk = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileOk) {
      return res.status(400).json({ error: 'Verification failed. Please refresh the page and try again.' });
    }

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
        day: 'numeric',
      });

      const [hours, minutes] = appointmentTime.split(':');
      const hour = parseInt(hours, 10);
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
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers.host || process.env.VERCEL_URL || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;

        const response = await fetch(`${baseUrl}/api/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: appointmentDate, time: appointmentTime }),
        });

        if (!response.ok) {
          console.warn('Failed to store appointment, but continuing...');
        }
      } catch (error) {
        console.error('Failed to store appointment:', error);
      }
    }

    return res.status(200).json({ success: true, data: businessEmail.data });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
