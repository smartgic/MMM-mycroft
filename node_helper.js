/* global Module */

const NodeHelper = require('node_helper')
const express = require('express')

module.exports = NodeHelper.create({

    start: function() {
        var self = this;

        console.log(self.name + ' node helper is started');

        self.expressApp.use(express.json()); // support json encoded bodies

        self.expressApp.post('/mycroft', (request, response) => {
            var notification = request.body.notification
            var payload = request.body.payload

            if (notification) {
                validPayload = self.isJsonString(payload)
                if (validPayload) {
                    self.sendSocketNotification(notification, validPayload);
                    response.send({'status': 'success'});
                }
            } else {
                response.send({'status': 'failed', 'error': 'no notification sent'});
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;
        if (notification === 'MYCROFT_SEND_MESSAGE' || 
            notification === 'MYCROFT_DELETE_MESSAGE') {
            console.log(self.name + " received a socket notification: " + notification + " - Payload: " + payload);
        }
    },

    isJsonString: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

});

