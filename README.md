# semver-loose
loose precision matching on semvers

## usage

example:

    var semverLoose = require('semver-loose')

    semverLoose.match('1.x', '1.0.3')
    // => true

    var isMatch = semverLoose.match('1.4+')
    isMatch('1.3.3')
    // => false
    isMatch('1.4')
    // => true
    isMatch('1.8.2')
    // => true
    isMatch('2.0')
    // => false

Matching patterns are simpler (albeit less expressive) than npm's [semver](https://npmjs.org/package/semver) matcher.

Patterns can be specified with any precision:

    1     // major only
    1.x   // major with explict wildcard (equivalent to above)
    1.2   // major and minor
    1.2.x // major and minor with wildcard (equivalent to above)
    1.4.2 // explicit (exact match)

Minimum version ranges can be specified by adding a `+` to the segment, as in `1.2+`. This will match earlier segments exactly, and the current segment with any number greater than or equal to the number specified.

    0.2+  // for this pattern
    0.2.1 // would match
    0.4.9 // would match
    1.2.0 // would not match

Use your head. In practice, you'll only want to use gte matching on minor versions. If you're worried about patch versions, you probably want to use exact matching.

If a tag is specified, it must be stringwise equal to match (although version numbers are still matched the same. This way, for example, release channels can be specified)

    1.x.x-foo // for this pattern
    1.0.4-foo // would match

    1.2+-foo   // with a gte segment
    1.5.0-foo  // would match
    1.1.0-foo  // would not match
    1.3.0      // would not match
    1.2.0-foo2 // would not match

See `~/test/test.js` for more examples.

## api
using (jsig notation)[https://github.com/jden/jsig]

### `match: (range: String, version: String) => Boolean`

may also be used curried: `match: (range: String) => (version: String) => Boolean`. Use curried if matching one version pattern against many possible versions.

Returns true if `version` satisfies `range`, otherwise false.


### `compare: (range: Semver, version: Semver) => Boolean`

Mostly you'll want to use `match`. But, if you happen to already have parsed `Semver`s, this function is strictly the comparison algorithm. Returns true if `version` satisfies `range`, otherwise false.

### `parse: (str) => Semver`

`Semver` is an object with the following properties:

    Semver: {
      major: Number?,
      minor: Number?,
      patch: Number?,
      tag: String?,
      gte: Boolean
    }

Corresponding to the respective segments as defined in the (semver spec)[http://semver.org/]

`gte` is true if the semver is a range and should match other semvers which are greater than or equal to itself.

### `sort: (a: Semver|String, b: Semver|String) => Number`

Returns a negative if `a` is before `b`, 0 if they are sorted equivalent, and positive if `a` is after `b`. May be used as a sort function with (`Array.sort`)[https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/sort]

Tags are ignored for the purpose of sorting. That is, `1.0.0-pre` is sort-wise equal to `1.0.0`.

## installation

    $ npm install semver-loose

## running the tests

From package root:

    $ npm install
    $ npm test

## contributors

jden <jason@denizac.org>

## license

(c) 2013 Agile Diagnosis, Inc. <hello@agilediagnosis.com>. See LICENSE.md