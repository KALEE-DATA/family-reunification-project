// Fast2SMS API Integration for purely SMS-based alerts in India
// No SDK required, uses native fetch

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || '';

async function sendReunificationAlert(caseData) {
  const { personName, reporterPhone, caseId } = caseData;
  const messageText = `FAMILYLINK ALERT: A verified match was found for missing person: ${personName} (Case: ${caseId}). Log in or contact authorities.`;

  console.log(`[NOTIFY] Initiating SMS notification for Case ${caseId}`);

  if (!reporterPhone || reporterPhone.length < 10) {
    console.log('[NOTIFY] No valid phone number provided. Skipping SMS.');
    return;
  }

  // Extract the 10-digit number (Fast2SMS expects just the 10 digits without +91)
  let cleanPhone = reporterPhone.replace(/\D/g, ''); // Remove non-digits
  if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
    cleanPhone = cleanPhone.slice(2);
  }

  if (FAST2SMS_API_KEY) {
    try {
      console.log(`[NOTIFY] Sending live SMS via Fast2SMS to ${cleanPhone}...`);
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q', // Quick SMS route
          message: messageText,
          language: 'english',
          flash: 0,
          numbers: cleanPhone
        })
      });

      const data = await response.json();
      if (data.return) {
        console.log('[NOTIFY] SMS sent successfully via Fast2SMS!');
      } else {
        console.error('[NOTIFY Error] Fast2SMS rejected request:', data.message);
      }
    } catch (err) {
      console.error('[NOTIFY Error] SMS fetch failed:', err.message);
    }
  } else {
    console.log(`[SIMULATED SMS] To ${cleanPhone}: ${messageText}`);
    console.log('[NOTIFY] To send real SMS, add FAST2SMS_API_KEY to Render Environment Variables.');
  }
}

module.exports = { sendReunificationAlert };
