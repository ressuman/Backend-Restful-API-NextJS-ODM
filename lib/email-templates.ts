// lib/email-templates.ts
export const getPasswordResetEmailTemplate = (
  resetUrl: string,
  email: string
) => {
  return {
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-top: 40px;
            margin-bottom: 40px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
          }
          .cta-container {
            text-align: center;
            margin: 40px 0;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s ease;
          }
          .reset-button:hover {
            transform: translateY(-2px);
          }
          .fallback-link {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .fallback-link p {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 10px;
          }
          .fallback-link code {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            word-break: break-all;
            display: block;
            color: #1e293b;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .warning-icon {
            color: #d97706;
            font-size: 18px;
            margin-right: 8px;
          }
          .warning-text {
            color: #92400e;
            font-size: 14px;
            font-weight: 500;
          }
          .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer p {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 8px;
          }
          .footer .email {
            font-weight: 600;
            color: #374151;
          }
          .security-notice {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .security-notice p {
            font-size: 14px;
            color: #1e40af;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>Secure password reset for your account</p>
          </div>

          <div class="content">
            <div class="greeting">Hello there!</div>

            <div class="message">
              <p>We received a request to reset the password for your account. If you made this request, click the button below to create a new password:</p>
            </div>

            <div class="cta-container">
              <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            </div>

            <div class="fallback-link">
              <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
              <code>${resetUrl}</code>
            </div>

            <div class="warning">
              <div style="display: flex; align-items: flex-start;">
                <span class="warning-icon">⏰</span>
                <div class="warning-text">
                  <strong>Time Sensitive:</strong> This password reset link will expire in 1 hour for your security.
                </div>
              </div>
            </div>

            <div class="security-notice">
              <p><strong>🛡️ Security Notice:</strong></p>
              <p>• If you didn't request this password reset, please ignore this email</p>
              <p>• Your current password remains unchanged until you create a new one</p>
              <p>• Never share password reset links with anyone</p>
            </div>

            <div class="message">
              <p>If you continue to have problems or didn't request this reset, please contact our support team.</p>
              <p style="margin-top: 20px;">Best regards,<br><strong>Your App Team</strong></p>
            </div>
          </div>

          <div class="footer">
            <p>This email was sent to <span class="email">${email}</span></p>
            <p>© 2024 Your App Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Request

Hello!

We received a request to reset the password for your account associated with ${email}.

If you made this request, click the link below to create a new password:
${resetUrl}

IMPORTANT: This link will expire in 1 hour for security reasons.

If the link doesn't work, copy and paste it into your browser address bar.

Security Notice:
- If you didn't request this password reset, please ignore this email
- Your current password remains unchanged until you create a new one
- Never share password reset links with anyone

If you continue to have problems or didn't request this reset, please contact our support team.

Best regards,
Your App Team

---
This email was sent to ${email}
© 2024 Your App Name. All rights reserved.
    `,
  };
};
