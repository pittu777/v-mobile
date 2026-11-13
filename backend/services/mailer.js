const nodemailer = require('nodemailer');

/**
 * Transactional mail.
 *
 * Development default: if no SMTP_* vars are set, messages are logged to the
 * console instead of being sent, and `isConsoleFallback()` tells callers to
 * hand the link back in the API response so the flow can be completed without
 * a mail provider. Configure SMTP for real delivery.
 */
const hasSmtpConfig = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

/**
 * Whether the caller must hand the link back in the API response because no
 * mail transport is configured.
 *
 * A fresh deployment without SMTP would otherwise fail every signup outright
 * (throwing on the missing transport), which is worse than degrading: the user
 * gets their account and the link, and a boot warning says why.
 */
const isConsoleFallback = () => !hasSmtpConfig();

const buildTransport = () => {
  if (hasSmtpConfig()) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return null;
};

const getFrom = () =>
  process.env.MAIL_FROM || 'MyMobileApp <no-reply@mymobileapp.local>';

const sendHtml = async ({ to, subject, html, text }) => {
  const transport = buildTransport();

  if (!transport) {
    // No SMTP configured: log instead of sending. This is the supported
    // development path, and the console-fallback used on an unconfigured
    // deployment.
    console.log(`[mail:dev] to=${to} subject="${subject}"`);
    if (text) console.log(`[mail:dev] ${text}`);
    return { delivered: false, transport: 'console' };
  }

  await transport.sendMail({ from: getFrom(), to, subject, html, text });
  return { delivered: true, transport: 'smtp' };
};

const layout = (heading, bodyHtml) => `
  <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#09090B">
    <h1 style="font-size:20px;font-weight:600;margin:0 0 16px">${heading}</h1>
    ${bodyHtml}
    <p style="font-size:12px;color:#71717A;margin-top:24px">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
`;

const sendVerificationEmail = async ({ to, name, url, expiresInLabel }) => {
  const subject = 'Verify your email address';
  const text =
    `Hi ${name},\n\n` +
    'Confirm your email address to finish setting up your account:\n' +
    `${url}\n\n` +
    `This link expires in ${expiresInLabel}.`;

  const html = layout(
    'Verify your email address',
    `<p style="font-size:15px;line-height:1.5">Hi ${name},</p>
     <p style="font-size:15px;line-height:1.5">Confirm your email address to finish setting up your account.</p>
     <p style="margin:24px 0">
       <a href="${url}" style="display:inline-block;background:#18181B;color:#FAFAFA;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500">Verify email</a>
     </p>
     <p style="font-size:13px;color:#71717A;line-height:1.5">Or paste this link into your browser:<br/>${url}</p>
     <p style="font-size:13px;color:#71717A">This link expires in ${expiresInLabel}.</p>`,
  );

  return sendHtml({ to, subject, html, text });
};

const sendPasswordResetEmail = async ({ to, name, url, expiresInLabel }) => {
  const subject = 'Reset your password';
  const text =
    `Hi ${name},\n\n` +
    'We received a request to reset your password. This link expires in ' +
    `${expiresInLabel}:\n${url}\n\n` +
    "If you didn't request a reset, no action is needed.";

  const html = layout(
    'Reset your password',
    `<p style="font-size:15px;line-height:1.5">Hi ${name},</p>
     <p style="font-size:15px;line-height:1.5">We received a request to reset your password.</p>
     <p style="margin:24px 0">
       <a href="${url}" style="display:inline-block;background:#18181B;color:#FAFAFA;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500">Choose a new password</a>
     </p>
     <p style="font-size:13px;color:#71717A;line-height:1.5">Or paste this link into your browser:<br/>${url}</p>
     <p style="font-size:13px;color:#71717A">This link expires in ${expiresInLabel}. If you didn't request a reset, no action is needed.</p>`,
  );

  return sendHtml({ to, subject, html, text });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  hasSmtpConfig,
  isConsoleFallback,
};