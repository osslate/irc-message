Message = require "../"
vows = require "vows"
assert = require "assert"

vows.describe("irc-message #toString()").addBatch(
  "A parsed message":
    "representing a PRIVMSG":
      topic: new Message ":expr!textual@213.233.jgs.m PRIVMSG #launch :JeffA: go ahead and do another multi line message"

      "has a prefix of expr!textual@213.233.jgs.m": (topic) ->
        assert.equal topic.prefix, "expr!textual@213.233.jgs.m"

      "has a command of PRIVMSG": (topic) ->
        assert.equal topic.command, "PRIVMSG"

      "has a first parameter of #launch": (topic) ->
        assert.equal topic.params[0], "#launch"

      "has a second parameter of JeffA: go ahead and do another multi line message": (topic) ->
        assert.equal topic.params[1], "JeffA: go ahead and do another multi line message"

).export(module)