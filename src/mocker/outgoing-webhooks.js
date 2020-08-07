'use strict'

const outgoingWebhooks = module.exports
const request = require('request')
const logger = require('../lib/logger')

outgoingWebhooks.calls = []

outgoingWebhooks.secret = ''

outgoingWebhooks.send = function (targetUrl, outgoingBody) {
  const {headers, body} = sign(events.secret, outgoingBody)

  request({
    method: 'POST',
    uri: targetUrl,
    json: true,
    headers,
    body
  }, (err, res, body) => {
    if (err) {
      return logger.error(`error receiving response to outgoing-webhooks ${targetUrl}`, err)
    }

    logger.debug(`received response to outgoing-webhooks request: ${targetUrl}`)

    outgoingWebhooks.calls.push({
      url: targetUrl,
      params: body,
      headers: res.headers,
      statusCode: res.statusCode
    })
  })

  return Promise.resolve()
}

outgoingWebhooks.reset = function () {
  logger.debug(`resetting outgoing-webhooks`)
  outgoingWebhooks.calls.splice(0, outgoingWebhooks.calls.length)
}
