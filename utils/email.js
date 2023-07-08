const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        // user: 'a0dab81265c9d6',
        // pass: '18a96277724abe',
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    //1 render html based on pug
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstname: this.firstname,
        url: this.url,
        subject,
      }
    );
    //2email options
    const mailoptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html, { wordwrap: 1000 }),
    };
    //3 create a transport and send email

    await this.newTransport().sendMail(mailoptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours family');
  }
  async sendpasswordreset() {
    await this.send(
      'passwordreset',
      'Your password reset token(valid only for 11 min)'
    );
  }
};
// const sendEmail = async (options) => {
//   //Create a transporter

//   await transporter.sendMail(mailoptions);
// };
