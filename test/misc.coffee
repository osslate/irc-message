Message = require "../"
vows = require "vows"
should = require("chai").should()

vows.describe("Utility methods").addBatch(
  "#prefixIsHostmask()":
    "when prefix is valid hostname":
      topic: Message ":test!test@something.com PRIVMSG #Test :Testing!"
      "should return `true`": (topic) ->
        topic.prefixIsHostmask().should.be.true

    "when prefix is invalid hostname":
      topic: Message ":127.0.0.1 PRIVMSG #Test :Testing!"
      "should return `false`": (topic) ->
        topic.prefixIsHostmask().should.be.false

  "#prefixIsServer()":
    "when prefix is valid server hostname":
      topic: Message ":127.0.0.1 NOTICE * :Looking up your hostname..."
      "should return `true`": (topic) ->
        topic.prefixIsServer().should.be.true

    "when prefix is invalid server hostname":
      topic: Message ":test!test@something.com NOTICE * :Looking up your hostname..."
      "should return `false`": (topic) ->
        topic.prefixIsServer().should.be.false

  "#parseHostmaskFromPrefix()":
    "when prefix is 'james!james@my.awesome-rdns.co'":
      topic: (Message ":james!baz@my.awesome-rdns.co PRIVMSG #test :Hello!").parseHostmaskFromPrefix()
      "should have property 'nickname' of 'james'": (topic) ->
        topic.nickname.should.equal "james"
      "should have property 'username' of 'baz'": (topic) ->
        topic.username.should.equal "baz"
      "should have property 'hostname' of 'my.awesome-rdns.co'": (topic) ->
        topic.hostname.should.equal "my.awesome-rdns.co"

    "when prefix is '127.0.0.1'":
      topic: (Message ":127.0.0.1 NOTICE * :Looking up your hostname...").parseHostmaskFromPrefix()
      "should return `null`": (topic) ->
        (topic == null).should.be.true
).export(module)

