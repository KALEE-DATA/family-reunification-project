const twilio = require('twilio');
const nodemailer = require('nodemailer');

// Twilio Config (SMS & WhatsApp)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'dummy_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'dummy_token';
const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
const twilioWhatsapp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
const twilioClient = twilio(accountSid, authToken);

// Nodemailer Config (Email)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dummy@gmail.com',
    pass: process.env.EMAIL_PASS || 'dummy_password'
  }
});

async function sendReunificationAlert(caseData) {
  const { personName, reporterName, reporterPhone, reporterEmail, caseId } = caseData;
  const messageText = `FAMILYLINK-AI ALERT: A verified match has been found for your reported missing person, ${personName} (Case ID: ${caseId}). Please log in to your dashboard or contact authorities immediately.`;

  console.log(`[NOTIFY] Initiating notifications for Case ${caseId}`);

  // 1. Send SMS
  if (reporterPhone && reporterPhone.length > 5) {
    try {
      if (accountSid !== 'dummy_sid') {
        await twilioClient.messages.create({
          body: messageText,
          from: twilioPhone,
          to: reporterPhone.startsWith('+') ? reporterPhone : '+91' + reporterPhone
        });
        console.log('[NOTIFY] SMS sent successfully.');
      } else {
        console.log(`[SIMULATED SMS] To ${reporterPhone}: ${messageText}`);
      }
    } catch (err) {
      console.error('[NOTIFY Error] SMS failed:', err.message);
    }

    // 2. Send WhatsApp
    try {
      if (accountSid !== 'dummy_sid') {
        await twilioClient.messages.create({
          body: messageText,
          from: twilioWhatsapp,
          to: 'whatsapp:' + (reporterPhone.startsWith('+') ? reporterPhone : '+91' + reporterPhone)
        });
        console.log('[NOTIFY] WhatsApp sent successfully.');
      } else {
        console.log(`[SIMULATED WHATSAPP] To ${reporterPhone}: ${messageText}`);
      }
    } catch (err) {
      console.error('[NOTIFY Error] WhatsApp failed:', err.message);
    }
  }

  // 3. Send Email
  if (reporterEmail && reporterEmail.includes('@')) {
    try {
      if (process.env.EMAIL_USER) {
        await transporter.sendMail({
          from: `"FAMILYLINK-AI" <${process.env.EMAIL_USER}>`,
          to: reporterEmail,
          subject: 'URGENT: Verified Match Found - FAMILYLINK-AI',
          html: `
            <h2>FAMILYLINK-AI Alert</h2>
            <p>Dear ${reporterName || 'Family Member'},</p>
            <p>A verified match has been found for your reported missing person, <strong>${personName}</strong> (Case ID: ${caseId}).</p>
            <p>Please log in to your FAMILYLINK-AI dashboard or contact the local relief authorities immediately to coordinate reunification.</p>
            <br/>
            <p>Stay safe,<br/>The FAMILYLINK-AI Team</p>
          `
        });
        console.log('[NOTIFY] Email sent successfully.');
      } else {
        console.log(`[SIMULATED EMAIL] To ${reporterEmail}: URGENT: Verified Match Found...`);
      }
    } catch (err) {
      console.error('[NOTIFY Error] Email failed:', err.message);
    }
  }
}

module.exports = { sendReunificationAlert };
