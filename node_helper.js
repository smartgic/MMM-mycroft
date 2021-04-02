/* global Module */

const NodeHelper = require('node_helper')
const express = require('express')

module.exports = NodeHelper.create({

    start: function() {
        var self = this;

        console.log(self.name + ' node helper is started');

        self.expressApp.use(express.json()); // support json encoded bodies
        self.expressApp.use(express.urlencoded({ extended: true })); // support encoded bodies

        self.expressApp.post('/mycroft', (request, response) => {
            if (request.body.notification) {
                if (request.body.payload) {
                    payload = request.body.payload
                    console.log(payload)
                    if (self.isJsonString(payload)) {
                        payload = JSON.parse(request.body.payload);
                    }
                    self.sendSocketNotification(request.body.notification, payload);
                    response.send({"status": "success"});
                } else {
                    response.send({"status": "failed", "error": "No payload given."});
                }
            } else {
                response.send({"status": "failed", "error": "No notification given."});
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
		console.log(self.name + " received a socket notification: " + notification + " - Payload: " + payload);

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

