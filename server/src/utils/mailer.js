const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendVerificationCode = async (email, code) => {
  try {
    const data = await resend.emails.send({
      from: "GuruConnect <onboarding@resend.dev>", // VERIFIED DOMAIN
      to: email,
      subject: "Verify your GuruConnect account",
      html: `
        <div style="font-family:Arial">
          <h2>Your Verification Code</h2>
          <h1 style="letter-spacing:3px">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    console.log("Verification mail sent:", data.id);
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Email service failed");
  }
};
