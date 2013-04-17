var chai = require('chai')
chai.should()

var sl = require('../index')

describe('semver-loose', function () {

  describe('match', function () {
    it('equivalent semvers', function () {

      sl.match('1', '1.2.3').should.equal(true)
      sl.match('1', '1.0.0').should.equal(true)
      sl.match('1', '2.0.0').should.equal(false)


      sl.match('1.2', '1.2.0').should.equal(true)
      sl.match('1.2', '1.2.1').should.equal(true)
      sl.match('1.2', '1.4.1').should.equal(false)

      sl.match('1.2.3', '1.2.3').should.equal(true)
      sl.match('1.0.1', '2.0.0').should.equal(false)
      sl.match('1.0.1', '1.0.0').should.equal(false)
      sl.match('1.0.1', '1.1.0').should.equal(false)

      sl.match('1.2.3-a', '1.2.3-a').should.equal(true)
      sl.match('2.0.0-a', '2.0.0-b').should.equal(false)

    })
    it('wildcards', function () {
      sl.match('1.x', '1.0.0').should.equal(true)
    })
    it('loose', function () {
      sl.match('1', '1.0.0').should.equal(true)
    })
    it('gte', function () {
      sl.match('1.2+', '1.2.0').should.equal(true)
      sl.match('1.2+', '1.2.5').should.equal(true)
      sl.match('1.2+', '1.3.0').should.equal(true)
      sl.match('1.2+', '1.3.4').should.equal(true)
      sl.match('1.2+', '1.1.999').should.equal(false)
      sl.match('1.2+', '2.4.0').should.equal(false)
      sl.match('3+','17').should.equal(true)
      sl.match('1.4+', '1.8.2').should.equal(true)
    })
    it('doesnt wildcard tags', function () {
      sl.match('1.0.0', '1.0.0-pre').should.equal(false)
    })
    it('can be curried', function () {
      var matcher = sl.match('1.x')
      matcher('1.0.5').should.equal(true)
      matcher('2.4.0').should.equal(false)
    })
  })

  describe('sort', function () {
    it('parsed semvers', function () {
      sl.sort(sl.parse('1.2'), sl.parse('1.2.1')).should.be.below(0)
      sl.sort(sl.parse('1.0.0'), sl.parse('1.2.1')).should.be.below(0)
      sl.sort(sl.parse('1.2.3'), sl.parse('2.2.1')).should.be.below(0)
      sl.sort(sl.parse('1.3.5'), sl.parse('1.3.7')).should.be.below(0)

      sl.sort(sl.parse('1.2'), sl.parse('1.2')).should.equal(0)
      sl.sort(sl.parse('1'), sl.parse('1.0.0')).should.equal(0)
      sl.sort(sl.parse('1.2.4'), sl.parse('1.2.4')).should.equal(0)

      sl.sort(sl.parse('0.4.5'), sl.parse('0.3.2')).should.be.above(0)
      sl.sort(sl.parse('1.8'), sl.parse('1.6.3')).should.be.above(0)
      sl.sort(sl.parse('1'), sl.parse('0.4.2')).should.be.above(0)
    })
    it('strings', function () {
      sl.sort('1.2', '1.2.1').should.be.below(0)
      sl.sort('1.0.0', '1.2.1').should.be.below(0)
      sl.sort('1.2.3', '2.2.1').should.be.below(0)
      sl.sort('1.3.5', '1.3.7').should.be.below(0)

      sl.sort('1.2', '1.2').should.equal(0)
      sl.sort('1', '1.0.0').should.equal(0)
      sl.sort('1.2.4', '1.2.4').should.equal(0)

      sl.sort('0.4.5', '0.3.2').should.be.above(0)
      sl.sort('1.8', '1.6.3').should.be.above(0)
      sl.sort('1', '0.4.2').should.be.above(0)

    })
  })

  describe('parse', function () {
    it('parses into an object', function () {
      sl.parse('5.4.3-21launch').should.deep.equal({
        major: 5,
        minor: 4,
        patch: 3,
        tag: '21launch',
        gte: -1
      })
    })

    it('parses gte for the highest segment ending with a plus sign', function () {
      sl.parse('1').gte.should.equal(-1)
      sl.parse('1+').gte.should.equal(0)
      sl.parse('1.4+').gte.should.equal(1)
      sl.parse('1.4.2+').gte.should.equal(2)
    })

    it('doesnt choke on numbers', function () {
      sl.parse(3)
    })

    it('doesnt choke on non-toStringables', function () {
      sl.parse(null)
    })

    it('parses numbers IFF a segment is a number', function () {
      sl.parse('1.0.x').should.deep.equal({
        major: 1,
        minor: 0,
        patch: undefined,
        tag: undefined,
        gte: -1
      })
      sl.parse('1.x').should.deep.equal({
        major: 1,
        minor: undefined,
        patch: undefined,
        tag: undefined,
        gte: -1
      })
      sl.parse('x').should.deep.equal({
        major: undefined,
        minor: undefined,
        patch: undefined,
        tag: undefined,
        gte: -1
      })
    })
  })

  describe('format', function () {

  })

  it('parses semvers', function () {

  })
})
