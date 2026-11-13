const mongoose = require('mongoose');
const HttpError = require('../utils/HttpError');

/**
 * Validate a MongoDB ObjectId and return it as a string.
 * Throws 404 (not 400) so clients treat a bad id the same as a missing one.
 */
const parseObjectId = (value, label = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw HttpError.notFound(`${label} not found`);
  }
  return String(value);
};

module.exports = { parseObjectId };