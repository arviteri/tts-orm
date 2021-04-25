// Test tools
import { describe, it } from 'mocha';
import { expect } from 'chai';

// tts-orm
import { checkProperty, Properties, Property, setProperty } from '../../../../src/orm/lib/property';

/**======================================
 * Unit Tests
 *=======================================*/

describe('Properties', function () {
    it('@checkProperty should properly check for property on properties', function () {
        const props: Properties = {};
        // test for non-existent property
        expect(checkProperty.bind(this, props, 'non_existent')).to.throw('Non-existent property on model properties.');

        // test for existing property
        const existing: Property = {
            member: 'existingProp',
            autoIncrements: false,
            nullable: true,
            parser: (value: any) => value, // eslint-disable-line
            caster: (value: any) => value, // eslint-disable-line
        };
        props['existing'] = existing;
        expect(checkProperty.bind(this, props, 'existing')).to.not.throw();
        expect(checkProperty(props, 'existing')).eql(existing);
    });

    it('@setProperty should properly set property on properties', function () {
        const props: Properties = {};
        const newProp: Property = {
            member: 'newProp',
            autoIncrements: false,
            nullable: true,
            parser: (value: any) => value, // eslint-disable-line
            caster: (value: any) => value, // eslint-disable-line
        };

        
        const updated: Properties = setProperty(props, 'new_prop', newProp);
        expect(updated).not.equal(props); // test reference equality
        expect(updated['new_prop']).not.equal(newProp); // test reference equality
        expect(updated['new_prop']).eql(newProp); // test value equality
    });
});