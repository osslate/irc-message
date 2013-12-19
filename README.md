# irc-message [![Build Status](https://travis-ci.org/expr/irc-message.png)](https://travis-ci.org/expr/irc-message)
> A blazing fast parser for [IRC messages](http://tools.ietf.org/html/rfc2812#section-2.3.1).

## Why?

irc-message is designed with performance in mind. IRC is a real-time protocol. As such, it's important IRC data is dealt with and used as quickly as possible. As a result:

- irc-message's main parsing method makes no use of regular expressions.
- irc-message only provides the data it's delegated with handling. It parses raw IRC messages similarly to [the specification in RFC1459](http://tools.ietf.org/html/rfc2812#section-2.3.1).
- There are very little calls to String.split(). irc-message's parser goes through each part of the IRC message, character by character.

## Installation

    npm install irc-message

## Usage

```JavaScript
var Message = require("irc-message");

var parsed = Message("@time=2013-06-30T23:59:60.419Z :jamie!jamie@127.0.0.1 PRIVMSG #Node.js :Hello! I was just  browsing for Node.js help, found this channel.");

console.log(JSON.stringify(parsed));
```

```JSON
{
    "tags": {
        "time": "2013-06-30T23:59:60.419Z"
    },
    "prefix": "jamie!jamie@127.0.0.1",
    "command": "PRIVMSG",
    "params": ["#Node.js", "Hello! I was just  browsing for Node.js help, found this channel."]
}
```

When a Message object is created, it contains the following properties:

- `tags` - An object with any [IRCv3.2 message tags](http://ircv3.org/specification/message-tags-3.2), if present. Tags with no corresponding value are given a value of `true`.
- `prefix` - A string with the message prefix.
- `command` - A string with the message command.
- `params` - An array with the message's parameters.

If the message is invalid, `null` wil be returned.

**NOTE:** In 0.x.x, irc-message objects were created by using the `new` keyword and threw an error if parsing failed. Starting from 1.x.x, irc-message exports a function that takes the raw line. If it is valid, an IRCMessage object will be returned. If not, `null` will be returned.

## Utilities

### #toString()

Converts an irc-message object to a string of IRC data (minus CRLF) suitable to be streamed/sent to an IRC server.

```JavaScript
var Message = require("irc-message");

var message = Message(":jamie!jamie@127.0.0.1 PRIVMSG #Node.js :A message");

console.log(message.toString()); // :jamie!jamie@127.0.0.1 PRIVMSG #Node.js :A message
```

### #parseHostmaskFromPrefix()

Parses the hostmask from the message prefix. Object returned will contain keys for `nickname`, `username` and `hostname`.

```JavaScript
var Message = require("irc-message");

var message = Message(":jamie!jamie@127.0.0.1 PRIVMSG #Node.js :A message");
var hostmask = message.parseHostmaskFromPrefix();

console.log(JSON.stringify(hostmask));
```

### #prefixIsHostmask()

Returns `true` if the prefix of the message is a hostmask.

```JavaScript
var Message = require("irc-message");

var message1 = Message(":jamie!jamie@127.0.0.1 PRIVMSG #Node.js :A message");
var message2 = Message(":test.services. PRIVMSG #Node.js :A message");

console.log(message1.prefixIsHostmask());
console.log(message2.prefixIsHostmask());
```

### #prefixIsServer()

Returns `true` if the prefix of the message is a server.

```JavaScript
var Message = require("irc-message");

var message1 = Message(":jamie!jamie@127.0.0.1 PRIVMSG #Node.js :A message");
var message2 = Message(":test.services. PRIVMSG jamie :This is test.services. speaking!");

console.log(message1.prefixIsServer());
console.log(message2.prefixIsServer());
```

## Credit

**Jon Portnoy** (avenj) for his own [IRC parser in Perl](http://metacpan.org/release/POE-Filter-IRCv3). His original implementation and assistance has been invaluable.

## Support

If you need support or notice a bug, feel free to open an issue on the repo, or alternatively join `#expr` on freenode.
