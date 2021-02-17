const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(
  "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"
);

const sendEmail = (email, name, type) => {
  sgMail.send({
    to: email,
    from: "marcakirk@gmail.com",
    subject:
      type === "signup"
        ? `Welcome to the platform ${name}`
        : `We are sorry to see you leave ${name}. Please come back soon!`,
    text:
      type === "signup"
        ? `Dummy data for ${name} signing up`
        : `Dummy data for ${name} leaving`,
  });
};

module.exports = sendEmail;
