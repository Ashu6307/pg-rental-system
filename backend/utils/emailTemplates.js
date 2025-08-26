// Professional Email Templates - Industry Standard
const createEmailTemplate = (content, headerColor = '#1f2937') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PG & Bike Rental System</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #374151; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, ${headerColor} 0%, #374151 100%); padding: 30px; text-align: center; color: white; }
        .logo { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 8px; }
        .tagline { font-size: 14px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .title { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
        .text { font-size: 16px; margin-bottom: 16px; color: #4b5563; }
        .highlight { color: ${headerColor}; font-weight: 600; }
        .success { color: #059669; font-weight: 600; }
        .danger { color: #dc2626; font-weight: 600; }
        .warning { color: #d97706; font-weight: 600; }
        .info-box { background: #f3f4f6; border-left: 4px solid ${headerColor}; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background: ${headerColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; transition: all 0.3s ease; }
        .button:hover { background: #374151; transform: translateY(-1px); }
        .otp-code { font-size: 32px; font-weight: 700; color: ${headerColor}; text-align: center; background: #f8fafc; padding: 20px; border-radius: 8px; letter-spacing: 4px; margin: 20px 0; border: 2px dashed ${headerColor}; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { font-size: 14px; color: #6b7280; margin-bottom: 10px; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #6b7280; text-decoration: none; margin: 0 10px; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); margin: 30px 0; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 8px; }
            .content { padding: 30px 20px; }
            .header { padding: 25px 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏠 PG & Bike Rental</div>
            <div class="tagline">Your Trusted Accommodation & Transportation Partner</div>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <div class="footer-text">
                <strong>PG & Bike Rental System</strong><br>
                Making accommodation and transportation easy & reliable
            </div>
            <div class="social-links">
                <a href="#">📧 Support</a> | 
                <a href="#">📱 Mobile App</a> | 
                <a href="#">🌐 Website</a>
            </div>
            <div class="footer-text" style="font-size: 12px; margin-top: 15px;">
                © 2025 PG & Bike Rental System. All rights reserved.<br>
                This email was sent to you as a registered user of our platform.
            </div>
        </div>
    </div>
</body>
</html>
`;

const emailTemplates = {
  // OTP Verification Template
  otpVerification: ({ name, email, role, otp, purpose = 'verification' }) => createEmailTemplate(`
    <div class="title">🔐 Email Verification Required</div>
    <div class="text">Hello <span class="highlight">${name || 'User'}</span>,</div>
    <div class="text">
        We received a request for ${purpose} for your <strong>${role}</strong> account associated with 
        <span class="highlight">${email}</span>.
    </div>
    
    <div class="info-box">
        <strong>🛡️ Security Notice:</strong> For your account security, please verify your email address using the OTP below.
    </div>
    
    <div class="otp-code">${otp}</div>
    
    <div class="text">
        ⏰ <strong>Important:</strong> This OTP is valid for <span class="warning">10 minutes</span> only.
    </div>
    
    <div class="text">
        If you didn't request this verification, please ignore this email or contact our support team immediately.
    </div>
    
    <div class="divider"></div>
    <div class="text" style="font-size: 14px; color: #6b7280;">
        <strong>Need Help?</strong> Contact our 24/7 support team for assistance.
    </div>
  `, '#3b82f6'),

  // Password Reset Template
  passwordReset: ({ name, email, role, otp }) => createEmailTemplate(`
    <div class="title">🔑 Password Reset Request</div>
    <div class="text">Hello <span class="highlight">${name || 'User'}</span>,</div>
    <div class="text">
        We received a password reset request for your <strong>${role}</strong> account 
        (<span class="highlight">${email}</span>).
    </div>
    
    <div class="info-box">
        <strong>🔒 Reset Instructions:</strong><br>
        1. Use the OTP below to verify your identity<br>
        2. Create a new secure password<br>
        3. Login with your new credentials
    </div>
    
    <div class="otp-code">${otp}</div>
    
    <div class="text">
        ⏰ This OTP expires in <span class="warning">10 minutes</span> for security reasons.
    </div>
    
    <div class="text">
        <strong>🛡️ Security Tip:</strong> If you didn't request this reset, please secure your account immediately and contact support.
    </div>
    
    <div class="divider"></div>
    <div class="text" style="font-size: 14px; color: #6b7280;">
        Remember to use a strong password with uppercase, lowercase, numbers, and special characters.
    </div>
  `, '#dc2626'),

  // Welcome Email Template
  userWelcome: ({ name, role, email }) => createEmailTemplate(`
    <div class="title">🎉 Welcome to PG & Bike Rental!</div>
    <div class="text">Dear <span class="highlight">${name}</span>,</div>
    <div class="text">
        Congratulations! Your <strong>${role}</strong> account has been successfully created.
    </div>
    
    <div class="info-box">
        <strong>📧 Account Details:</strong><br>
        Email: <span class="highlight">${email}</span><br>
        Role: <span class="highlight">${role.charAt(0).toUpperCase() + role.slice(1)}</span><br>
        Status: <span class="success">✅ Active</span>
    </div>
    
    <div class="text">
        🚀 <strong>What's Next?</strong>
    </div>
    <div class="text">
        ${role === 'user' ? 
          '• Browse available PGs and bikes<br>• Make your first booking<br>• Complete your profile' :
          role === 'owner' ? 
          '• List your PG properties<br>• Add bike rentals<br>• Manage bookings' :
          '• Access admin dashboard<br>• Manage users and owners<br>• Monitor platform activity'
        }
    </div>
    
    <a href="http://localhost:3000/${role}/login" class="button">
        🔗 Access Your Dashboard
    </a>
    
    <div class="divider"></div>
    <div class="text" style="font-size: 14px; color: #6b7280;">
        Questions? Our support team is here to help you get started!
    </div>
  `, '#059669'),

  // Booking Confirmation Templates
  bookingApproved: ({ name, pgName, bookingId, pgAddress, bookingDate }) => createEmailTemplate(`
    <div class="title">✅ PG Booking Approved!</div>
    <div class="text">Dear <span class="highlight">${name}</span>,</div>
    <div class="text">
        Great news! Your PG booking has been <span class="success">approved</span> by the owner.
    </div>
    
    <div class="info-box">
        <strong>📋 Booking Details:</strong><br>
        Booking ID: <span class="highlight">#${bookingId}</span><br>
        PG Name: <span class="highlight">${pgName}</span><br>
        Address: ${pgAddress}<br>
        Booking Date: <span class="highlight">${bookingDate}</span><br>
        Status: <span class="success">✅ Approved</span>
    </div>
    
    <div class="text">
        📱 <strong>Next Steps:</strong><br>
        • Save this confirmation email<br>
        • Contact the PG owner if needed<br>
        • Check your dashboard for updates
    </div>
    
    <a href="http://localhost:3000/user/my-bookings" class="button">
        📊 View Booking Details
    </a>
    
    <div class="divider"></div>
    <div class="text" style="font-size: 14px; color: #6b7280;">
        Have a wonderful stay! Rate your experience after check-out.
    </div>
  `, '#059669'),

  bookingRejected: ({ name, pgName, reason, bookingId, pgAddress, bookingDate }) => createEmailTemplate(`
    <div class="title">❌ Booking Update</div>
    <div class="text">Dear <span class="highlight">${name}</span>,</div>
    <div class="text">
        We regret to inform you that your PG booking has been <span class="danger">declined</span>.
    </div>
    
    <div class="info-box">
        <strong>📋 Booking Details:</strong><br>
        Booking ID: <span class="highlight">#${bookingId}</span><br>
        PG Name: <span class="highlight">${pgName}</span><br>
        Address: ${pgAddress}<br>
        Booking Date: <span class="highlight">${bookingDate}</span><br>
        Status: <span class="danger">❌ Declined</span><br>
        Reason: ${reason || 'Not specified'}
    </div>
    
    <div class="text">
        Don't worry! There are many other PG options available on our platform.
    </div>
    
    <a href="http://localhost:3000/pg" class="button">
        🔍 Browse Other PGs
    </a>
  `, '#dc2626'),

  bikeBookingConfirmed: ({ name, bikeCompany, bikeModel, bookingId, startDate, endDate }) => createEmailTemplate(`
    <div class="title">🏍️ Bike Booking Confirmed!</div>
    <div class="text">Dear <span class="highlight">${name}</span>,</div>
    <div class="text">
        Awesome! Your bike rental has been <span class="success">confirmed</span>.
    </div>
    
    <div class="info-box">
        <strong>🏍️ Rental Details:</strong><br>
        Booking ID: <span class="highlight">#${bookingId}</span><br>
        Bike: <span class="highlight">${bikeCompany} ${bikeModel}</span><br>
        Start: <span class="highlight">${startDate}</span><br>
        End: <span class="highlight">${endDate}</span><br>
        Status: <span class="success">✅ Confirmed</span>
    </div>
    
    <div class="text">
        🔑 <strong>Pickup Instructions:</strong><br>
        • Bring valid ID proof<br>
        • Arrive 15 minutes early<br>
        • Check bike condition before riding
    </div>
    
    <a href="http://localhost:3000/user/my-bookings" class="button">
        🗺️ View Booking Details
    </a>
    
    <div class="divider"></div>
    <div class="text" style="font-size: 14px; color: #6b7280;">
        Ride safe! Don't forget to return the bike on time.
    </div>
  `, '#3b82f6'),

  // Owner Notifications
  ownerApproval: ({ name, pgName, approvalDate }) => createEmailTemplate(`
    <div class="title">🎉 Owner Account Approved!</div>
    <div class="text">Dear <span class="highlight">${name}</span>,</div>
    <div class="text">
        Congratulations! Your owner account for <strong>${pgName}</strong> has been approved.
    </div>
    
    <div class="info-box">
        <strong>🏢 Business Details:</strong><br>
        Business Name: <span class="highlight">${pgName}</span><br>
        Approval Date: <span class="highlight">${approvalDate}</span><br>
        Status: <span class="success">✅ Approved</span>
    </div>
    
    <div class="text">
        🚀 <strong>Ready to Start Earning:</strong><br>
        • List your PG properties<br>
        • Add bike rentals<br>
        • Manage bookings & payments
    </div>
    
    <a href="http://localhost:3000/owner/dashboard" class="button">
        🏢 Access Owner Dashboard
    </a>
  `, '#059669'),

  // System Notifications
  passwordChanged: ({ name, email, role, lastPasswordUpdate }) => createEmailTemplate(`
    <div class="title">🔐 Password Changed Successfully</div>
    <div class="text">Dear <span class="highlight">${name}</span>,</div>
    <div class="text">
        Your account password has been successfully changed.
    </div>
    
    <div class="info-box">
        <strong>🔒 Security Details:</strong><br>
        Account: <span class="highlight">${email}</span><br>
        Role: <span class="highlight">${role}</span><br>
        Changed: <span class="highlight">${lastPasswordUpdate}</span><br>
        Status: <span class="success">✅ Secure</span>
    </div>
    
    <div class="text">
        <strong>⚠️ Security Alert:</strong> If you didn't make this change, please contact support immediately.
    </div>
    
    <a href="http://localhost:3000/contact" class="button">
        🆘 Contact Support
    </a>
  `, '#dc2626'),

  // Generic Notification Template
  notification: ({ name, title, message, actionText, actionUrl, type = 'info' }) => {
    const colors = {
      success: '#059669',
      error: '#dc2626', 
      warning: '#d97706',
      info: '#3b82f6'
    };
    
    return createEmailTemplate(`
      <div class="title">${title}</div>
      <div class="text">Dear <span class="highlight">${name}</span>,</div>
      <div class="text">${message}</div>
      
      ${actionText && actionUrl ? `
        <a href="${actionUrl}" class="button">
          ${actionText}
        </a>
      ` : ''}
    `, colors[type]);
  }
};

export default emailTemplates;
