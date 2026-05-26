import * as React from "react";

interface VerificationEmailProps {
  confirmLink: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  confirmLink,
}) => {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
      <h2 style={{ color: "#4F46E5" }}>Confirm your email</h2>
      <p>Thank you for registering. Please confirm your email by clicking the link below:</p>
      <a
        href={confirmLink}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#4F46E5",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        Verify Email
      </a>
      <p style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        If you did not request this email, you can safely ignore it.
      </p>
    </div>
  );
};

export default VerificationEmail;
