// Notifications System using EmailJS HTTP API (Bypasses Render SMTP Block)

async function sendReunificationAlert(caseData) {
  const { personName, reporterName, reporterEmail, caseId } = caseData;

  console.log(`[NOTIFY] Initiating EmailJS notification for Case ${caseId}`);

  if (reporterEmail && reporterEmail.includes('@')) {
    try {
      console.log(`[NOTIFY] Sending live Email to ${reporterEmail} via EmailJS...`);
      
      const payload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: reporterEmail,
          person_name: personName,
          case_id: caseId
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('[NOTIFY] Email sent successfully via EmailJS!');
      } else {
        const text = await response.text();
        console.error('[NOTIFY Error] EmailJS failed:', text);
      }
    } catch (err) {
      console.error('[NOTIFY Error] EmailJS network request failed:', err.message);
    }
  } else {
    console.log('[NOTIFY] No valid email provided. Skipping.');
  }
}

module.exports = { sendReunificationAlert };
