/* eslint-disable @typescript-eslint/no-var-requires */
const brevo = require('@getbrevo/brevo');
const apiInstance = new brevo.TransactionalEmailsApi();

const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const dateToTime = (date) => {
  date = new Date(date);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  return `${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;
};

export const mailClient = (appointment) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  console.log(appointment);

  sendSmtpEmail.subject = 'Appointment Reminder';
  sendSmtpEmail.htmlContent =
    '<html><body><h1>Dear {{params.recipient}} Your appointment with Dr. {{params.doctor}} is by {{params.date}} today</h1></body></html>';
  sendSmtpEmail.sender = {
    name: 'Medical Center',
    email: 'orlhatundji@gmail.com',
  };
  sendSmtpEmail.to = [{ email: appointment.email, name: appointment.name }];
  // sendSmtpEmail.replyTo = {
  //   email: 'orlhatundji@gmail.com',
  //   name: 'Simon Olatunji',
  // };
  // sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
  sendSmtpEmail.params = {
    date: dateToTime(appointment.date),
    subject: 'Appointment Reminder',
    doctor: appointment.doctor,
    recipient: appointment.recipient,
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function () {
      console.log('Reminder sent successfully. Data: ');
    },
    function (error) {
      console.error(error);
    },
  );
};
