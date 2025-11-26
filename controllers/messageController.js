import messageModel from "../models/messageModel.js";
import { sendEmail } from "../config/emailService.js";

// Helper function to create professional email templates
const createEmailTemplate = ({ name, phone, email, message }) => {
  const timestamp = new Date().toLocaleString('en-US', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const subject = `New Inquiry: ${name} - TechCulture AI`;
  
  const text = `TechCulture AI - New Contact Inquiry\n\nFrom: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}\n\nReceived: ${timestamp}`;
  
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 600;">New Contact Inquiry</h1>
          <p style="color: #6b7280; margin: 8px 0 0; font-size: 14px;">TechCulture AI</p>
        </div>
        
        <!-- Contact Info -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin: 0 0 15px; font-size: 16px; font-weight: 600;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 500; width: 70px;">Name:</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Phone:</td>
              <td style="padding: 6px 0; color: #111827;"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Email:</td>
              <td style="padding: 6px 0; color: #111827;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
          </table>
        </div>
        
        <!-- Message -->
        <div style="background: #eff6ff; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb;">
          <h3 style="color: #374151; margin: 0 0 12px; font-size: 16px; font-weight: 600;">Message</h3>
          <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Received on ${timestamp}</p>
        </div>
        
      </div>
    </div>
  `;
  
  return { subject, text, html };
};

// Create new message
export const createMessage = async (req, res) => {
  const { name, phone, email, message } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!name?.trim()) missingFields.push('name');
  if (!phone?.trim()) missingFields.push('phone');
  if (!message?.trim()) missingFields.push('message');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields
    });
  }

  try {
    // Create and save message to database
    const newMessage = await messageModel.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      message: message.trim(),
    });

    // Send email notification if email is provided
    if (email && email.trim()) {
      try {
        const { subject, text, html } = createEmailTemplate({ name, phone, email, message });
        await sendEmail({
          sendTo: "marketing@techculture.ai",
          subject,
          text,
          html,
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError.message);
        // Continue execution - don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Your message has been received successfully. We'll get back to you soon!",
      data: {
        id: newMessage._id,
        name: newMessage.name,
        phone: newMessage.phone,
        email: newMessage.email,
        message: newMessage.message,
        timestamp: newMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Message creation failed:', error);
    res.status(500).json({
      success: false,
      error: "Unable to process your message at this time. Please try again or contact us directly.",
      code: 'MESSAGE_CREATION_FAILED'
    });
  }
};

// Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch messages"
    });
  }
};