Message = require "../"
vows = require "vows"
should = require("chai").should()

vows.describe("Converting parsed messages to strings").addBatch(
  "#toString() on parsed message":
    "with command only":
      topic: Message "FOO"
      "should return 'FOO'": (topic) ->
        topic.toString().should.equal "FOO"

    "with prefix, command":
      topic: Message ":test FOO"
      "should return ':test FOO'": (topic) ->
        topic.toString().should.equal ":test FOO"

    "with prefix, command, middle, trailing parameter":
      topic: Message ":test!me@test.ing PRIVMSG #Test :This is a test"
      "should return ':test!me@test.ing PRIVMSG #Test :This is a test'": (topic) ->
        topic.toString().should.equal ":test!me@test.ing PRIVMSG #Test :This is a test"

    "with no prefix, command, middle, trailing with spaces":
      topic: Message "PRIVMSG #foo :This is a test"
      "should return 'PRIVMSG #foo :This is a test'": (topic) ->
        topic.toString().should.equal "PRIVMSG #foo :This is a test"

    "with multiple middle params, prefix":
      topic: Message ":test FOO bar baz quux"
      "should return ':test FOO bar baz quux'": (topic) ->
        topic.toString().should.equal ":test FOO bar baz quux"

    "with tags, prefix, command, middle params, trailing params":
      topic: Message "@test=super;single :test!me@test.ing FOO bar baz quux :This is a test"
      "should return '@test=super;single :test!me@test.ing FOO bar baz quux :This is a test'": (topic) ->
        topic.toString().should.equal "@test=super;single :test!me@test.ing FOO bar baz quux :This is a test"    

).export(module)