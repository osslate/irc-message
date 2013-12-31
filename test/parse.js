var ircmessage = require("../"),
    vows = require("vows"),
    should = require("chai").should();

vows.describe("Message parsing").addBatch({
    "A parsed message": {
        "with command only": {
            topic: ircmessage.parseMessage("FOO"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "shouldn't have a prefix": function(topic) {
                return topic.prefix.should.be.empty;
            },
            "should have a command of 'FOO'": function(topic) {
                return topic.command.should.equal("FOO");
            },
            "should have no parameters": function(topic) {
                return topic.params.should.be.empty;
            }
        },
        "with prefix, command": {
            topic: ircmessage.parseMessage(":test FOO"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "should have a prefix of 'test'": function(topic) {
                return topic.prefix.should.equal("test");
            },
            "should have a command of 'FOO'": function(topic) {
                return topic.command.should.equal("FOO");
            },
            "should have no parameters": function(topic) {
                return topic.params.should.be.empty;
            }
        },
        "with prefix, command and trailing space": {
            topic: ircmessage.parseMessage(":test FOO    "),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "should have a prefix of 'test'": function(topic) {
                return topic.prefix.should.equal("test");
            },
            "should have a command of 'FOO'": function(topic) {
                return topic.command.should.equal("FOO");
            },
            "should have no parameters": function(topic) {
                return topic.params.should.be.empty;
            }
        },
        "with prefix, command, middle, trailing parameter": {
            topic: ircmessage.parseMessage(":test!me@test.ing PRIVMSG #Test :This is a test"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "should have a prefix of 'test!me@test.ing'": function(topic) {
                return topic.prefix.should.equal("test!me@test.ing");
            },
            "should have a command of 'PRIVMSG'": function(topic) {
                return topic.command.should.equal("PRIVMSG");
            },
            "should have 2 parameters": function(topic) {
                return topic.params.should.have.length(2);
            },
            "should have a first parameter of '#Test'": function(topic) {
                return topic.params[0].should.equal("#Test");
            },
            "should have a second parameter of 'This is a test'": function(topic) {
                return topic.params[1].should.equal("This is a test");
            }
        },
        "with no prefix, command, one middle, trailing with spaces": {
            topic: ircmessage.parseMessage("PRIVMSG #foo :This is a test"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "shouldn't have a prefix": function(topic) {
                return topic.prefix.should.be.empty;
            },
            "should have a command of 'PRIVMSG'": function(topic) {
                return topic.command.should.equal("PRIVMSG");
            },
            "should have 2 parameters": function(topic) {
                return topic.params.should.have.length(2);
            },
            "should have a first parameter of '#foo": function(topic) {
                return topic.params[0].should.equal("#foo");
            },
            "should have a second parameter of 'This is a test'": function(topic) {
                return topic.params[1].should.equal("This is a test");
            }
        },
        "with prefix, command, one middle, trailing with spaces": {
            topic: ircmessage.parseMessage(":test PRIVMSG foo :A string   with spaces   "),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "should have a prefix of 'test'": function(topic) {
                return topic.prefix.should.equal("test");
            },
            "should have a command of 'PRIVMSG'": function(topic) {
                return topic.command.should.equal("PRIVMSG");
            },
            "should have 2 parameters": function(topic) {
                return topic.params.should.have.length(2);
            },
            "should have have a first parameter of 'foo'": function(topic) {
                return topic.params[0].should.equal("foo");
            },
            "should have a second parameter of 'A string   with spaces   '": function(topic) {
                return topic.params[1].should.equal("A string   with spaces   ");
            }
        },
        "with extraneous spaces": {
            topic: ircmessage.parseMessage(":test     PRIVMSG    foo     :bar"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "should have a prefix of 'test'": function(topic) {
                return topic.prefix.should.equal("test");
            },
            "should have a command of 'PRIVMSG'": function(topic) {
                return topic.command.should.equal("PRIVMSG");
            },
            "should have two parameters": function(topic) {
                return topic.params.should.have.length(2);
            },
            "should have a first parameter of 'foo'": function(topic) {
                return topic.params[0].should.equal("foo");
            },
            "should have a second parameter of 'bar": function(topic) {
                return topic.params[1].should.equal("bar");
            }
        },
        "with multiple middle params, prefix": {
            topic: ircmessage.parseMessage(":test FOO bar baz quux"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "should have a prefix of 'test'": function(topic) {
                return topic.prefix.should.equal("test");
            },
            "should have a command of 'FOO'": function(topic) {
                return topic.command.should.equal("FOO");
            },
            "should have 3 parameters": function(topic) {
                return topic.params.should.have.length(3);
            },
            "should have first parameter of 'bar'": function(topic) {
                return topic.params[0].should.equal("bar");
            },
            "should have second parameter of 'baz'": function(topic) {
                return topic.params[1].should.equal("baz");
            },
            "should have third parameter of 'quux'": function(topic) {
                return topic.params[2].should.equal("quux");
            }
        },
        "with multiple middle params, no prefix": {
            topic: ircmessage.parseMessage("FOO bar baz quux"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "shouldn't have a prefix": function(topic) {
                return topic.prefix.should.be.empty;
            },
            "should have a command of 'FOO'": function(topic) {
                return topic.command.should.equal("FOO");
            },
            "should have 3 parameters": function(topic) {
                return topic.params.should.have.length(3);
            },
            "should have first parameter of 'bar'": function(topic) {
                return topic.params[0].should.equal("bar");
            },
            "should have second parameter of 'baz'": function(topic) {
                return topic.params[1].should.equal("baz");
            },
            "should have third parameter of 'quux'": function(topic) {
                return topic.params[2].should.equal("quux");
            }
        },
        "with multiple middle params, extraneous spaces": {
            topic: ircmessage.parseMessage("FOO   bar   baz   quux"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "shouldn't have a prefix": function(topic) {
                return topic.prefix.should.be.empty;
            },
            "should have a command of 'FOO'": function(topic) {
                return topic.command.should.equal("FOO");
            },
            "should have 3 parameters": function(topic) {
                return topic.params.should.have.length(3);
            },
            "should have first parameter of 'bar'": function(topic) {
                return topic.params[0].should.equal("bar");
            },
            "should have second parameter of 'baz'": function(topic) {
                return topic.params[1].should.equal("baz");
            },
            "should have third parameter of 'quux'": function(topic) {
                return topic.params[2].should.equal("quux");
            }
        },
        "with multiple middle params, trailing params": {
            topic: ircmessage.parseMessage("FOO bar baz quux :This is a test"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "shouldn't have a prefix": function(topic) {
                return topic.prefix.should.be.empty;
            },
            "should have a command of 'FOO'": function(topic) {
                return topic.command.should.equal("FOO");
            },
            "should have 4 parameters": function(topic) {
                return topic.params.should.have.length(4);
            },
            "should have first parameter of 'bar'": function(topic) {
                return topic.params[0].should.equal("bar");
            },
            "should have second parameter of 'baz'": function(topic) {
                return topic.params[1].should.equal("baz");
            },
            "should have third parameter of 'quux'": function(topic) {
                return topic.params[2].should.equal("quux");
            },
            "should have a fourth parameter of 'This is a test'": function(topic) {
                return topic.params[3].should.equal("This is a test");
            }
        },
        "with prefix, middle params containing colons": {
            topic: ircmessage.parseMessage(":test PRIVMSG #fo:oo :This is a test"),

            "shouldn't have tags": function(topic) {
                return topic.tags.should.be.empty;
            },
            "should have a prefix of 'test'": function(topic) {
                return topic.prefix.should.equal("test");
            },
            "should have a command of 'PRIVMSG'": function(topic) {
                return topic.command.should.equal("PRIVMSG");
            },
            "should have 2 parameters": function(topic) {
                return topic.params.should.have.length(2);
            },
            "should have first parameter of '#fo:oo'": function(topic) {
                return topic.params[0].should.equal("#fo:oo");
            },
            "should have second parameter of 'This is a test'": function(topic) {
                return topic.params[1].should.equal("This is a test");
            }
        },
        "with tags, prefix, command, middle params, trailing params": {
            topic: ircmessage.parseMessage("@test=super;single :test!me@test.ing FOO bar baz quux :This is a test"),

            "should have two tags": function(topic) {
                return Object.keys(topic.tags).should.have.length(2);
            },
            "should have two tags of 'test' and 'single'": function(topic) {
                return topic.tags.should.have.keys(["test", "single"]);
            },
            "should have first tag value of 'super'": function(topic) {
                return topic.tags.test.should.equal("super");
            },
            "should have second tag value of literal 'true'": function(topic) {
                return topic.tags.single.should.equal(true);
            },
            "should have a prefix of 'test!me@test.ing'": function(topic) {
                return topic.prefix.should.equal("test!me@test.ing");
            },
            "should have a command of 'FOO'": function(topic) {
                return topic.command.should.equal("FOO");
            },
            "should have 4 parameters": function(topic) {
                return topic.params.should.have.length(4);
            },
            "should have first parameter of 'bar'": function(topic) {
                return topic.params[0].should.equal("bar");
            },
            "should have second parameter of 'baz'": function(topic) {
                return topic.params[1].should.equal("baz");
            },
            "should have third parameter of 'quux'": function(topic) {
                return topic.params[2].should.equal("quux");
            },
            "should have a fourth parameter of 'This is a test'": function(topic) {
                return topic.params[3].should.equal("This is a test");
            }
        }
    }
}).export(module);
