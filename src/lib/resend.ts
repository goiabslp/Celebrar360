import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Resend Mock] Email para ${to} - Assunto: ${subject}`);
    return { data: { id: 'mock-id' }, error: null };
  }

  try {
    const response = await resend.emails.send({
      from: 'Celebrar360 <suporte@celebrar360.com.br>',
      to: [to],
      subject,
      html,
    });
    return response;
  } catch (error) {
    console.error('Erro ao enviar e-mail via Resend:', error);
    return { data: null, error };
  }
}
