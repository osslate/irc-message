var assert = require('assert')
var ircMessage = require('./')
var parse = ircMessage.parse

describe('#parse()', function() {
    it('parses valid IRC messages', function() {
        var tests = {
            'FOO': {
                tags: {},
                prefix: null,
                command: 'FOO',
                params: []
            },
            ':test FOO': {
                tags: {},
                prefix: 'test',
                command: 'FOO',
                params: []
            },
            ':test FOO     ': {
                tags: {},
                prefix: 'test',
                command: 'FOO',
                params: []
            },
            ':test!me@test.ing PRIVMSG #Test :This is a test': {
                tags: {},
                prefix: 'test!me@test.ing',
                command: 'PRIVMSG',
                params: ['#Test', 'This is a test']
            },
            'PRIVMSG #Test :This is a test': {
                tags: {},
                prefix: null,
                command: 'PRIVMSG',
                params: ['#Test', 'This is a test']
            },
            ':test PRIVMSG foo :A string   with spaces   ': {
                tags: {},
                prefix: 'test',
                command: 'PRIVMSG',
                params: ['foo', 'A string   with spaces   ']
            },
            ':test     PRIVMSG    foo     :bar': {
                tags: {},
                prefix: 'test',
                command: 'PRIVMSG',
                params: ['foo', 'bar']
            },
            ':test FOO bar baz quux': {
                tags: {},
                prefix: 'test',
                command: 'FOO',
                params: ['bar', 'baz', 'quux']
            },
            'FOO bar baz quux': {
                tags: {},
                prefix: null,
                command: 'FOO',
                params: ['bar', 'baz', 'quux']
            },
            'FOO    bar      baz   quux': {
                tags: {},
                prefix: null,
                command: 'FOO',
                params: ['bar', 'baz', 'quux']
            },
            'FOO bar baz quux :This is a test': {
                tags: {},
                prefix: null,
                command: 'FOO',
                params: ['bar', 'baz', 'quux', 'This is a test']
            },
            ':test PRIVMSG #fo:oo :This is a test': {
                tags: {},
                prefix: 'test',
                command: 'PRIVMSG',
                params: ['#fo:oo', 'This is a test']
            },
            '@test=super;single :test!me@test.ing FOO bar baz quux :This is a test': {
                tags: {
                    test: 'super',
                    single: true
                },
                prefix: 'test!me@test.ing',
                command: 'FOO',
                params: ['bar', 'baz', 'quux', 'This is a test']
            }
        }

        Object.keys(tests).forEach(function(test) {
            var expected = tests[test]
            expected.raw = test
            var parsed = parse(test)
            assert.deepEqual(parsed, expected)
        })
    })
})

describe('#parserStream()', function() {
    var assertMsg = function(msg, tags, prefix, command, params) {
        assert.deepEqual(msg.tags, tags)
        assert.deepEqual(msg.prefix, prefix)
        assert.deepEqual(msg.command, command)
        assert.deepEqual(msg.params, params)
    }

    it('parses a single IRC message', function(done) {
        var stream = ircMessage.createStream()

        stream.once('data', function(m) {
            assertMsg(m, {}, 'user', 'HOW', ['are', 'you doing?'])
            done()
        })

        stream.write(':user HOW are :you doing?\r\n')
    })

    it('correctly buffers messages before parsing', function(done) {
        var stream = ircMessage.createStream()
        var gotFirst = false

        stream.on('data', function(m) {
            if (!gotFirst) {
                gotFirst = true
                return assertMsg(m, {}, 'user', 'HOW', ['are', 'you doing?'])
            }

            assertMsg(m, {}, null, 'ERROR', ['Link closed (bad!)'])
            done()
        })

        stream.write(':user H')
        stream.write('OW are :you doi')
        stream.write('ng?\r\nERROR :Link closed (bad!)')
        stream.write('\r\n')
    })

    it('converts valid time tags into Date objects', function(done) {
        var stream = ircMessage.createStream({ convertTimestamps: true })

        stream.once('data', function(m) {
            assert.ok(m.tags.time instanceof Date)
            done()
        })

        stream.write('@time=2012-05-21T23:32:12.419Z :some@user PRIVMSG #t :hi\r\n')
    })

    it('returns invalid date with bad time tag', function(done) {
        var stream = ircMessage.createStream({ convertTimestamps: true })

        stream.once('data', function(m) {
            assert.equal(m.tags.time.toString(), 'Invalid Date')
            done()
        })

        stream.write('@time=notvalid :some@user PRIVMSG #t :hi\r\n')
    })

    it('converts the prefix to an object', function(done) {
        var stream = ircMessage.createStream({ parsePrefix: true })

        stream.once('data', function(m) {
            assert.equal(m.prefix.isServer, false)
            done()
        })

        stream.write(':some!one@host PRIVMSG #t :hi\r\n')
    })
})
