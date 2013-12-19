Message = require "../"
vows = require "vows"
assert = require "assert"
should = require("chai").should()

vows.describe("Message parsing").addBatch(
  "A parsed message":
    "with command only":
      topic: Message "FOO"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "shouldn't have a prefix": (topic) ->
        topic.prefix.should.be.empty
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have no parameters": (topic) ->
        topic.params.should.be.empty

    "with prefix, command":
      topic: Message ":test FOO"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test'": (topic) ->
        topic.prefix.should.equal "test"
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have no parameters": (topic) ->
        topic.params.should.be.empty

    "with prefix, command and trailing space":
      topic: Message ":test FOO    "
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test'": (topic) ->
        topic.prefix.should.equal "test"
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have no parameters": (topic) ->
        topic.params.should.be.empty

    "with prefix, command, middle, trailing parameter":
      topic: Message ":test!me@test.ing PRIVMSG #Test :This is a test"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test!me@test.ing'": (topic) ->
        topic.prefix.should.equal "test!me@test.ing"
      "should have a command of 'PRIVMSG'": (topic) ->
        topic.command.should.equal "PRIVMSG"
      "should have 2 parameters": (topic) ->
        topic.params.should.have.length 2
      "should have a first parameter of '#Test'": (topic) ->
        topic.params[0].should.equal "#Test"
      "should have a second parameter of 'This is a test'": (topic) ->
        topic.params[1].should.equal "This is a test"

    "with no prefix, command, one middle, trailing with spaces":
      topic: Message "PRIVMSG #foo :This is a test"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "shouldn't have a prefix": (topic) ->
        topic.prefix.should.be.empty
      "should have a command of 'PRIVMSG'": (topic) ->
        topic.command.should.equal "PRIVMSG"
      "should have 2 parameters": (topic) ->
        topic.params.should.have.length 2
      "should have a first parameter of '#foo": (topic) ->
        topic.params[0].should.equal "#foo"
      "should have a second parameter of 'This is a test'": (topic) ->
        topic.params[1].should.equal "This is a test"

    "with prefix, command, one middle, trailing with spaces":
      topic: Message ":test PRIVMSG foo :A string   with spaces   "
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test'": (topic) ->
        topic.prefix.should.equal "test"
      "should have a command of 'PRIVMSG'": (topic) ->
        topic.command.should.equal "PRIVMSG"
      "should have 2 parameters": (topic) ->
        topic.params.should.have.length 2
      "should have have a first parameter of 'foo'": (topic) ->
        topic.params[0].should.equal "foo"
      "should have a second parameter of 'A string   with spaces   '": (topic) ->
        topic.params[1].should.equal "A string   with spaces   "

    "with extraneous spaces":
      topic: Message ":test     PRIVMSG    foo     :bar"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test'": (topic) ->
        topic.prefix.should.equal "test"
      "should have a command of 'PRIVMSG'": (topic) ->
        topic.command.should.equal "PRIVMSG"
      "should have two parameters": (topic) ->
        topic.params.should.have.length 2
      "should have a first parameter of 'foo'": (topic) ->
        topic.params[0].should.equal "foo"
      "should have a second parameter of 'bar": (topic) ->
        topic.params[1].should.equal "bar"

    "with multiple middle params, prefix":
      topic: Message ":test FOO bar baz quux"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test'": (topic) ->
        topic.prefix.should.equal "test"
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have 3 parameters": (topic) ->
        topic.params.should.have.length 3
      "should have first parameter of 'bar'": (topic) ->
        topic.params[0].should.equal "bar"
      "should have second parameter of 'baz'": (topic) ->
        topic.params[1].should.equal "baz"
      "should have third parameter of 'quux'": (topic) ->
        topic.params[2].should.equal "quux"

    "with multiple middle params, no prefix":
      topic: Message "FOO bar baz quux"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "shouldn't have a prefix": (topic) ->
        topic.prefix.should.be.empty
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have 3 parameters": (topic) ->
        topic.params.should.have.length 3
      "should have first parameter of 'bar'": (topic) ->
        topic.params[0].should.equal "bar"
      "should have second parameter of 'baz'": (topic) ->
        topic.params[1].should.equal "baz"
      "should have third parameter of 'quux'": (topic) ->
        topic.params[2].should.equal "quux"

    "with multiple middle params, extraneous spaces":
      topic: Message "FOO   bar   baz   quux"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "shouldn't have a prefix": (topic) ->
        topic.prefix.should.be.empty
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have 3 parameters": (topic) ->
        topic.params.should.have.length 3
      "should have first parameter of 'bar'": (topic) ->
        topic.params[0].should.equal "bar"
      "should have second parameter of 'baz'": (topic) ->
        topic.params[1].should.equal "baz"
      "should have third parameter of 'quux'": (topic) ->
        topic.params[2].should.equal "quux"

    "with multiple middle params, trailing params":
      topic: Message "FOO bar baz quux :This is a test"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "shouldn't have a prefix": (topic) ->
        topic.prefix.should.be.empty
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have 4 parameters": (topic) ->
        topic.params.should.have.length 4
      "should have first parameter of 'bar'": (topic) ->
        topic.params[0].should.equal "bar"
      "should have second parameter of 'baz'": (topic) ->
        topic.params[1].should.equal "baz"
      "should have third parameter of 'quux'": (topic) ->
        topic.params[2].should.equal "quux"
      "should have a fourth parameter of 'This is a test'": (topic) ->
        topic.params[3].should.equal "This is a test"

    "with prefix, middle params containing colons":
      topic: Message ":test PRIVMSG #fo:oo :This is a test"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test'": (topic) ->
        topic.prefix.should.equal "test"
      "should have a command of 'PRIVMSG'": (topic) ->
        topic.command.should.equal "PRIVMSG"
      "should have 2 parameters": (topic) ->
        topic.params.should.have.length 2
      "should have first parameter of '#fo:oo'": (topic) ->
        topic.params[0].should.equal "#fo:oo"
      "should have second parameter of 'This is a test'": (topic) ->
        topic.params[1].should.equal "This is a test"

    "with tags, prefix, command, middle params, trailing params":
      topic: Message "@test=super;single :test!me@test.ing FOO bar baz quux :This is a test"
      "should have two tags": (topic) ->
        Object.keys(topic.tags).should.have.length 2
      "should have two tags of 'test' and 'single'": (topic) ->
        topic.tags.should.have.keys ["test", "single"]
      "should have first tag value of 'super'": (topic) ->
        topic.tags["test"].should.equal "super"
      "should have second tag value of literal 'true'": (topic) ->
        topic.tags["single"].should.equal true
      "should have a prefix of 'test!me@test.ing'": (topic) ->
        topic.prefix.should.equal "test!me@test.ing"
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have 4 parameters": (topic) ->
        topic.params.should.have.length 4
      "should have first parameter of 'bar'": (topic) ->
        topic.params[0].should.equal "bar"
      "should have second parameter of 'baz'": (topic) ->
        topic.params[1].should.equal "baz"
      "should have third parameter of 'quux'": (topic) ->
        topic.params[2].should.equal "quux"
      "should have a fourth parameter of 'This is a test'": (topic) ->
        topic.params[3].should.equal "This is a test"
).export module