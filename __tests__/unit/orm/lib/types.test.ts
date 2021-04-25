// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { toBigInt, toBoolean, toFloat, toInt, toObject, toString } from '../../../../src/orm/lib/types';


/**======================================
 *  Unit Tests
 *=======================================*/

describe('Type Casting', function () {
    it('should properly cast to boolean', function () {
        // should be false
        expect(toBoolean(undefined)).equal(false);
        expect(toBoolean(null)).equal(false);
        expect(toBoolean({})).equal(false);
        expect(toBoolean(false)).equal(false);
        expect(toBoolean('false')).equal(false);
        expect(toBoolean(0)).equal(false);
        expect(toBoolean(0.0)).equal(false);
        expect(toBoolean(BigInt(0))).equal(false);

        // should be true
        expect(toBoolean(true)).equal(true);
        expect(toBoolean('true')).equal(true);
        expect(toBoolean(1)).equal(true);
        expect(toBoolean(1.0)).equal(true);
        expect(toBoolean(BigInt(1))).equal(true);
    });

    it('should properly cast to int', function () {
        // should be undefined
        expect(toInt(undefined)).equal(undefined);
        expect(toInt(null)).equal(undefined);
        expect(toInt({})).equal(undefined);
        expect(toInt('N0')).equal(undefined);
        expect(toInt('true')).equal(undefined);

        // should parse correctly
        expect(toInt('1')).equal(1);
        expect(toInt('1.1')).equal(1);
        expect(toInt(true)).equal(1);
        expect(toInt(false)).equal(0);
        expect(toInt(1.1)).equal(1);
        expect(toInt(BigInt(1))).equal(1);
    });

    it('should properly cast to float', function () {
        // should be undefined
        expect(toFloat(undefined)).equal(undefined);
        expect(toFloat(null)).equal(undefined);
        expect(toFloat({})).equal(undefined);
        expect(toFloat('N0')).equal(undefined);
        expect(toFloat('true')).equal(undefined);

        // should parse correctly
        expect(toFloat('1')).equal(1);
        expect(toFloat('1.1')).equal(1.1);
        expect(toFloat(true)).equal(1);
        expect(toFloat(false)).equal(0);
        expect(toFloat(1.1)).equal(1.1);
        expect(toFloat(BigInt(1))).equal(1);
    });

    it('should properly cast to BigInt', function () {
        // only checking undefined here since we can't test strict equal
        expect(toBigInt(undefined)).equal(undefined);
        expect(toBigInt(null)).equal(undefined);
        expect(toBigInt({})).equal(undefined);
    });

    it('should properly cast to string', function () {
        expect(toString(undefined)).equal('undefined');
        expect(toString(null)).equal('null');
        expect(toString('abc')).equal('abc');
        expect(toString(1)).equal('1');
        expect(toString(1.5)).equal('1.5');
        expect(toString({})).equal('{}');
        expect(toString([1,2,3])).equal('[1,2,3]');
        expect(toString(BigInt(123))).equal('123');
    });

    it ('should properly cast to object', function () {
        // should be undefined
        expect(toObject(undefined)).equal(undefined);
        expect(toObject('[[')).equal(undefined);
        expect(toObject('')).equal(undefined);

        expect(toObject(null)).equal(null);
        expect(toObject(1)).equal(1);
        expect(toObject(1.1)).equal(1.1);
        expect(toObject(1)).equal(1);
        expect(toObject('[1,2,3]')).eql([1,2,3]);
    });
});