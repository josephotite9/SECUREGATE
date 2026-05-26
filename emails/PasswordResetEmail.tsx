import * as React from "react";

interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail: React.FC<Readonly<PasswordResetEmailProps>> = ({
  resetLink,
}) => {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
      <h2 style={{ color: "#4F46E5" }}>Reset your password</h2>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <a
        href={resetLink}
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
        Reset Password
      </a>
      <p style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  );
};

export default PasswordResetEmail;
