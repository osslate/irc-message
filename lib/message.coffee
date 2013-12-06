###
  irc-message
  Copyright (c) 2013 Fionn Kelleher. All rights reserved.
  Licensed under the BSD 2-Clause License (FreeBSD) - see LICENSE.md.
###

class Message
  constructor: (line) ->
    @tags = {}
    @prefix = ""
    @command = ""
    @params = []
    position = 0
    nextspace = 0

    if line.charAt(0) is "@"
      nextspace = line.indexOf " "
      throw new Error "Expected prefix; malformed IRC message." if nextspace is -1
      rawTags = line.slice(1, nextspace).split ";"

      for tag in rawTags
        pair = tag.split "="
        @tags[pair[0]] = pair[1] or yes

      position = nextspace + 1

    position++ while line.charAt(position) is " "

    if line.charAt(position) is ":"
      nextspace = line.indexOf " ", position
      throw new Error "Expected command; malformed IRC message." if nextspace is -1
      @prefix = line.slice position + 1, nextspace
      position = nextspace + 1
      position++ while line.charAt(position) is " "

    nextspace = line.indexOf " ", position

    if nextspace is -1
      if line.length > position
        @command = line.slice(position)
        return
      else return

    @command = line.slice(position, nextspace)

    position = nextspace + 1
    position++ while line.charAt(position) is " "

    while position < line.length
      nextspace = line.indexOf " ", position
      if line.charAt(position) is ":"
        @params.push line.slice position + 1
        break

      if nextspace isnt -1
        @params.push line.slice position, nextspace
        position = nextspace + 1
        position++ while line.charAt(position) is " "
        continue

      if nextspace is -1
        @params.push line.slice position
        break
    return

  toString: ->
    string = ""
    if Object.keys(@tags).length isnt 0
      string += "@"
      for tag, value of @tags
        if value isnt true
          string += "#{tag}=#{value};"
        else string += "#{tag};"
      string = string.slice(0, -1) + " "

    if @prefix.length isnt 0
      string += ":#{@prefix} "

    if @command.length isnt 0
      string += "#{@command} "

    if @params.length isnt 0
      for param in @params
        if param.indexOf(" ") is -1
          string += "#{param} "
        else
          string += ":#{param} "

    string = string.slice 0, -1
    return string

  prefixIsHostmask: -> (@prefix.indexOf("@") isnt -1 and @prefix.indexOf("!") isnt -1)
  prefixIsServer: -> (@prefix.indexOf("@") is -1 and @prefix.indexOf("!") is -1 and @prefix.indexOf(".") isnt -1)
  parseHostmaskFromPrefix: ->
    if @prefixIsHostmask
      [nickname, username, hostname] = @prefix.split /[!@]/
      return (
        nickname: nickname
        username: username
        hostname: hostname
      )
    else throw new Error "Prefix is not a parsable hostmask."

exports = module.exports = Message
