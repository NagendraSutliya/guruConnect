/**
 * Simulated SMS Service for sending OTPs.
 * In production, replace this with Twilio, MessageBird, or any SMS gateway.
 */

exports.sendSMS = async (phone, message) => {
  try {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`\n==========================================`);
    console.log(`[SMS SERVICE] Sending to: ${phone}`);
    console.log(`[SMS SERVICE] Message: ${message}`);
    console.log(`==========================================\n`);
    
    return { success: true };
  } catch (error) {
    console.error("[SMS SERVICE] Error:", error);
    throw new Error("Failed to send SMS");
  }
};

exports.sendOTP = async (phone, otp) => {
  const message = `Welcome to guruConnect! Your verification code is: ${otp}. Valid for 10 minutes.`;
  return exports.sendSMS(phone, message);
};
