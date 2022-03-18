const {TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,SERVICE_ID} = process.env;
const twilio = require("twilio")(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);

/**
 * Send OTP via email or sms.
 *
 * @param {("email"|"sms")} via - which channel used to send opt.
 * @param {string} to If channel is email then its an email address else its phone number.
 * @returns {{ sent: boolean, issue: string }} A object with property 'sent' and 'issue'. Note: if sent = true then issue = undefined
 */
 async function sendOtpVia(to, via = "sms", ) {
	try {
		const otpSend = await twilio.verify.services(SERVICE_ID).verifications.create({ to, channel: via });

		if (otpSend.status === "pending") {
			return { sent: true };
		} else {
			return { sent:false};//false
		}
	} catch (error) {
		return { sent: false, issue: error.message };
	}
}

/**
 * Verify OTP
 *
 * @param {!string} to where this code was found?
 * @param {!string} code what is the code?
 * @returns {boolean} If verify success then true otherwise false.
 */
async function verifyOtp(to, otp) {
	try {
		const checkedResult = await twilio.verify.services(SERVICE_ID).verificationChecks.create({ to, code: otp.toString() });
		if (checkedResult && checkedResult.status === "approved") {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}
module.exports = {sendOtpVia,verifyOtp}