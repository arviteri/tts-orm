// Test tools
import { describe, it } from 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model } from '../../../../src/orm/decorators/model';
import { checkDefinition, Definition } from '../../../../src/orm/lib/definition';

/**======================================
 *  Mock Models
 *=======================================*/

@Model()
class TestModelA {}

@Model({table: 'TestModelBs'})
class TestModelB {}

/**======================================
 * Unit Tests
 *=======================================*/

describe('@Model decorator', function () {
    // Uses TestModelA, TestModelB.
    it('should define the model definition', function () {
        // TestModelA
        const defA: Definition = checkDefinition(TestModelA, false);
        expect(defA).to.not.be.null;
        expect(defA).to.not.be.undefined;

        // TestModelB
        const defB: Definition = checkDefinition(TestModelB, false);
        expect(defB).to.not.be.null;
        expect(defB).to.not.be.undefined;
    });

    // Uses TestModelA, TestModelB.
    it('should define the table association', function () {
        // TestModelA
        const defA: Definition = checkDefinition(TestModelA, false);
        expect(defA.table).equal('TestModelA');

        // TestModelB
        const defB: Definition = checkDefinition(TestModelB, false);
        expect(defB.table).equal('TestModelBs');
    });
});