###
  irc-message
  Copyright (c) 2013 Fionn Kelleher. All rights reserved.
  Licensed under the BSD 2-Clause License (FreeBSD) - see LICENSE.md.
###

class IRCMessage
  constructor: (line) ->
    # Object containing any message tags.
    @tags = {}
    # Strings containing the message's prefix and command.
    @prefix = ""
    @command = ""
    # Any params (middle or trailing) will be pushed to this array.
    @params = []
    # position and nextspace are used by the parser as a reference.
    position = 0
    nextspace = 0

    # The first thing we check for is IRCv3.2 message tags.
    # http://ircv3.atheme.org/specification/message-tags-3.2

    if line.charAt(0) is "@"
      nextspace = line.indexOf " "
      return new Object if nextspace is -1
      # Tags are split by a semi colon.
      rawTags = line.slice(1, nextspace).split ";"

      for tag in rawTags
        # Tags delimited by an equals sign are key=value tags.
        # If there's no equals, we assign the tag a value of true.
        pair = tag.split "="
        @tags[pair[0]] = pair[1] or yes

      position = nextspace + 1

    # Skip any trailing whitespace.

    position++ while line.charAt(position) is " "

    # Extract the message's prefix if present. Prefixes are prepended
    # with a colon.

    if line.charAt(position) is ":"
      nextspace = line.indexOf " ", position

      # If there's nothing after the prefix, deem this message to be
      # invalid.
      return new Object if nextspace is -1
      @prefix = line.slice position + 1, nextspace
      position = nextspace + 1

      # Skip any trailing whitespace.
      position++ while line.charAt(position) is " "

    nextspace = line.indexOf " ", position

    # If there's no more whitespace left, extract everything from the
    # current position to the end of the string as the command.
    if nextspace is -1
      if line.length > position
        @command = line.slice position
        return
      else
        return

    # Else, the command is the current position up to the next space. After
    # that, we expect some parameters.

    @command = line.slice(position, nextspace)

    position = nextspace + 1

    # Skip any trailing whitespace.
    position++ while line.charAt(position) is " "

    while position < line.length
      nextspace = line.indexOf " ", position

      # If the character is a colon, we've got a trailing parameter.
      # At this point, there are no extra params, so we push everything
      # from after the colon to the end of the string, to the params array
      # and break out of the loop.
      if line.charAt(position) is ":"
        @params.push line.slice position + 1
        break

      # If we still have some whitespace...
      if nextspace isnt -1
        # Push whatever's between the current position and the next
        # space to the params array.
        @params.push line.slice position, nextspace
        position = nextspace + 1
        # Skip any trailing whitespace and continue looping.
        position++ while line.charAt(position) is " "
        continue

      # If we don't have any more whitespace and the param isn't trailing,
      # push everything remaining to the params array.
      if nextspace is -1
        @params.push line.slice position
        break

  toString: ->
    string = ""
    # Append any message tags if present.
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

  prefixIsHostmask: ->
    # This method determines whether or not the prefix is a hostmask.
    # A regular expression might be a better choice for this; at the
    # moment, it checks to see if the prefix contains an @ and an !,
    # so it's very lax.

    @prefix.indexOf("@") isnt -1 and
    @prefix.indexOf("!") isnt -1

  prefixIsServer: ->
    # This method determines whether or not the prefix is a server host.
    # Similarly to #prefixIsHostmask(), a regular expression would be a
    # wiser choice here.

    @prefix.indexOf("@") is -1 and
    @prefix.indexOf("!") is -1 and
    @prefix.indexOf(".") isnt -1

  parseHostmaskFromPrefix: ->
    # Simple method to parse the hostmask of the current prefix into an
    # object with nickname, username and hostname. Returns null if the
    # return value of #prefixIsHostmask() is false.
    if @prefixIsHostmask()
      [nickname, username, hostname] = @prefix.split /[!@]/
      return (
        nickname: nickname
        username: username
        hostname: hostname
      )
    else
      return null

Message = (line) ->
  # This was a little bit of a hack. This function takes in the raw
  # line and creates a new IRCMessage object with it. If the message
  # could not be successfully parsed, the constructor returns an empty
  # object. If the returned object has no keys, this function returns
  # null for error handling convenience. Else, the IRCMessage object
  # is returned.

  message = new IRCMessage line
  if Object.getOwnPropertyNames(message).length == 0
    return null
  else
    return message

exports = module.exports = Message
