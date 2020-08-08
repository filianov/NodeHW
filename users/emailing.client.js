
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function verificationEmail(email, verificationLink) {
    try {
        const resultEmail = await sgMail.send({
            to: email,
            from: process.env.SENDGRID_EMAIL,
            subject: "Verify your email",
            html: `<a href="${verificationLink}">Verification link</a>`,
        })
        console.log('resultEmail', resultEmail);
    } catch (err) { next(err); };
};

module.exports = { verificationEmail };