import nodemailer from "nodemailer";

export default {
  async send(options) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    return transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  },
};
