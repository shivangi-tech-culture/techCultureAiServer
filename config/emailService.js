import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP,  
  port: 465, 
  secure: true,
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASS,    
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service configuration error:', error.message);
  } else {
    console.log('✓ Email service ready');
  }
});

// Optimized email sending function
export const sendEmail = async ({ sendTo, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"TechCulture AI" <${process.env.EMAIL}>`,
      to: sendTo,
      subject,
      text: text || 'New message from TechCulture AI',
      html: html || text,
      encoding: 'utf8'
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${sendTo} [ID: ${result.messageId}]`);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};