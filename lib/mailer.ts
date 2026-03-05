import { createTransport, Transporter } from 'nodemailer';

function getTransporter(): Transporter {
  const host = process.env.EMAIL_SERVER;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !user || !pass) throw new Error('Missing EMAIL_SERVER/EMAIL_USER/EMAIL_PASS env vars');
  const secure = Number(process.env.EMAIL_PORT || 0) === 465;
  return createTransport({ host, port, secure, auth: { user, pass } });
}

export async function sendMail(opts: { to: string; subject: string; text?: string; html?: string; from?: string }) {
  const transporter = getTransporter();
  const from = opts.from || process.env.EMAIL_FROM || process.env.EMAIL_USER;
  return transporter.sendMail({ from, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html });
}

export { getTransporter };
