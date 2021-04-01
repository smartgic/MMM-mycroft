/* global Module */

/* Magic Mirror
 * Module: MMM-Mycroft
 *
 * Fork from https://github.com/kalliope-project/MMM-kalliope
 * Modified by Gaëtan Trellu
 * MIT Licensed.
 */

class Message {
    constructor(text) {
        this.text = text;
        this.timestamp = new Date();
    }
}

Module.register('MMM-mycroft',{

	requiresVersion: "2.12.0",

    defaults: {
		updateInterval: 1000,
        max: 5,
        keep_seconds: 5,
        title: "Mycroft",
        image: "modules/MMM-mycroft/images/mycroft.png"
    },

    /* Initiate messages list variable.
     * This will be the list of messages to display on the screen.
     */
    messages: [],

    start: function() {
        var self = this;

        Log.info("Starting module: " + self.name);
    
        /* sendSocketNotification(notification, payload)
         * Send a socket notification to the node helper.
         */
        self.sendSocketNotification("CONNECT", null);

		setInterval(() => {
			self.updateDom();
        }, updateInterval);

        // only clean old messages if keep_seconds is set
        if (self.config.keep_seconds > 0){
            setInterval(() => {
                self.cleanOldMesssage();
            }, 1000);
        }
    },

    cleanOldMesssage: function() {
        var currentDate = new Date();

        for(var i = 0; i < this.messages.length; i++){
            var dif = currentDate.getTime() - this.messages[i].timestamp.getTime();
            var secondsFromCurrentDateToMessageDate = dif / 1000;
            var secondsBetweenDates = Math.abs(secondsFromCurrentDateToMessageDate);

            // delete the message if to old
            if (secondsBetweenDates > this.config.keep_seconds){
                this.messages.splice(i, 1);
            }
        }
    },

    // Override dom generator
	getDom: function() {
        var self = this;

        var wrapper = document.createElement("div");

        if (self.messages.length  == 0){
            wrapper.innerHTML = "";
            return wrapper
        }

        var title = document.createElement("div");
        var mycroftImage = document.createElement("img");
        mycroftImage.src = self.config.image;;
        title.className = "light small dimmed";
        title.innerHTML = self.config.title;
        wrapper.appendChild(mycroftImage)
        wrapper.appendChild(title);

        var table = document.createElement("table");

        for(var i = 0; i < self.messages.length; i++){

            var row = document.createElement("tr");
            table.appendChild(row);

            var messageCell = document.createElement("td");
			messageCell.innerHTML =  self.messages[i].text
			row.appendChild(messageCell);
        }
        wrapper.appendChild(table);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;

        if (notification == "MYCROFT"){
            // create new message object
            var newMessage = new Message(payload);
            self.messages.push(newMessage);

            // clean old messages if list is too long
            while(self.messages.length > self.config.max){
                self.messages.shift();
            }

        } else {
            // forward the notification to all modules
            self.sendNotification(notification, payload);
        }


    },

    notificationReceived: function(notification, payload, sender) {
        var self = this;

        if (sender) {
            Log.log(self.name + " received a module notification: " + notification
            + " from sender: " + sender.name);
            Log.log(payload);
        } else {
            Log.log(self.name + " received a system notification: " + notification);
        }
    }
});
