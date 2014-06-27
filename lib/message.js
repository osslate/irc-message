/*
    irc-message
    Copyright (c) 2013 Fionn Kelleher. All rights reserved.
    Licensed under the BSD 2-Clause License (FreeBSD) - see LICENSE.md.
*/

var IRCMessage, parseMessage;

IRCMessage = function() {
    this.tags = {};
    this.prefix = "";
    this.command = "";
    this.params = [];
};

IRCMessage.prototype.toString = function() {
    var param, string, tag, value, i;
    string = "";
    // Append any message tags if present.
    if (Object.keys(this.tags).length !== 0) {
        string += "@";
        for (tag in this.tags) {
            if (this.tags.hasOwnProperty(tag)) {
                value = this.tags[tag];
                if (value !== true) {
                    string += "" + tag + "=" + value + ";";
                } else {
                    string += "" + tag + ";";
                }
            }
        }
        string = string.slice(0, -1) + " ";
    }

    if (this.prefix.length !== 0) {
        string += ":" + this.prefix + " ";
    }

    if (this.command.length !== 0) {
        string += "" + this.command + " ";
    }

    if (this.params.length !== 0) {
        for (i = 0; i < this.params.length; i++) {
            param = this.params[i];

            if (param.indexOf(" ") !== -1 ||
                (i === (this.params.length - 1) && param[0] === ':')) {
                string += ":" + param + " ";
            } else {
                string += param + " ";
            }
        }
    }

    string = string.slice(0, -1);
    return string;
};

IRCMessage.prototype.prefixIsHostmask = function() {
    // This method determines whether or not the prefix is a hostmask.
    // A regular expression might be a better choice for this; at the
    // moment, it checks to see if the prefix contains an @ and an !,
    // so it's very lax.
    return this.prefix.indexOf("@") !== -1 &&
           this.prefix.indexOf("!") !== -1;
};

IRCMessage.prototype.prefixIsServer = function() {
    // This method determines whether or not the prefix is a server host.
    // Similarly to #prefixIsHostmask(), a regular expression would be a
    // wiser choice here.
    return this.prefix.indexOf("@") === -1 &&
           this.prefix.indexOf("!") === -1 &&
           this.prefix.indexOf(".") !== -1;
};

IRCMessage.prototype.parseHostmaskFromPrefix = function() {
    // Simple method to parse the hostmask of the current prefix into an
    // object with nickname, username and hostname. Returns null if the
    // return value of #prefixIsHostmask() is false.
    var parts;
    if (this.prefixIsHostmask()) {
        parts = this.prefix.split(/[!@]/);
        return {
            nickname: parts[0],
            username: parts[1],
            hostname: parts[2]
        };
    } else {
        return null;
    }
};

parseMessage = function(line) {
    var message, position, nextspace, i;

    message = new IRCMessage();
    // position and nextspace are used by the parser as a reference.
    position = 0;
    nextspace = 0;

    // The first thing we check for is IRCv3.2 message tags.
    // http://ircv3.atheme.org/specification/message-tags-3.2

    if (line.charCodeAt(0) === 64) {
        var rawTags, pair, tag;
        nextspace = line.indexOf(" ");
        if (nextspace === -1) {
            // Malformed IRC message.
            return null;
        }
        // Tags are split by a semi colon.
        rawTags = line.slice(1, nextspace).split(";");
        for (i = 0; i < rawTags.length; i++) {
            // Tags delimited by an equals sign are key=value tags.
            // If there's no equals, we assign the tag a value of true.
            tag = rawTags[i];
            pair = tag.split("=");
            message.tags[pair[0]] = pair[1] || true;
        }
        position = nextspace + 1;
    }

    // Skip any trailing whitespace.
    while (line.charCodeAt(position) === 32) {
        position++;
    }

    // Extract the message's prefix if present. Prefixes are prepended
    // with a colon.

    if (line.charCodeAt(position) === 58) {
        nextspace = line.indexOf(" ", position);
        // If there's nothing after the prefix, deem this message to be
        // malformed.
        if (nextspace === -1) {
            // Malformed IRC message.
            return null;
        }
        message.prefix = line.slice(position + 1, nextspace);
        position = nextspace + 1;
        // Skip any trailing whitespace.
        while (line.charCodeAt(position) === 32) {
            position++;
        }
    }

    nextspace = line.indexOf(" ", position);

    // If there's no more whitespace left, extract everything from the
    // current position to the end of the string as the command.
    if (nextspace === -1) {
        if (line.length > position) {
            message.command = line.slice(position);
        }
        return message;
    }

    // Else, the command is the current position up to the next space. After
    // that, we expect some parameters.
    message.command = line.slice(position, nextspace);

    position = nextspace + 1;

    // Skip any trailing whitespace.
    while (line.charCodeAt(position) === 32) {
        position++;
    }

    while (position < line.length) {
        nextspace = line.indexOf(" ", position);

        // If the character is a colon, we've got a trailing parameter.
        // At this point, there are no extra params, so we push everything
        // from after the colon to the end of the string, to the params array
        // and break out of the loop.
        if (line.charCodeAt(position) === 58) {
            message.params.push(line.slice(position + 1));
            break;
        }

        // If we still have some whitespace...
        if (nextspace !== -1) {
            // Push whatever's between the current position and the next
            // space to the params array.
            message.params.push(line.slice(position, nextspace));
            position = nextspace + 1;
            // Skip any trailing whitespace and continue looping.
            while (line.charCodeAt(position) === 32) {
                position++;
            }
            continue;
        }

        // If we don't have any more whitespace and the param isn't trailing,
        // push everything remaining to the params array.
        if (nextspace === -1) {
            message.params.push(line.slice(position));
            break;
        }
    }
    return message;
};

module.exports.IRCMessage = IRCMessage;
module.exports.parseMessage = parseMessage;
