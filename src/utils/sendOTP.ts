import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: parseInt(process.env.MAIL_PORT as string, 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});
 

export const sendOtp = async (email: string, otp: string) => {
    return transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. This code is valid for 10 minutes.`,
    });
};
