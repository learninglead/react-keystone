import { createTransport } from 'nodemailer';

const transport = createTransport({
  // @ts-ignore
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
export interface Envelope {
  from: string;
  to?: string[] | null;
}

function mailTemplate(text: string): string {
  return `
        <div style="border: 1px solod black; pading: 20px; font-family: sans-serif; line-height: 2;font-size: 20px">
            <h2>Hello There!</h2>
            <p>${text}</p>
            <p>Sick Fits</p>
        </div>
    `;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  const info = (await transport.sendMail({
    to,
    from: 'np-reply@sickfits.com',
    subject: 'Your Password Reset Token is here!',
    html: mailTemplate(`Your Password Reset Token is here!
        
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Click here to reset!</a>
        `),
  })) as MailResponse;
}

export default {};
