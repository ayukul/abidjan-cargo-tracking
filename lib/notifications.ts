/**
 * WhatsApp Notification Service
 * This service is structured to support both Twilio and Meta WhatsApp Cloud API
 * Currently logs to console for development/testing
 */

interface WhatsAppNotificationPayload {
  phoneNumber: string;
  customerName: string;
  trackingCode: string;
  status: string;
}

/**
 * Send WhatsApp notification to customer
 * @param payload - Customer and shipment information
 * @returns Promise resolving to success/failure status
 */
export async function sendWhatsAppNotification(
  payload: WhatsAppNotificationPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { phoneNumber, customerName, trackingCode, status } = payload;

  try {
    // Format message in French
    const message = `Bonjour ${customerName}, votre colis ${trackingCode} est maintenant: ${status}. Merci.`;

    // Log message for development
    console.log('📱 WhatsApp Notification:');
    console.log(`  To: ${phoneNumber}`);
    console.log(`  Message: ${message}`);
    console.log(`  Timestamp: ${new Date().toISOString()}`);

    // TODO: Implement actual WhatsApp integration
    // Option 1: Twilio WhatsApp API
    // const response = await sendViaTwilio(phoneNumber, message);

    // Option 2: Meta WhatsApp Cloud API
    // const response = await sendViaMetaWhatsApp(phoneNumber, message);

    // For now, return success (in production, replace with actual API call)
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error) {
    console.error('❌ Failed to send WhatsApp notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Twilio WhatsApp Integration (for future use)
 * Uncomment and install twilio package when ready
 */
/*
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

async function sendViaTwilio(phoneNumber: string, message: string) {
  if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error('Twilio credentials not configured');
  }

  const client = twilio(accountSid, authToken);

  const result = await client.messages.create({
    from: `whatsapp:${twilioPhoneNumber}`,
    to: `whatsapp:${phoneNumber}`,
    body: message,
  });

  return {
    success: true,
    messageId: result.sid,
  };
}
*/

/**
 * Meta WhatsApp Cloud API Integration (for future use)
 * Uncomment and configure when ready
 */
/*
async function sendViaMetaWhatsApp(phoneNumber: string, message: string) {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

  if (!apiKey || !phoneNumberId || !businessAccountId) {
    throw new Error('Meta WhatsApp Cloud API credentials not configured');
  }

  const response = await fetch(
    `https://graph.instagram.com/v17.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Meta WhatsApp API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.messages[0].id,
  };
}
*/
