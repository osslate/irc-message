# irc-message [![Build Status](https://travis-ci.org/expr/irc-message.svg?branch=master)](https://travis-ci.org/expr/irc-message)
> Performant, streaming IRC message parser

irc-message provides an object stream capable of parsing [RFC1459-compliant IRC messages](http://tools.ietf.org/html/rfc2812#section-2.3.1), with support for [IRCv3 message tags](https://github.com/ircv3/ircv3-specifications/blob/master/specification/message-tags-3.2.md). This also includes server-to-server protocols such as TS6, Spanning Tree, and the UnrealIRCd protocol.

## Installation

    npm install irc-message

## Usage

### `createStream(options)`

Factory function that returns an object stream, taking in `Buffer`s/`String`s of IRC data and pushing objects containing four keys:

* `tags` - IRCv3 message tags
* `prefix` - message prefix/source
* `command` - message command/verb
* `params` - an array of middle and trailing parameters

Optional `options` object supports

* `parsePrefix` - replace the prefix with an object generated by _[irc-prefix-parser](https://github.com/expr/irc-prefix-parser)_. Defaults to `false`.
* `convertTimestamp` - if the message has a _time_ tag, convert it into a JavaScript `Date` object (see _[server-time](https://github.com/ircv3/ircv3-specifications/blob/master/extensions/server-time-3.2.md)_ spec for reference). Defaults to `false`.

```js
var net = require('net')
var ircMsg = require('irc-message')

net.connect(6667, 'irc.freenode.net')
    .pipe(ircMsg.createStream())
    .on('data', function(message) {
        console.log(message)
    })
```

### `parse(data)`

You can also access the message parser directly. The parser function expects a string without any CRLF sequences.

```js
var parse = require('irc-message').parse

console.log(parse(':hello!sir@madam PRIVMSG #test :Hello, world!'))
/* { 
 *   tags: {}, 
 *   prefix: 'hello!sir@madam', 
 *   command: 'PRIVMSG',
 *   params: ['#test', 'Hello, world!']
 * }
 */
```
