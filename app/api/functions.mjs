import nodemailer from "nodemailer"
import "dotenv/config"

export const sendEmail = (email, firstName, subject, html) => {

    return new Promise(async (resolve, reject) => {

        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: process.env.NODE_MAILER_EMAIL,
                    pass: process.env.NODE_MAILER_PASSWORD
                }
            });

            const mail = await transporter.sendMail({
                from: `"Abdul Ahad" <${process.env.NODE_MAILER_EMAIL}>`,
                to: `${email}`,
                subject: subject,
                text: `Hello ${firstName}`,
                html: html,
            });

            await transporter.sendMail(mail);
            resolve();

        } catch (error) {
            console.error(error);
            reject({
                message: 'error',
            });
        }

    })
}