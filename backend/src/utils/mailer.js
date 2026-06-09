const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendWelcomeEmail = async (email, fullName) => {
  const mailOptions = {
    from: `"${process.env.SCHOOL_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Welcome to ${process.env.SCHOOL_NAME}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Welcome to ${process.env.SCHOOL_NAME}</h2>
        <p>Hello ${fullName},</p>
        <p>Thank you for registering with us! Your account has been created successfully.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4a90e2;">
          <p style="margin: 0;"><strong>Status:</strong> Awaiting Admin Approval</p>
        </div>
        <p>Our team is currently reviewing your registration documents. You will receive another email once your account is approved and you can start your learning journey.</p>
        <p>In the meantime, feel free to explore our website and learn more about our upcoming webinars.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          &copy; ${new Date().getFullYear()} ${process.env.SCHOOL_NAME}. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

exports.sendApprovalEmail = async (email, fullName) => {
  const mailOptions = {
    from: `"${process.env.SCHOOL_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Your Account Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #28a745; text-align: center;">Account Approved!</h2>
        <p>Hello ${fullName},</p>
        <p>Great news! Your account at <strong>${process.env.SCHOOL_NAME}</strong> has been approved by our administrators.</p>
        <p>You can now log in to access your student dashboard, view course materials, and start your lessons.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/index.html" target="_blank" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Go to Student Dashboard
          </a>
        </div>
        <p>We are excited to have you with us!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          &copy; ${new Date().getFullYear()} ${process.env.SCHOOL_NAME}. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Approval Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
};

exports.sendResetCode = async (email, code) => {
  const mailOptions = {
    from: `"${process.env.SCHOOL_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Your Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your account at <strong>${process.env.SCHOOL_NAME}</strong>. Please use the following 6-digit code to reset your password:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; color: #333;">
          ${code}
        </div>
        <p>This code will expire in 1 hour. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          &copy; ${new Date().getFullYear()} ${process.env.SCHOOL_NAME}. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset code email');
  }
};

exports.sendTeamsLink = async (email, eventName, teamsLink) => {
  const mailOptions = {
    from: `"${process.env.SCHOOL_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Meeting Link for ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">MS Teams Meeting Link</h2>
        <p>Hello,</p>
        <p>Thank you for registering for the <strong>${eventName}</strong> webinar.</p>
        <p>Below is your Microsoft Teams meeting link to join the event:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${teamsLink}" target="_blank" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Join Meeting on MS Teams
          </a>
        </div>
        <p>Alternatively, you can copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #4a90e2;">${teamsLink}</p>
        <p>We look forward to seeing you there!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          &copy; ${new Date().getFullYear()} ${process.env.SCHOOL_NAME}. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
  console.error('Error sending email:', error);
  throw new Error(`Failed to send teams link email to ${email}`);
  }
  };

  exports.sendSupportScheduleEmail = async (email, details) => {
  const { studentName, moduleName, lessonName, meetingLink, scheduledAt } = details;
  const formattedDate = new Date(scheduledAt).toLocaleString('en-ZA', { 
  dateStyle: 'full', 
  timeStyle: 'short' 
  });

  const mailOptions = {
  from: `"${process.env.SCHOOL_NAME}" <${process.env.EMAIL_FROM}>`,
  to: email,
  subject: `Support Session Scheduled: ${moduleName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="color: #333; text-align: center;">Support Session Scheduled</h2>
      <p>Hello ${studentName},</p>
      <p>An instructor has scheduled a live support session for you.</p>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Module:</strong> ${moduleName}</p>
        <p><strong>Lesson:</strong> ${lessonName}</p>
        <p><strong>Date & Time:</strong> ${formattedDate}</p>
      </div>

      <p>You can join the session using the MS Teams link below:</p>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${meetingLink}" target="_blank" style="background-color: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Join MS Teams Session
        </a>
      </div>

      <p>Alternatively, use this URL: <br>
      <span style="word-break: break-all; color: #007AFF;">${meetingLink}</span></p>

      <p>Please make sure to be online a few minutes before the session starts.</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">
        &copy; ${new Date().getFullYear()} ${process.env.SCHOOL_NAME}. All rights reserved.
      </p>
    </div>
  `,
  };

  try {
  const info = await transporter.sendMail(mailOptions);
  console.log('Support Schedule Email sent: %s', info.messageId);
  return info;
  } catch (error) {
  console.error('Error sending support schedule email:', error);
  // Don't throw here to avoid failing the whole request if email fails, 
  // but log it so we know.
  }
  };

exports.sendAdminSupportRequestEmail = async (adminEmail, details) => {
  const { studentName, moduleName, lessonName, details: requestDetails } = details;

  const mailOptions = {
    from: `"${process.env.SCHOOL_NAME}" <${process.env.EMAIL_FROM}>`,
    to: adminEmail,
    subject: `New Support Request from ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">New Support Request</h2>
        <p>A student has requested a live support session.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Student:</strong> ${studentName}</p>
          <p><strong>Module:</strong> ${moduleName}</p>
          <p><strong>Lesson:</strong> ${lessonName}</p>
          <p><strong>Details:</strong> ${requestDetails}</p>
        </div>

        <p>Please log in to the admin dashboard to schedule this session.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          &copy; ${new Date().getFullYear()} ${process.env.SCHOOL_NAME}. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin Support Notification Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending admin support notification email:', error);
  }
};
