// Test tools
import { describe, it } from 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model } from '../../../../src/orm/decorators/model';
import { Column } from '../../../../src/orm/decorators/column';
import { checkDefinition, Definition } from '../../../../src/orm/lib/definition';
import { checkProperty, Property } from '../../../../src/orm/lib/property';

/**======================================
 *  Mock Models
 *=======================================*/

@Model()
class TestModelA {
    @Column({primary: true, autoIncrements: true})
    declare id: number;
}

@Model()
class TestModelB {
    @Column({primary: true, name: '_a_'})
    declare a: string;

    @Column({primary: true, name: '_b_'})
    declare b: string;
    
    @Column({primary: true, name: '_c_'})
    declare c: string;

    @Column()
    declare d: string | null;
}

@Model()
class TestModelC {
    // Invalid primary, nullable combination.
    @Column({primary: true, nullable: true})
    declare id: number;

    @Column({nullable: false})
    declare a: string;
}

/**======================================
 * Unit Tests
 *=======================================*/

describe('@Column decorator', function () {
    // Uses TestModelA.
    it('should set a property value on the model definition', function () {
        const def: Definition = checkDefinition(TestModelA, false);
        const property: Property = checkProperty(def.properties, 'id');
        expect(property).to.not.be.undefined;
        expect(property).to.not.be.null;
    });

    // Uses TestModelA, TestModelB
    it('should properly parse the column name', function () {
        // Test that the class member name is used if no column name is provided.
        const defA: Definition = checkDefinition(TestModelA, false);
        const idProp: Property = checkProperty(defA.properties, 'id');
        expect(idProp).to.not.be.undefined;
        expect(idProp).to.not.be.null;

        const defB: Definition = checkDefinition(TestModelB, false);
        const dProp: Property = checkProperty(defB.properties, 'd');
        expect(dProp).to.not.be.undefined;
        expect(dProp).to.not.be.null;

        // Test that the provided column name is properly set on the property.
        const aProp: Property = checkProperty(defB.properties, '_a_');
        expect(aProp).to.not.be.undefined;
        expect(aProp).to.not.be.null;
    });

    // Uses TestModelB, TestModelC.
    it('should properly set the nullable field', function () {
        // Test that field `d` on TestModelB has a nullable property.
        const defB: Definition = checkDefinition(TestModelB, false);
        const dProp: Property = checkProperty(defB.properties, 'd');
        expect(dProp.nullable).equal(true);

        // Test that field `a` on TestModelC has a non-nullable property.
        const defC: Definition = checkDefinition(TestModelC, false);
        const aProp: Property = checkProperty(defC.properties, 'a');
        expect(aProp.nullable).equal(false);

        // Test that field `id` on TestModelC has a non-nullable property,
        // even though it's set to nullable (primary key).
        const idProp: Property = checkProperty(defC.properties, 'id');
        expect(idProp.nullable).equal(false);
    });

    // Uses TestModelB.
    it('should properly update the model definition\'s primaries', function () {
        const defA: Definition = checkDefinition(TestModelA, false);
        expect(defA.primaries).eql(['id']);

        const defB: Definition = checkDefinition(TestModelB, false);
        expect(defB.primaries).eql(['_a_', '_b_', '_c_']);
    });
});
