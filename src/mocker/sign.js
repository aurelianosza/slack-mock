'use strict'
const crypto = require('crypto');
const qs = require('querystring');

module.exports = (secret, request) => {
    const version = 'v0';
    const timestamp = Math.round(Date.now() / 1000).toString();
    const body = qs.stringify(request);
    const basestring = `${version}:${timestamp}:"${body}"`;
  
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(basestring);
    const signature = hmac.digest('hex');
  
    const headers = {
      'X-Slack-Request-Timestamp': timestamp,
      'X-Slack-Signature': `${version}=${signature}`,
    };
  
    return {headers, body};
};
