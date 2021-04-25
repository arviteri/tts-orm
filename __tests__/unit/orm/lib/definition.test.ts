// Test tools
import { describe, it } from 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model } from '../../../../src/orm/decorators/model';
import { checkDefinition, Definition, DEFINITION_MEMBER, setDefinition } from '../../../../src/orm/lib/definition';

/**======================================
 *  Mock Models
 *=======================================*/

class TestModelA {}

@Model()
class TestModelB {}

class TestModelC {}

/**======================================
 * Unit Tests
 *=======================================*/

describe('Definition', function () {
    // Uses TestModelA, TestModelB.
    it('@checkDefinition should properly check for definition on class', function () {
        expect(checkDefinition.bind(this, TestModelA, false)).to.throw('Non-existent model definition.');
        expect(checkDefinition.bind(this, TestModelB, false)).to.not.throw();

        const defA: Definition = checkDefinition(TestModelA, true);
        const _const: any = TestModelA; // eslint-disable-line
        expect(_const[DEFINITION_MEMBER]).eql(defA);
    });

    // Uses TestModelC.
    it('@setDefinition should properly set definition on class', function () {
        const def: Definition = {
            table: 'MyTable',
            primaries: [],
            properties: {},
            hydrator: (row: any) => ({}) // eslint-disable-line
        };

        setDefinition(TestModelC, def);
        
        // Check against constructor property.
        const _const: any = TestModelC; // eslint-disable-line
        expect(_const[DEFINITION_MEMBER]).not.equal(def); // test reference equality
        expect(_const[DEFINITION_MEMBER]).eql(def); // test value equality

        // Check against returned from checkDefinition.
        const copy: Definition = checkDefinition(TestModelC, false);
        expect(copy).not.equal(def); // test reference equality
        expect(copy).eql(def); // test value equality
    });
});