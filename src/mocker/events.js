'use strict'

const events = module.exports
const request = require('request')
const logger = require('../lib/logger')
const sign = require('./sign');

events.calls = []

events.secret = ''

events.send = function (target, data) {
  const {headers, body} = sign(events.secret, data)

  // the events api uses content-type application/json
  request({
    uri: target,
    method: 'POST',
    json: true,
    headers,
    body
  }, (err, res, body) => {
    if (err) {
      return logger.error(`error receiving response to events api ${target}`, err)
    }

    logger.debug(`received response to events request`)

    events.calls.push({
      url: target,
      params: body,
      body: body, // remove in next major version
      headers: res.headers,
      statusCode: res.statusCode
    })
  })

  return Promise.resolve()
}

events.reset = function () {
  logger.debug(`resetting events`)
  events.calls.splice(0, events.calls.length)
}
