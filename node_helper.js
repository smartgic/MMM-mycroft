/* global Module */

const NodeHelper = require('node_helper')
const express = require('express')

module.exports = NodeHelper.create({

    start: function() {
        var self = this;

        console.log(self.name + ' node helper is started');

        self.expressApp.use(express.json());

        this.expressApp.post('/mycroft', (req, res) => {
            var notification = req.body.notification
            var payload = req.body.payload

            if (notification && payload) {
                self.sendSocketNotification(notification, payload);
                res.send({'status': 'success', 'payload': payload,      
                          'notification': notification});
            } else {
                res.send({'status': 'fail', 'error': 'no notification sent'});
            }
        });
    }

});

