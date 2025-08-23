module.exports = {
  // PG Booking Approved
  bookingApproved: ({ name, pgName, bookingId, pgAddress, bookingDate }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#2563eb;">PG Booking Approved</h2>
          <p>Dear ${name},</p>
          <p>Your booking for <strong>${pgName}</strong> has been <span style="color:green;font-weight:bold;">approved</span>!</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>PG Address:</strong> ${pgAddress}</p>
          <p><strong>Booking Date:</strong> ${bookingDate}</p>
          <p>Welcome to your new PG. Please check your dashboard for details.</p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // PG Booking Rejected
  bookingRejected: ({ name, pgName, reason, bookingId, pgAddress, bookingDate }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#dc2626;">PG Booking Rejected</h2>
          <p>Dear ${name},</p>
          <p>Your booking for <strong>${pgName}</strong> was <span style="color:red;font-weight:bold;">rejected</span>.</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>PG Address:</strong> ${pgAddress}</p>
          <p><strong>Booking Date:</strong> ${bookingDate}</p>
          <p>Reason: <span style="color:#dc2626;">${reason}</span></p>
          <p>Contact support if you have questions.</p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // Bike Booking Confirmation
  bikeBookingConfirmed: ({ name, bikeCompany, bikeModel, bookingId, startDate, endDate }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#2563eb;">Bike Booking Confirmed</h2>
          <p>Dear ${name},</p>
          <p>Your bike booking is <span style="color:green;font-weight:bold;">confirmed</span>!</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Bike:</strong> ${bikeCompany} ${bikeModel}</p>
          <p><strong>Start Date:</strong> ${startDate}</p>
          <p><strong>End Date:</strong> ${endDate}</p>
          <p>Enjoy your ride! Please check your dashboard for details.</p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // Bike Booking Cancelled
  bikeBookingCancelled: ({ name, bikeCompany, bikeModel, bookingId, startDate, endDate, reason }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#dc2626;">Bike Booking Cancelled</h2>
          <p>Dear ${name},</p>
          <p>Your bike booking has been <span style="color:red;font-weight:bold;">cancelled</span>.</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Bike:</strong> ${bikeCompany} ${bikeModel}</p>
          <p><strong>Start Date:</strong> ${startDate}</p>
          <p><strong>End Date:</strong> ${endDate}</p>
          <p>Reason: <span style="color:#dc2626;">${reason}</span></p>
          <p>Contact support if you have questions.</p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // Bike Booking Refund
  bikeBookingRefund: ({ name, bikeCompany, bikeModel, bookingId, amount, reason }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#22c55e;">Bike Booking Refund Processed</h2>
          <p>Dear ${name},</p>
          <p>Your refund for bike booking <strong>${bookingId}</strong> has been processed.</p>
          <p><strong>Bike:</strong> ${bikeCompany} ${bikeModel}</p>
          <p><strong>Refund Amount:</strong> ₹${amount}</p>
          <p>Reason: <span style="color:#22c55e;">${reason}</span></p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // Password Reset
  passwordReset: ({ name, email, role, otp, resetLink, lastPasswordUpdate }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#2563eb;">Password Reset Request</h2>
          <p>Dear ${name} (${role}),</p>
          <p>Your password reset request has been received for email: <strong>${email}</strong>.</p>
          <p><strong>Last Password Update:</strong> ${lastPasswordUpdate || 'Never'}</p>
          <p>Your OTP: <strong>${otp}</strong></p>
          <p>Or click this link to reset: <a href="${resetLink}">${resetLink}</a></p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // Password Changed
  passwordChanged: ({ name, email, role, lastPasswordUpdate }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#2563eb;">Password Changed Successfully</h2>
          <p>Dear ${name} (${role}),</p>
          <p>Your password for email <strong>${email}</strong> was changed on <strong>${lastPasswordUpdate}</strong>.</p>
          <p>If you did not perform this action, please contact support immediately.</p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // Owner Approval
  ownerApproval: ({ name, pgName, approvalDate }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#2563eb;">Owner Approval</h2>
          <p>Dear ${name},</p>
          <p>Your PG <strong>${pgName}</strong> was approved on <strong>${approvalDate}</strong>.</p>
          <p>Welcome to the platform!</p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // User Welcome
  userWelcome: ({ name, role, registerDate }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#2563eb;">Welcome to PG & Bike Rental System</h2>
          <p>Dear ${name} (${role}),</p>
          <p>Your account was created on <strong>${registerDate}</strong>.</p>
          <p>Enjoy our services and let us know if you need any help!</p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `,

  // Owner Welcome
  ownerWelcome: ({ name, registerDate }) => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f8fafc; color: #222;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:8px;box-shadow:0 2px 8px #e2e8f0;">
          <h2 style="color:#2563eb;">Welcome to PG & Bike Rental System</h2>
          <p>Dear ${name},</p>
          <p>Your owner account was created on <strong>${registerDate}</strong>.</p>
          <p>We're excited to have you onboard. Start listing your PGs and enjoy our platform!</p>
          <hr style="margin:24px 0;" />
          <p style="font-size:12px;color:#888;">PG & Bike Rental System</p>
        </div>
      </body>
    </html>
  `
};
