const nodemailer = require('nodemailer');

// Nodemailer Config (Email)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

async function sendReunificationAlert(caseData) {
  const { personName, reporterName, reporterEmail, caseId } = caseData;

  console.log(`[NOTIFY] Initiating Email notification for Case ${caseId}`);

  if (reporterEmail && reporterEmail.includes('@')) {
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log(`[NOTIFY] Sending live Email to ${reporterEmail}...`);
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
        console.log('[NOTIFY] Email sent successfully!');
      } else {
        console.log(`[SIMULATED EMAIL] To ${reporterEmail}: URGENT: Verified Match Found...`);
        console.log('[NOTIFY] To send real Emails, add EMAIL_USER and EMAIL_PASS to Render Environment Variables.');
      }
    } catch (err) {
      console.error('[NOTIFY Error] Email failed:', err.message);
    }
  } else {
    console.log('[NOTIFY] No valid email provided. Skipping.');
  }
}

module.exports = { sendReunificationAlert };
