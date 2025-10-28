const nodemailer = require('nodemailer');

// Email service for sending notifications
class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@prizeplatform.com';
    this.setupTransporter();
  }

  setupTransporter() {
    // Check if SendGrid API key is available
    if (process.env.SENDGRID_API_KEY) {
      // SendGrid configuration
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    } else {
      // Development mode - log emails to console
      console.log('⚠️  No SendGrid API key found. Emails will be logged to console.');
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    }
  }

  async sendWinnerNotification(user, prize) {
    const subject = `🎉 Congratulations! You've won ${prize.title}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .prize-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 YOU'RE A WINNER! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${user.username},</p>
            
            <p>Fantastic news! You've won our prize draw!</p>
            
            <div class="prize-box">
              <h2>${prize.title}</h2>
              <p><strong>Value:</strong> £${prize.value}</p>
              <p><strong>Type:</strong> ${prize.type}</p>
              <p>${prize.description}</p>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ol>
              <li>Log in to your account to claim your prize</li>
              <li>We'll contact you within 48 hours with prize details</li>
              <li>Provide your delivery/contact information</li>
              <li>Receive your prize!</li>
            </ol>
            
            <center>
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="button">
                Claim Your Prize
              </a>
            </center>
            
            <p>Congratulations again, and thank you for participating!</p>
            
            <p>Best regards,<br>The Prize Platform Team</p>
            
            <div class="footer">
              <p>This email was sent to ${user.email}</p>
              <p>If you didn't enter this competition, please ignore this email.</p>
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
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to: user.email,
        subject: subject,
        text: text,
        html: html
      });

      if (process.env.SENDGRID_API_KEY) {
        console.log(`✅ Winner notification sent to ${user.email}`);
      } else {
        console.log('\n📧 WINNER EMAIL (Development Mode):');
        console.log('To:', user.email);
        console.log('Subject:', subject);
        console.log('Message:', text);
        console.log('---\n');
      }

      return { success: true, messageId: info.messageId };
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
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: adminEmail,
        subject: subject,
        html: html
      });

      console.log(`✅ Admin notification sent for prize: ${prize.title}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Admin email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendTestEmail(toEmail) {
    try {
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to: toEmail,
        subject: 'Test Email from Prize Platform',
        text: 'This is a test email. If you received this, email service is working!',
        html: '<p>This is a test email. If you received this, email service is working!</p>'
      });

      console.log('✅ Test email sent successfully');
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Test email error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
