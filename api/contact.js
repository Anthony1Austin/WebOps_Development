import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 'first-name': firstName, 'last-name': lastName, email, phone, 'project-type': projectType, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !projectType || !message) {
      return res.status(400).json({ error: 'All fields are required' });
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

    // Send email using Resend
    const { data, error } = await resend.emails.send({
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
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

