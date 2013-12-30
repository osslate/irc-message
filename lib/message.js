/*
    irc-message
    Copyright (c) 2013 Fionn Kelleher. All rights reserved.
    Licensed under the BSD 2-Clause License (FreeBSD) - see LICENSE.md.
*/

var IRCMessage, Message;

IRCMessage = function(line) {
    var nextspace, pair, position, rawTags, tag, _i, _len;
    // Object containing any message tags.
    this.tags = {};
    // Strings containing the message's prefix and command.
    this.prefix = "";
    this.command = "";
    // Any params (middle or trailing) will be pushed to this array.
    this.params = [];
    // position and nextspace are used by the parser as a reference.
    position = 0;
    nextspace = 0;

    // The first thing we check for is IRCv3.2 message tags.
    // http://ircv3.atheme.org/specification/message-tags-3.2

    if (line.charAt(0) === "@") {
        nextspace = line.indexOf(" ");
        if (nextspace === -1) {
            return new Object;
        }
        // Tags are split by a semi colon.
        rawTags = line.slice(1, nextspace).split(";");
        for (_i = 0, _len = rawTags.length; _i < _len; _i++) {
            // Tags delimited by an equals sign are key=value tags.
            // If there's no equals, we assign the tag a value of true.
            tag = rawTags[_i];
            pair = tag.split("=");
            this.tags[pair[0]] = pair[1] || true;
        }
        position = nextspace + 1;
    }

    // Skip any trailing whitespace.
    while (line.charAt(position) === " ") {
        position++;
    }

    // Extract the message's prefix if present. Prefixes are prepended
    // with a colon.

    if (line.charAt(position) === ":") {
        nextspace = line.indexOf(" ", position);
        // If there's nothing after the prefix, deem this message to be
        // malformed.
        if (nextspace === -1) {
            return new Object;
        }
        this.prefix = line.slice(position + 1, nextspace);
        position = nextspace + 1;
        // Skip any trailing whitespace.
        while (line.charAt(position) === " ") {
            position++;
        }
    }

    nextspace = line.indexOf(" ", position);

    // If there's no more whitespace left, extract everything from the
    // current position to the end of the string as the command.
    if (nextspace === -1) {
        if (line.length > position) {
            this.command = line.slice(position);
            return;
        } else {
            return;
        }
    }

    // Else, the command is the current position up to the next space. After
    // that, we expect some parameters.
    this.command = line.slice(position, nextspace);

    position = nextspace + 1;

    // Skip any trailing whitespace.
    while (line.charAt(position) === " ") {
        position++;
    }

    while (position < line.length) {
        nextspace = line.indexOf(" ", position);

        // If the character is a colon, we've got a trailing parameter.
        // At this point, there are no extra params, so we push everything
        // from after the colon to the end of the string, to the params array
        // and break out of the loop.
        if (line.charAt(position) === ":") {
            this.params.push(line.slice(position + 1));
            break;
        }

        // If we still have some whitespace...
        if (nextspace !== -1) {
            // Push whatever's between the current position and the next
            // space to the params array.
            this.params.push(line.slice(position, nextspace));
            position = nextspace + 1;
            // Skip any trailing whitespace and continue looping.
            while (line.charAt(position) === " ") {
                position++;
            }
            continue;
        }

        // If we don't have any more whitespace and the param isn't trailing,
        // push everything remaining to the params array.
        if (nextspace === -1) {
            this.params.push(line.slice(position));
            break;
        }
    }
    return;
}

IRCMessage.prototype.toString = function() {
    var param, string, tag, value, _i, _len, _ref, _ref1;
    string = "";
    // Append any message tags if present.
    if (Object.keys(this.tags).length !== 0) {
        string += "@";
        _ref = this.tags;
        for (tag in _ref) {
            value = _ref[tag];
            if (value !== true) {
                string += "" + tag + "=" + value + ";";
            } else {
                string += "" + tag + ";";
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
        _ref1 = this.params;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            param = _ref1[_i];
            if (param.indexOf(" ") === -1) {
                string += "" + param + " ";
            } else {
                string += ":" + param + " ";
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
    var hostname, nickname, username, _ref;
    if (this.prefixIsHostmask()) {
        _ref = this.prefix.split(/[!@]/), nickname = _ref[0], username = _ref[1], hostname = _ref[2];
        return {
            nickname: nickname,
            username: username,
            hostname: hostname
        };
    } else {
        return null;
    }
};

Message = function(line) {
    // This was a little bit of a hack. This function takes in the raw
    // line and creates a new IRCMessage object with it. If the message
    // could not be successfully parsed, the constructor returns an empty
    // object. If the returned object has no keys, this function returns
    // null for error handling convenience. Else, the IRCMessage object
    // is returned.
    var message;
    message = new IRCMessage(line);
    if (Object.getOwnPropertyNames(message).length === 0) {
        return null;
    } else {
        return message;
    }
};

module.exports = Message;
