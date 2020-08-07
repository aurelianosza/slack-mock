'use strict'
const crypto = require('crypto');
const qs = require('querystring');

module.exports = (secret, request) => {
  if (request.payload instanceof Object) {
    request.payload = JSON.stringify(request.payload);
  }

  const version = 'v0';
  const timestamp = Math.round(Date.now()/1000);
  const body = qs.stringify(request, null, null, {format: 'RFC1738'});
  const basestring = `${version}:${timestamp}:${body}`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(basestring);
  const signature = hmac.digest('hex');

  const headers = {
    'X-Slack-Request-Timestamp': timestamp,
    'X-Slack-Signature': signature,
  }

  return {headers, body};
};