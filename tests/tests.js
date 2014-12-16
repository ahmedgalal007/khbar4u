/**
 * Created by ahmedgalal on 12/16/14.
 * Description: Ridiculous
 */

var should = require('should');
var assert = require('assert');

describe('Test Framework', function () {
    it('Should have mocha installed and running', function () {
        assert.equal(true, true);
    })
    it('Should have the should library installed and running for fluent testing', function () {
        true.should.eql(true);
    })
})