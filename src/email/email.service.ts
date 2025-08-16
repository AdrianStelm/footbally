import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        nodemailer.createTestAccount().then((testAccount) => {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user, // логін акаунта
                    pass: testAccount.pass, // пароль акаунта
                },
            });
            console.log('Ethereal test account:', testAccount);
        });
    }

    async sendResetEmail(to: string, token: string) {
        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
        const info = await this.transporter.sendMail({
            from: '"Footbally" <no-reply@footbally.com>',
            to,
            subject: 'Password Reset',
            html: `<p>Щоб скинути пароль, перейдіть за посиланням: <a href="${resetUrl}">${resetUrl}</a></p>`,
        });

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
}
