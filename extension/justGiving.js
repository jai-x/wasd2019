const util = require('util');
const request = require('request');
const nodecg = require('./apiContext').get();

class JustGivingAPIContext {
  constructor({ env, appId, pageShortName }) {
    if (!env || !appId || !pageShortName) {
      throw new Error('Requires parameters: \'env\', \'appId\', \'pageShortName\'');
    }

    if (!['live', 'staging'].includes(env)) {
      throw new Error('\'env\' parameter must be one of: \'live\', \'staging\'');
    }

    const LIVE_DOMAIN = 'https://api.justgiving.com';
    const STAGING_DOMAIN = 'https://api.staging.justgiving.com';
    const domain = env === 'live' ? LIVE_DOMAIN : STAGING_DOMAIN;

    this.detailsUrl = `${domain}/${appId}/v1/fundraising/pages/${pageShortName}`;
    this.donationsUrl = `${domain}/${appId}/v1/fundraising/pages/${pageShortName}/donations`;

    this.baseOptions = {
      method: 'GET',
      timeout: 5000,
      headers: { Accept: 'application/json' },
      json: true, // Auto parse response body from JSON
    };
  }

  total() {
    return { uri: this.detailsUrl, ...this.baseOptions };
  }

  donations() {
    return { uri: this.donationsUrl, ...this.baseOptions };
  }
}

const totalRep = nodecg.Replicant('total');
const DEFAULT_INTERVAL = 45 * 1000;
let FAILED_REQUESTS = 0;

const updateTotal = (opts, interval) => {
  request(opts, (err, resp, data) => {
    if (!resp || resp.statusCode !== 200 || err) {
      FAILED_REQUESTS += 1;
      nodecg.log.error('Total fetch: failed request:', err.code);
      nodecg.log.error('Total fetch: number of failed:', FAILED_REQUESTS);
    } else {
      const out = {
        symbol: data.currencySymbol,
        amount: parseInt(data.totalRaisedOnline, 10),
      };
      nodecg.log.info('Total fetch: OK:', util.inspect(out));
      totalRep.value = out;
    }
    setTimeout(updateTotal, interval, opts, interval);
  });
};

try {
  const context = new JustGivingAPIContext({
    env: '',
    appId: '',
    pageShortName: '',
  });
  updateTotal(context.total(), DEFAULT_INTERVAL);
} catch(e) {
  nodecg.log.error(e);
  nodecg.log.error('justGiving extension NOT RUNNING');
}

