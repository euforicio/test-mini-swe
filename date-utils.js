'use strict';

/**
 * Format a Date object as 'YYYY-MM-DD'.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new TypeError('formatDate expects a valid Date instance');
  }
  const pad = n => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

module.exports = { formatDate };
