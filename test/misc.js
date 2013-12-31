var ircmessage = require("../"),
    vows = require("vows"),
    should = require("chai").should();

vows.describe("Utility methods").addBatch({
    "#prefixIsHostmask()": {
        "when prefix is valid hostname": {
            topic: ircmessage.parseMessage(":test!test@something.com PRIVMSG #Test :Testing!"),

            "should return `true`": function(topic) {
                return topic.prefixIsHostmask().should.be["true"];
            }
        },
        "when prefix is invalid hostname": {
            topic: ircmessage.parseMessage(":127.0.0.1 PRIVMSG #Test :Testing!"),
            "should return `false`": function(topic) {
                return topic.prefixIsHostmask().should.be["false"];
            }
        }
    },
    "#prefixIsServer()": {
        "when prefix is valid server hostname": {
            topic: ircmessage.parseMessage(":127.0.0.1 NOTICE * :Looking up your hostname..."),

            "should return `true`": function(topic) {
                return topic.prefixIsServer().should.be["true"];
            }
        },
        "when prefix is invalid server hostname": {
            topic: ircmessage.parseMessage(":test!test@something.com NOTICE * :Looking up your hostname..."),

            "should return `false`": function(topic) {
                return topic.prefixIsServer().should.be["false"];
            }
        }
    },
    "#parseHostmaskFromPrefix()": {
        "when prefix is 'james!james@my.awesome-rdns.co'": {
            topic: (ircmessage.parseMessage(":james!baz@my.awesome-rdns.co PRIVMSG #test :Hello!")).parseHostmaskFromPrefix(),

            "should have property 'nickname' of 'james'": function(topic) {
                return topic.nickname.should.equal("james");
            },
            "should have property 'username' of 'baz'": function(topic) {
                return topic.username.should.equal("baz");
            },
            "should have property 'hostname' of 'my.awesome-rdns.co'": function(topic) {
                return topic.hostname.should.equal("my.awesome-rdns.co");
            }
        },
        "when prefix is '127.0.0.1'": {
            topic: (ircmessage.parseMessage(":127.0.0.1 NOTICE * :Looking up your hostname...")).parseHostmaskFromPrefix(),
            
            "should return `null`": function(topic) {
                return (topic === null).should.be["true"];
            }
        }
    }
}).export(module);
