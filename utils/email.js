const nodemailer = require('nodemailer');

const sendEmail = async(options) => {
    // Create a transporter

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Define the email options
    const mailOptions = {
        from: 'Unicodez <unicodez74@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        attachments: options.attachments
    };

    // Send the email

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;