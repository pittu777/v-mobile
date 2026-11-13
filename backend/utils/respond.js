const HttpError = require('./HttpError');

/**
 * Uniform success envelope.
 *
 * Every handler answers with `{ success, data, message }` (plus `code` when the
 * client needs a stable machine-readable reason). The frontend has one
 * `request()` helper to write against, so the shape only has to be defined once
 * — and no endpoint invents its own.
 */
const sendData = (res, data, { status = 200, message = 'OK' } = {}) =>
  res.status(status).json({ success: true, data, message });

const sendCreated = (res, data, message = 'Created') =>
  sendData(res, data, { status: 201, message });

const sendMessage = (res, message = 'OK', { status = 200, code } = {}) =>
  res.status(status).json({ success: true, data: null, message, ...(code ? { code } : {}) });

module.exports = { sendData, sendCreated, sendMessage };