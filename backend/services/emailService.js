const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendPasswordResetEmail = async (
  email,
  resetToken
) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  const resetLink =
    `${frontendUrl}/reset-password/${resetToken}`;

  const { data, error } =
    await resend.emails.send({
      // Resend test sender for local development
      from: "CareerTrack SA <onboarding@resend.dev>",

      to: email,

      subject: "Reset your CareerTrack SA password",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          color: #0f172a;
        ">

          <h2>
            Reset your password
          </h2>

          <p>
            We received a request to reset the
            password for your CareerTrack SA account.
          </p>

          <p>
            Click the button below to choose a new
            password.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetLink}"
              style="
                background: #2563eb;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                text-decoration: none;
                display: inline-block;
                font-weight: 600;
              "
            >
              Reset password
            </a>
          </div>

          <p style="color: #64748b;">
            This link expires in 15 minutes.
          </p>

          <p style="color: #64748b;">
            If you didn't request a password reset,
            you can ignore this email.
          </p>

          <hr
            style="
              border: 0;
              border-top: 1px solid #e2e8f0;
              margin: 30px 0;
            "
          />

          <p
            style="
              font-size: 12px;
              color: #94a3b8;
            "
          >
            CareerTrack SA
          </p>

        </div>
      `,
    });

  if (error) {
    throw new Error(
      error.message ||
      "Failed to send password reset email."
    );
  }

  return data;
};

module.exports = {
  sendPasswordResetEmail,
};