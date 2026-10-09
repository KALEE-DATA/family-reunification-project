// Notifications System using EmailJS HTTP API
async function sendReunificationAlert(caseData) {
  const { caseId, reporterEmail, missingPerson, foundPerson, matchDetails } = caseData;

  console.log(`[NOTIFY] Initiating EmailJS notification for Case ${caseId}`);

  if (reporterEmail && reporterEmail.includes('@')) {
    try {
      console.log(`[NOTIFY] Sending text alert to ${reporterEmail}...`);
      
      const emailText = `URGENT: Verified Match Found

Dear Family Member,

We have incredible news. A verified match has been confirmed for your reported missing person.

DETAILS:
- Name of Missing Person: ${missingPerson.person_name}
- Name of Found Person: ${foundPerson.name_if_known || 'Unknown'}
- Found Location: ${foundPerson.location_name || 'N/A'}
- Relief Facility/Camp: ${foundPerson.org_name || 'N/A'}

Please log in to the FAMILYLINK-AI portal immediately to download the full official PDF report and contact the authorities at the facility mentioned above to coordinate reunification.

Stay safe,
FAMILYLINK-AI Team`;

      const payload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: reporterEmail,
          content: emailText
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('[NOTIFY] Text Email sent successfully via EmailJS!');
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
