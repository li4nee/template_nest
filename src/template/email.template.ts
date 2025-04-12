import { globalSettings } from "src/config/settings.config"

export const emailTemplate = {

    verifyEmail: (url:string,token: string) => {
        return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #2c3e50;
    }

    .content {
      font-size: 16px;
      line-height: 1.6;
      color: #555;
    }

    .verification-link {
      display: inline-block;
      padding: 12px 25px;
      background-color: #3498db;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
    }

    .verification-link:hover {
      background-color: #2980b9;
    }

    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h2>Email Verification</h2>
    <div class="content">
      <p>Hi there,</p>
      <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
      <p><a href="${url}?token=${token}" class="verification-link">Verify Email</a></p>
      <p>You have 60 minutes to verify your email.</p>
    </div>
    <div class="footer">
      <p>If you did not create an account, please ignore this email.</p>
      <p>Best regards,</p>
      <p>Your Team</p>
    </div>
  </div>
</body>
</html>
`
    }
}