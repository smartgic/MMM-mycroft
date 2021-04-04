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
    start: function() {
        var self = this;
	    self.config = {}

        // Make sure the payload is a valid JSON.
        self.expressApp.use(express.json());

        // Create the new route
        this.expressApp.post('/mycroft', (req, res) => {
            var notification = req.body.notification
            var payload = req.body.payload

            // Check if X-Api-Key header is part of the request.
            if (!req.headers.hasOwnProperty('x-api-key')) {
                res.status(401).json({'status': false,
                'error': 'x-api-key header is missing'});
            }

            if (notification && payload) {
                if (self.config.hasOwnProperty('apiKey')) {
                    // Compare X-Api-Key and API key from configuration.
                    if (req.headers['x-api-key'] === self.config.apiKey) {
                        self.sendSocketNotification(notification, payload);
                        res.status(200).json({'status': true,
                                              'payload': payload,      
                                              'notification': notification});
                    } else {
                        res.status(401).json({'status': false,
                                              'error': 'unauthorized'});
		            }
		        }
            } else {
                res.status(400).json({'status': false,
                                      'error': 'bad request'});
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
	    var self = this;

        if (notification === 'INIT') {
	        self.config.apiKey = payload;
        }
    }
});
