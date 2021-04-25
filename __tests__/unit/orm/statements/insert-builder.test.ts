// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model } from '../../../../src/orm/decorators/model';
import { Column } from '../../../../src/orm/decorators/column';
import { InsertBuilder } from '../../../../src/orm/statements/builder/insert-builder';
import { toString, toInt } from '../../../../src/orm/lib/types';

/**======================================
 *  Mock Models
 *=======================================*/

@Model({table: 'People'})
class Person {
    @Column({primary: true, autoIncrements: true})
    declare id: number;

    @Column()
    declare name: string;

    @Column()
    declare age: number;

    @Column()
    declare bio: string;

    @Column({nullable: false})
    declare occupation: string;
}

@Model({table: 'Cars'})
class Car {
    @Column({primary: true})
    declare make: string;

    @Column({primary: true})
    declare model: string;

    @Column({primary: true, parser: toString, caster: toInt})
    declare year: string;

    @Column()
    declare color: string;
}
 
/**======================================
 * Unit Tests
 *=======================================*/

describe('Insert statement', function () {
    it('should create a valid insert statement', function () {
        const p = new Person();
        p.name = 'John Doe';
        p.age = 27;

        // NOTICE: Bio should be included because it's a nullable column.
        const insert = new InsertBuilder(p);
        const statement = insert.build();
        expect(statement.sql).equal('INSERT INTO People (name, age, bio) VALUES (?, ?, ?)');
        expect(statement.parameters).eql(['John Doe', 27, null]);
    });

    it('use property casters set on model properties', function () {
        const c = new Car();
        c.make = 'Chevy';
        c.model = 'Corvette';
        c.year = '1963';

        // NOTICE: Year should be a number due to caster being set on the property
        const insert = new InsertBuilder(c);
        const statement = insert.build();
        expect(statement.sql).equal('INSERT INTO Cars (make, model, year, color) VALUES (?, ?, ?, ?)');
        expect(statement.parameters).eql(['Chevy', 'Corvette', 1963, null]);
    });
});