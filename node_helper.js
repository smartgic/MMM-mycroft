/* global Module */

const NodeHelper = require('node_helper')
const express = require('express')

module.exports = NodeHelper.create({

    start: function() {
        var self = this;

        console.log(self.name + ' node helper is started');

        self.expressApp.use(express.json()); // support json encoded bodies

        this.expressApp.post('/mycroft', (req, res) => {
            if (req.body.notification){
                if (req.body.payload){
                    payload = req.body.payload
                    console.log(payload)
                    if (this.isJsonString(payload)){
                        payload = JSON.parse(req.body.payload);
                    }
                    this.sendSocketNotification(req.body.notification, payload);
                    res.send({"status": "success"});
                }else{
                    res.send({"status": "failed", "error": "No payload given."});
                }
            }else{
                res.send({"status": "failed", "error": "No notification given."});
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

