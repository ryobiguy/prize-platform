const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  try {
    console.log('🔧 Testing SendGrid Email...\n');
    
    // Check if API key is loaded
    if (!process.env.SENDGRID_API_KEY) {
      console.log('❌ SENDGRID_API_KEY not found in environment variables');
      process.exit(1);
    }
    
    console.log('✅ SendGrid API Key found');
    console.log(`✅ From Email: ${process.env.SENDGRID_FROM_EMAIL}\n`);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });

    // Test email
    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL || 'ryanryobi@gmail.com',
      to: 'ryanryobi@gmail.com',
      subject: '🎉 Test Email from Total Raffle',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6C63FF;">🎉 Congratulations!</h1>
          <p>This is a test email from your Total Raffle platform.</p>
          <p>If you're reading this, <strong>email notifications are working perfectly!</strong></p>
          <hr>
          <p style="color: #666; font-size: 14px;">This is a test email from Total Raffle Prize Platform</p>
        </div>
      `
    };

    console.log('📧 Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✅ Email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📧 Check your inbox: ryanryobi@gmail.com\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error sending email:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

testEmail();
