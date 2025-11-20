const sgMail = require('@sendgrid/mail');

// Email service for sending notifications
class EmailService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@prizeplatform.com';

    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('✅ SENDGRID_API_KEY detected, using SendGrid Web API');
    } else {
      console.log('⚠️  No SendGrid API key found. Emails will be logged to console only.');
    }
  }

  async sendWinnerNotification(user, prize) {
    const subject = `🎉 Congratulations! You've Won ${prize.title}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #1f2937; 
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
          }
          .email-wrapper { 
            background-color: #f3f4f6; 
            padding: 40px 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 800;
          }
          .header p {
            margin: 10px 0 0 0;
            font-size: 18px;
            opacity: 0.95;
          }
          .content { 
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .prize-box { 
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            padding: 25px; 
            margin: 25px 0; 
            border-radius: 12px; 
            border-left: 5px solid #ff6b35;
          }
          .prize-box h2 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 24px;
          }
          .prize-detail {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }
          .prize-detail:last-child {
            border-bottom: none;
          }
          .prize-detail strong {
            color: #6b7280;
            font-weight: 600;
          }
          .prize-value {
            font-size: 28px;
            font-weight: 800;
            color: #ff6b35;
          }
          .next-steps {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
          }
          .next-steps h3 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 18px;
          }
          .next-steps ol {
            margin: 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin: 8px 0;
            color: #4b5563;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(255, 107, 53, 0.3);
          }
          .footer { 
            text-align: center; 
            color: #9ca3af; 
            font-size: 13px; 
            padding: 30px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            margin: 5px 0;
          }
          .brand {
            font-weight: 800;
            color: #ff6b35;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <h1>🎉 CONGRATULATIONS! 🎉</h1>
              <p>You're a Winner at Total Raffle!</p>
            </div>
            <div class="content">
              <p class="greeting">Hi ${user.username},</p>
              
              <p style="font-size: 16px; color: #1f2937;">
                We have some <strong>fantastic news</strong> for you! You've won our prize draw and we couldn't be more excited to share this with you!
              </p>
              
              <div class="prize-box">
                <h2>${prize.title}</h2>
                <div class="prize-detail">
                  <strong>Prize Value:</strong>
                  <span class="prize-value">£${prize.value}</span>
                </div>
                <div class="prize-detail">
                  <strong>Prize Type:</strong>
                  <span style="text-transform: capitalize;">${prize.type}</span>
                </div>
                ${prize.description ? `<p style="margin: 15px 0 0 0; color: #4b5563;">${prize.description}</p>` : ''}
              </div>
              
              <div class="next-steps">
                <h3>📋 What Happens Next?</h3>
                <ol>
                  <li><strong>Check your dashboard</strong> - Your win is now visible in your account</li>
                  <li><strong>We'll contact you</strong> - Our team will reach out within 48 hours</li>
                  <li><strong>Provide details</strong> - We'll need your delivery/contact information</li>
                  <li><strong>Receive your prize</strong> - Sit back and wait for your amazing prize!</li>
                </ol>
              </div>
              
              <div class="button-container">
                <a href="${process.env.CLIENT_URL || 'https://www.totalraffle.co.uk'}/wins" class="button">
                  View My Wins
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Thank you for being part of <span class="brand">Total Raffle</span>. We hope you enjoy your prize!
              </p>
              
              <p style="margin-top: 25px;">
                Best regards,<br>
                <strong>The Total Raffle Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Total Raffle</strong> | www.totalraffle.co.uk</p>
              <p>This email was sent to ${user.email}</p>
              <p style="margin-top: 15px; font-size: 12px;">
                If you didn't enter this competition, please ignore this email or contact us at support@totalraffle.co.uk
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Congratulations ${user.username}!
      
      You've won: ${prize.title}
      Value: £${prize.value}
      
      Log in to your account to claim your prize: ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard
      
      We'll contact you within 48 hours with prize details.
      
      Best regards,
      The Prize Platform Team
    `;

    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.log('\n📧 WINNER EMAIL (Development Mode - no SENDGRID_API_KEY):');
        console.log('To:', user.email);
        console.log('Subject:', subject);
        console.log('Message:', text);
        console.log('---\n');
        return { success: true, messageId: 'console-log' };
      }

      const msg = {
        to: user.email,
        from: this.fromEmail,
        subject,
        text,
        html
      };

      const [response] = await sgMail.send(msg);
      console.log(`✅ Winner notification sent to ${user.email}`);
      return { success: true, messageId: response?.headers?.['x-message-id'] || 'sendgrid' };
    } catch (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPrizeDrawNotification(adminEmail, prize, winners) {
    const subject = `Prize Draw Complete: ${prize.title}`;
    
    const winnersList = winners.map(w => 
      `- ${w.user.username} (${w.user.email})`
    ).join('\n');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .winners { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Prize Draw Complete</h2>
          </div>
          <div class="content">
            <p><strong>Prize:</strong> ${prize.title}</p>
            <p><strong>Value:</strong> £${prize.value}</p>
            <p><strong>Winners Selected:</strong> ${winners.length}</p>
            
            <div class="winners">
              <h3>Winners:</h3>
              <pre>${winnersList}</pre>
            </div>
            
            <p>All winners have been notified via email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.log('\n📧 ADMIN DRAW EMAIL (Development Mode - no SENDGRID_API_KEY):');
        console.log('To:', adminEmail);
        console.log('Subject:', subject);
        console.log('HTML body omitted');
        console.log('---\n');
        return { success: true };
      }

      const msg = {
        to: adminEmail,
        from: this.fromEmail,
        subject,
        html
      };

      await sgMail.send(msg);
      console.log(`✅ Admin notification sent for prize: ${prize.title}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Admin email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendTestEmail(toEmail) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.log('\n📧 TEST EMAIL (Development Mode - no SENDGRID_API_KEY):');
        console.log('To:', toEmail);
        console.log('Subject: Test Email from Prize Platform');
        console.log('---\n');
        return { success: true, messageId: 'console-log' };
      }

      const msg = {
        to: toEmail,
        from: this.fromEmail,
        subject: 'Test Email from Prize Platform',
        text: 'This is a test email. If you received this, email service is working!',
        html: '<p>This is a test email. If you received this, email service is working!</p>'
      };

      const [response] = await sgMail.send(msg);
      console.log('✅ Test email sent successfully');
      return { success: true, messageId: response?.headers?.['x-message-id'] || 'sendgrid' };
    } catch (error) {
      console.error('❌ Test email error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
