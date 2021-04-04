/* node helper */

const NodeHelper = require('node_helper')
const express = require('express')

/* This helper will expose a new route to MagicMirror.
The route is /mycroft and will only accept a POST request with a JSON payload.

Only two notifications are supported:
  - MYCROFT_SEND_MESSAGE
  - MYCROFT_DELETE_MESSAGE

Payload examples:
  - '{"notification":"MYCROFT_SEND_MESSAGE", "payload": "Listening"}'
  - '{"notification":"MYCROFT_DELETE_MESSAGE", "payload": "Deleting"}'
*/
module.exports = NodeHelper.create({
    apiKey: null,

    start: function() {
        var self = this;

        // Make sure the payload is a valid JSON.
        self.expressApp.use(express.json());

        // Create the new route
        this.expressApp.post('/mycroft', (req, res) => {
            var notification = req.body.notification
            var payload = req.body.payload

            // Check if requirements are fulfilled.
            if (notification && req.body.payload) {
                if (req.headers.hasOwnProperty('x-api-key')) {
                    console.log(apiKey)
                    console.log(req.headers.x-api-key)
                }

                // Send the notification and return a JSON to the client.
                self.sendSocketNotification(notification, payload);
                res.send({'status': True, 'payload': payload,      
                          'notification': notification});
            } else {
                res.send({'status': False, 'error': 'no notification sent'});
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONNECT') {
		    apiKey = payload
        }
    }
});

