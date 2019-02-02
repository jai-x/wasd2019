const moment = require('moment');

const timeStringToMs = (timeString) => {
  if (typeof timeString !== 'string') {
    throw new TypeError('Expected string');
  }

  // RegExp yEEt
  const format = /^(\d{1,2}:){0,2}\d{1,2}$/;
  if (!format.test(timeString)) {
    throw new Error(`Bad timeString format: ${timeString}`);
  }

  const parts = timeString.split(':').map(part => parseInt(part, 10)).reverse();
  return moment.duration({
    seconds: parts[0],
    minutes: parts[1],
    hours: parts[2],
  }).asMilliseconds();
};

const msToTimeString = (ms) => {
  if (typeof ms !== 'number') {
    throw new TypeError('Expected number');
  }
  const dur = moment.duration({ milliseconds: ms });
  return [dur.hours() || null, dur.minutes(), dur.seconds()]
    .filter(d => d !== null).map(d => String(d).padStart(2, '0')).join(':');
};

module.exports = { timeStringToMs, msToTimeString };
