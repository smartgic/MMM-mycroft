
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-pink.svg?style=flat)](https://github.com/smartgic/MMM-mycroft-wakeword/pulls) [![MagicMirror module](https://img.shields.io/badge/MagicMirror-module-blue)](https://magicmirror.builders/) [![Discord](https://img.shields.io/discord/809074036733902888)](https://discord.com/invite/sHM3Duz5d3) 

# MMM-mycroft-wakeword

This module interacts with the [MagicMirror](https://magicmirror.builders/) to let you know if [Mycroft AI](https://mycroft.ai/) is listening. When a wake word is detected, an image is displayed and when the recording is done the image disappears.

<img src='docs/screenshot.png' width='450'/>

The [Mycroft AI MagicMirror² wake word skill](https://github.com/smartgic/mycroft-magicmirror-wakeword-skill) interacts with this MagicMirror² module which is why this skill is required on the Mycroft AI device.

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
        apiKey: "en323q9WBNMK3Q04WIPNEAsdfhesammhp44",
        maxMessages: 1,
        opacity: 0.5
    }
}
```

## Configuration

In order to reach the `/mycroft` route on your MagicMirror, you need to allow the remote connection for a specific IP address or for a network range in your MagicMirror by changing the `~/MagicMirror/config/config.js` *(replace with your path)*.

```js
ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.1/24"]
```

The example above will allows all the connection from `192.168.1.0/24` network to perform remote connections.


| Option       | Default        | Description                                                                       |
|--------------|----------------|-----------------------------------------------------------------------------------|
| `maxMessages`| `5`            | How many messages should be displayed on the screen.                              |
| `image`      | `wakeword.png` | Image file to use *(the image should be within the `images` directory)*.          |
| `width`      | `100%`         | Image max width size.                                                             |
| `height`     | `100%`         | Image max height size.                                                            |
| `opacity`    | `1.0`          | Image opacity.                                                                    |
| `title`      | `Mycroft AI`   | The name placed above the received messages.                                      |
| `apiKey`     | `None`         | API key required to `POST` a notification.                                        |

## API

This module expose an extra route, `/mycroft` which only supports `POST` method.

| Header    | Description                                                                          |
|-----------|--------------------------------------------------------------------------------------|
| X-Api-Key | This should match the `apiKey` value registered into MagicMirror configuration file. |

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
$ curl -H "Content-Type: application/json" \
    -H "X-Api-Key: en323q9WBNMK3Q04WIPNEAsdfhesammhp44" \
    -X POST \
    -d '{"notification":"MYCROFT_SEND_MESSAGE", "payload": "Listening"}' \
    http://192.168.1.97:8080/mycroft
```

This command deletes the image on the mirror.

```bash
$ curl -H "Content-Type: application/json" \
    -H "X-Api-Key: en323q9WBNMK3Q04WIPNEAsdfhesammhp44" \
    -X POST \
    -d '{"notification":"MYCROFT_DELETE_MESSAGE", "payload": "null"}' \
    http://192.168.1.97:8080/mycroft
```

## Credits

This module has been forked from [MMM-kalliope](https://github.com/kalliope-project/MMM-kalliope) and refactored by [Smart'Gic](https://smartgic.io).
