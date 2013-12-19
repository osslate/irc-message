Message = require "../"
vows = require "vows"
assert = require "assert"

vows.describe("irc-message #toString()").addBatch(
  "Invoking #toString() on a parsed message":
    "with prefix, command and two parameters":
      topic: Message ":expr!textual@213.233.jgs.m PRIVMSG #launch :JeffA: go ahead and do another multi line message"

      "should yield exact same raw line": (topic) ->
        assert.equal topic.toString(), ":expr!textual@213.233.jgs.m PRIVMSG #launch :JeffA: go ahead and do another multi line message"

).export(module)