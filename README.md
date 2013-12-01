# irc-message
A crazy-fast IRC message parser for node.

---

## What is it?

irc-message is a blazing fast parser for [IRC messages](http://tools.ietf.org/html/rfc2812#section-2.3.1). 

irc-message is designed with performance in mind. IRC is a real-time protocol. As such, it's important IRC data is dealt with and used as quickly as possible. As a result:

- irc-message's parsing method makes no use of regular expressions.
- irc-message only provides the data it's delegated with handling. It parses raw IRC messages in accordance with [the specification in RFC1459](http://tools.ietf.org/html/rfc2812#section-2.3.1).
- There are very little calls to String.split(). irc-message's parser goes through each part of the IRC message, character by character.

When a Message object is created, it contains the following properties:

- `tags` - An object with any [IRCv3.2 message tags](http://ircv3.org/specification/message-tags-3.2), if present. Tags with no corresponding value are given a value of `true`.
- `prefix` - A string with the message prefix.
- `command` - A string with the message command.
- `args` - An array with the message's arguments/parameters.

## Installation

`npm install irc-message`

## Usage

```JavaScript
var Message = require("irc-message");

var str = "@time=2013-06-30T23:59:60.419Z :jamie!jamie@127.0.0.1 PRIVMSG #Node.js :Hello! I was just  browsing for Node.js help, found this channel.";

var parsed = new Message(str);
console.log(parsed.command + " to " + message.args[0] + ": " + message.args[1]);
```

```CoffeeScript
Message = require "irc-message"

str = "@time=2013-06-30T23:59:60.419Z :jamie!jamie@127.0.0.1 PRIVMSG #Node.js :Hello! I was just  browsing for Node.js help, found this channel."

parsed = new Message(str);
console.log "#{parsed.command} to #{message.args[0]}: #{message.args[1]}"
```

## Credit

**Jon Portnoy** (avenj) for his own [IRC parser in Perl](http://metacpan.org/release/POE-Filter-IRCv3). His original implementation and assistance has been invaluable.

## Support

`#expr` on `irc.freenode.net`.