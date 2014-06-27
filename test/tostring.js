var ircmessage = require("../"),
    vows = require("vows"),
    should = require("chai").should();

vows.describe("Converting parsed messages to strings").addBatch({
    "#toString() on parsed message": {
        "with command only": {
            topic: (ircmessage.parseMessage("FOO")).toString(),

            "should return 'FOO'": function(topic) {
                return topic.should.equal("FOO");
            }
        },
        "with prefix, command": {
            topic: (ircmessage.parseMessage(":test FOO")).toString(),

            "should return ':test FOO'": function(topic) {
                return topic.should.equal(":test FOO");
            }
        },
        "with prefix, command, middle, trailing parameter": {
            topic: (ircmessage.parseMessage(":test!me@test.ing PRIVMSG #Test :This is a test")).toString(),

            "should return ':test!me@test.ing PRIVMSG #Test :This is a test'": function(topic) {
                return topic.should.equal(":test!me@test.ing PRIVMSG #Test :This is a test");
            }
        },
        "with no prefix, command, middle, trailing with spaces": {
            topic: (ircmessage.parseMessage("PRIVMSG #foo :This is a test")).toString(),

            "should return 'PRIVMSG #foo :This is a test'": function(topic) {
                return topic.should.equal("PRIVMSG #foo :This is a test");
            }
        },
        "with multiple middle params, prefix": {
            topic: (ircmessage.parseMessage(":test FOO bar baz quux")).toString(),

            "should return ':test FOO bar baz quux'": function(topic) {
                return topic.should.equal(":test FOO bar baz quux");
            }
        },
        "with tags, prefix, command, middle params, trailing params": {
            topic: (ircmessage.parseMessage("@test=super;single :test!me@test.ing FOO bar baz quux :This is a test")).toString(),

            "should return '@test=super;single :test!me@test.ing FOO bar baz quux :This is a test'": function(topic) {
                return topic.should.equal("@test=super;single :test!me@test.ing FOO bar baz quux :This is a test");
            }
        },
        "smiley face": {
            topic: (ircmessage.parseMessage("PRIVMSG #smiley-test ::)")).toString(),

            "should return 'PRIVMSG #smiley-test ::)": function(topic) {
                return topic.should.equal("PRIVMSG #smiley-test ::)");
            }
        }
    }
}).export(module);
