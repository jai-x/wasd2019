const apiContext = require('./apiContext');

module.exports = (nodecg) => {
  apiContext.set(nodecg);

  /* eslint-disable global-require */
  require('./countdown');
  nodecg.log.info('Loaded extension: countdown');

  require('./schedule');
  nodecg.log.info('Loaded extension: schedule');

  require('./timer');
  nodecg.log.info('Loaded extension: timer');

  require('./justGiving');
  nodecg.log.info('Loaded extension: justGiving');
  /* eslint-enable */
};
