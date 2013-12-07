Message = require "../"
vows = require "vows"
assert = require "assert"
should = require("chai").should()

vows.describe("irc-message parser/constructor").addBatch(
  "A parsed message":
    "with command only":
      topic: new Message "foo"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "shouldn't have a prefix": (topic) ->
        topic.prefix.should.be.empty
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have no parameters": (topic) ->
        topic.params.should.be.empty

    "with prerix, command":
      topic: new Message ":test foo"
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test'": (topic) ->
        topic.prefix.should.equal "test"
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have no parameters": (topic) ->
        topic.params.should.be.empty

    "with prerix, command and trailing space":
      topic: new Message ":test foo    "
      "shouldn't have tags": (topic) ->
        topic.tags.should.be.empty
      "should have a prefix of 'test'": (topic) ->
        topic.prefix.should.equal "test"
      "should have a command of 'FOO'": (topic) ->
        topic.command.should.equal "FOO"
      "should have no parameters": (topic) ->
        topic.params.should.be.empty

    "with prefix, command, middle, trailing parameter":
      topic: new Message ":test!me@test.ing PRIVMSG #Test :This is a test"
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
      topic: new Message "PRIVMSG #foo :This is a test"
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

    "prefix, command, one middle, trailing with spaces":
      topic: new Message ":test PRIVMSG foo :A string   with spaces   "
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

).export module