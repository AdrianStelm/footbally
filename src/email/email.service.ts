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
                    user: testAccount.user,
                    pass: testAccount.pass,
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
            html: `<p>Click on link to reset password: <a href="${resetUrl}">${resetUrl}</a></p>`,
        });

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    async sendEmailChangeConfirmation(to: string, token: string) {
        const confirmUrl = `http://localhost:3000/confirm-email?token=${token}`;
        const info = await this.transporter.sendMail({
            from: '"Footbally" <no-reply@footbally.com>',
            to,
            subject: 'Confirm your new email',
            html: `<p>Click this link to confirm your new email: <a href="${confirmUrl}">${confirmUrl}</a></p>`,
        });

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

}
