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
    }
}

Module.register('MMM-mycroft-wakeword',{

	requiresVersion: '2.12.0',

    defaults: {
		updateInterval: 1000,
        maxMessages: 1,
        title: 'Mycroft',
        image: 'modules/MMM-mycroft-wakeword/images/wakeword.png'
    },

    /* Initiate messages list variable.
     * This will be the list of messages to display on the screen.
     */
    messages: [],

    start: function() {
        var self = this;

        Log.info('Starting module: ' + self.name);
    
        /* sendSocketNotification(notification, payload)
         * Send a socket notification to the node helper.
         */
        self.sendSocketNotification('CONNECT', null);

		setInterval(() => {
			self.updateDom();
        }, self.config.updateInterval);

    },

    // Override dom generator
	getDom: function() {
        var self = this;
        var wrapper = document.createElement('div');

        if (self.messages.length  == 0) {
            wrapper.innerHTML = '';
            return wrapper
        }

        var title = document.createElement('div');
        var mycroftImage = document.createElement('img');
        mycroftImage.style.maxWidth = '100%';
        mycroftImage.style.maxHeight = '100%';
        mycroftImage.style.opacity = 0.7;
        mycroftImage.src = self.config.image;;
        title.className = 'light small dimmed';
        title.innerHTML = self.config.title;
        wrapper.appendChild(mycroftImage)
        wrapper.appendChild(title);

        var table = document.createElement('table');

        for (var i = 0; i < self.messages.length; i++) {
            var row = document.createElement('tr');
            table.appendChild(row);

            var messageCell = document.createElement('td');
			messageCell.innerHTML =  self.messages[i].text
			row.appendChild(messageCell);
        }
        wrapper.appendChild(table);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;

        if (notification == 'MYCROFT_SEND_MESSAGE') {
            var newMessage = new Message(payload);
            self.messages.push(newMessage);

            while (self.messages.length > self.config.maxMessages) {
                self.messages.shift();
            }
        } else if (notification == 'MYCROFT_DELETE_MESSAGE') {
            this.messages.splice(0, this.messages.length);
        }
    }
});
