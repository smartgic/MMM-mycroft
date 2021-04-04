/* global Module */

/* Magic Mirror
 * Module: MMM-Mycroft
 *
 * Fork from https://github.com/kalliope-project/MMM-kalliope
 * Modified by Gaëtan Trellu
 * MIT Licensed.
 */

// Message structure
class Message {
    constructor(text) {
        this.text = text;
    }
}

Module.register('MMM-mycroft-wakeword', {

	requiresVersion: '2.12.0',

    defaults: {
        maxMessages: 5,
        title: 'Mycroft AI',
        image: 'wakeword.png',
        width: '100%',
        height: '100%',
        opacity: 1.0
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
        }, 1000);

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
        var image = document.createElement('img');
        image.style.maxWidth = self.config.width;
        image.style.maxHeight = self.config.height;
        image.style.opacity = self.config.opacity;
        image.src = 'modules/' + self.name + '/images/' + self.config.image;
        title.className = 'light small dimmed';
        title.innerHTML = self.config.title;
        wrapper.appendChild(image)
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
