var Botkit      = require('botkit')
var controller  = Botkit.slackbot()
var Sonos       = require('sonos').Sonos
var sonos       = new Sonos(process.env.SONOS_IP)

var bot = controller.spawn({
  incoming_webhook: {
    url: process.env.WEBHOOK_URL
  }
})

var trackState  = {}
var updateState = function(track) {
  return trackState = track
}

var trackText = function(track) {
  return {
    text: "Now Playing: " + track.title + " by " + track.artist
  }
}

var sameTrack = function(x, y) {
  return x.title === y.title && x.artist === y.artist
}

var postTrack = function(track) {
  return bot.sendWebhook(trackText(track))
}

var checkTrack = function() {
  sonos.currentTrack(function (err, track) {
    if (err) { return console.log(err) }
    if (sameTrack(trackState, track)) { return null }
    updateState(track)
    return postTrack(track)
  })
  setTimeout(checkTrack, 1000)
}

checkTrack()
