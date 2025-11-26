import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import nodemailer from 'nodemailer';

// Configure the SMTP transporter
 const transporter = nodemailer.createTransport({
      host: process.env.SMTP,  
      port: 465, 
      secure: true, 
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASS,    
      },
    });
// Function to send email
async function sendEmail({sendTo, subject, text, html}) {
  try {
   

    transporter.verify((error, success) => {
      if (error) {
        console.error('Transporter config error:', error);
      } else {
        console.log('Email transporter is ready to send messages');
      }
    });
   
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: sendTo, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export {sendEmail};