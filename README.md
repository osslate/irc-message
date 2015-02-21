# irc-message [![Build Status](https://travis-ci.org/expr/irc-message.svg?branch=master)](https://travis-ci.org/expr/irc-message)

irc-message provides an object stream capable of parsing [RFC1459-compliant IRC messages](http://tools.ietf.org/html/rfc2812#section-2.3.1). This also includes server-to-server protocols such as TS6, Spanning Tree, and the UnrealIRCd protocol.

## Installation

    npm install irc-message

## Usage

irc-message provides a `parserStream` factory to create object streams that take in `Buffer`s/`String`s of IRC data and push objects containing four keys:

* `tags` - IRCv3 message tags
* `prefix` - message prefix/source
* `command` - message command/verb
* `params` - an array of middle and trailing parameters

```js
var net = require('net')
var parserStream = require('irc-message').parserStream

net.connect(6667, 'irc.freenode.net')
    .pipe(parserStream())
    .on('data', function(message) {
        console.log(JSON.stringify(message))
    })
```

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
