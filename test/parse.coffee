Message = require "../"
vows = require "vows"
assert = require "assert"

vows.describe("irc-message parser/constructor").addBatch(
  "A parsed message":
    "representing a PRIVMSG":
      topic: new Message ":expr!textual@213.233.jgs.m PRIVMSG #launch :JeffA: go ahead and do another multi line message"

      "has a prefix of 'expr!textual@213.233.jgs.m'": (topic) ->
        assert.equal topic.prefix, "expr!textual@213.233.jgs.m"
      "has a command of PRIVMSG": (topic) ->
        assert.equal topic.command, "PRIVMSG"
      "has a first parameter of '#launch'": (topic) ->
        assert.equal topic.params[0], "#launch"
      "has a second parameter of 'JeffA: go ahead and do another multi line message'": (topic) ->
        assert.equal topic.params[1], "JeffA: go ahead and do another multi line message"

    "representing an RPL_WELCOME (001) message":
      topic: new Message ":calvino.freenode.net 001 testnick :Welcome to the freenode Internet Relay Chat Network testnick"

      "has a prefix of 'calvino.freenode.net'": (topic) ->
        assert.equal topic.prefix, "calvino.freenode.net"
      "has a command of '001'": (topic) ->
        assert.equal topic.command, "001"
      "has a first parameter of 'testnick'": (topic) ->
        assert.equal topic.params[0], "testnick"
      "has a second parameter of 'Welcome to the freenode Internet Relay Chat Network testnick'": (topic) ->
        assert.equal topic.params[1], "Welcome to the freenode Internet Relay Chat Network testnick"

    "with message-tags":
      topic: new Message "@time=2013-06-30T23:59:60.419Z;test :test!test@127.0.0.1 SOMECMD :testing, param"

      "has two tags": (topic) ->
        assert.equal Object.keys(topic.tags).length, 2
      "has a first tag of `time` with value '2013-06-30T23:59:60.419Z'": (topic) ->
        assert.equal topic.tags.time, "2013-06-30T23:59:60.419Z"
      "has a second tag of `test` with value `true`": (topic) ->
        assert.equal topic.tags.test, true
      "has a prefix of 'test!test@127.0.0.1'": (topic) ->
        assert.equal topic.prefix, "test!test@127.0.0.1"
      "has a command of 'SOMECMD'": (topic) ->
        assert.equal topic.command, "SOMECMD"
      "has one parameter": (topic) ->
        assert.equal topic.params.length, 1
      "has a first parameter of 'testing, param'": (topic) ->
        assert.equal topic.params[0], "testing, param"

    "with multiple parameters":
      topic: new Message ":test!test@127.0.0.1 SOMECMD hello test multi param test test :hello, world!"

      "has seven parameters": (topic) ->
        assert.equal topic.params.length, 7

    "with excess whitespace between parameters":
      topic: new Message ":test!test@127.0.0.1 SOMECMD here    is   some   excess   whitespace   :in my command"

      "has six parameters": (topic) ->
        assert.equal topic.params.length, 6
      "has no excess whitespace within the first five parameters": (topic) ->
        for param in topic.params.slice(0, 5)
          assert.equal param.indexOf(" "), -1

    "with no prefix":
      topic: new Message "SOMECMD :testing, param"

      "has a prefix length of 0": (topic) ->
        assert.equal topic.prefix.length, 0

    "with tags and no prefix":
      topic: new Message "@time=2013-06-30T23:59:60.419Z;test SOMECMD :testing, param"

      "has two tags": (topic) ->
        assert.equal Object.keys(topic.tags).length, 2
      "has a prefix length of 0": (topic) ->
        assert.equal topic.prefix.length, 0

).export module