'use strict'
const Botkit      = require('botkit')
const controller  = Botkit.slackbot()
const Sonos       = require('sonos').Sonos
const sonos       = new Sonos(process.env.SONOS_IP)

const bot = controller.spawn({
  debug: true,
  incoming_webhook: {
    url: process.env.WEBHOOK_URL
  }
})

let trackState  = {}
const updateState = function(track) {
  return trackState = track
}

const trackText = function(track) {
  return {
    text: "Now Playing: " + track.title + " by " + track.artist
  }
}

const sameTrack = function(x, y) {
  return x.title === y.title && x.artist === y.artist
}

const postTrack = function(track) {
  return bot.sendWebhook(trackText(track))
}

const checkTrack = function() {
  sonos.currentTrack(function (err, track) {
    if (err) { return console.log(err) }
    if (sameTrack(trackState, track)) { return null }
    updateState(track)
    return postTrack(track)
  })
  setTimeout(checkTrack, 1000)
}

checkTrack()
