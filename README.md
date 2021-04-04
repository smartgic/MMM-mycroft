
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-pink.svg?style=flat)](https://github.com/smartgic/MMM-mycroft-wakewordpulls) [![MagicMirror module](https://img.shields.io/badge/MagicMirror-module-blue)](https://magicmirror.builders/) [![Discord](https://img.shields.io/discord/809074036733902888)](https://discord.gg/Vu7Wmd9j) 

# MMM-mycroft-wakeword

This module interacts with the [MagicMirror](https://magicmirror.builders/) to let you know if [Mycroft AI](https://mycroft.ai/) is listening. When a wake word is detected, an image is displayed and when the recording is done the image disappears.

## Installation

Clone this repository into `~/MagicMirror/modules` *(replace with your path)* directory.

```bash
$ cd ~/MagicMirror/modules
$ git clone https://github.com/smartgic/MMM-mycroft-wakeword.git
```

Then update the MagicMirror configuration file `~/MagicMirror/config/config.js` *(replace with your path)*.

```js
{
    module: "MMM-mycroft-wakeword",
    position: "lower_third",
    config: {
        title: "Mycroft AI",
        maxMessages: 1,
        opacity: 0.5
    }
}
```

## Configuration

| Option       | Default        | Description                                                              |
|--------------|----------------|--------------------------------------------------------------------------|
| maxMessages  | `5`            | How many messages should be displayed on the screen.                     |
| image        | `wakeword.png` | Image file to use *(the image should be within the `images` directory)*. |
| width        | `100%`         | Image max width size.                                                    |
| height       | `100%`         | Image max height size.                                                   |
| opacity      | `1.0`          | Image opacity.                                                           |
| title        | `Mycroft AI`   | The name placed above the received messages .                            |

## API

This module expose an extra route, `/mycroft` which only supports `POST` method.

| Parameter    | Description                                                                                           |
|--------------|-------------------------------------------------------------------------------------------------------|
| notification | Notification identifier, if set to `MYCROFT_SEND_MESSAGE`, the payload will be printed by the module. |
| payload      | JSON payload to pass to the notification.                                                             |

Only two notifications are supported:
- `MYCROFT_SEND_MESSAGE`
- `MYCROFT_DELETE_MESSAGE`

## curl examples

This command displays an image on the mirror with the `Listening` message.

```bash
$ curl -H "Content-Type: application/json" -X POST -d '{"notification":"MYCROFT_SEND_MESSAGE", "payload": "Listening"}' http://192.168.1.97:8080/mycroft
```

This command deletes the image on the mirror.

```bash
$ curl -H "Content-Type: application/json" -X POST -d '{"notification":"MYCROFT_DELETE_MESSAGE", "payload": "null"}' http://192.168.1.97:8080/mycroft
```

## Credits

This module has been forked from [MMM-kalliope](https://github.com/kalliope-project/MMM-kalliope) and refactored by [Smart'Gic](https://smartgic.io).
