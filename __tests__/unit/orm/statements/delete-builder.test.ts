// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model } from '../../../../src/orm/decorators/model';
import { Column } from '../../../../src/orm/decorators/column';
import { DeleteBuilder } from '../../../../src/orm/statements/builder/delete-builder';

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

    @Column({primary: true})
    declare year: number;

    @Column()
    declare color: string;
}
 
/**======================================
 * Unit Tests
 *=======================================*/

describe('Delete statement', function () {
    it('should create a valid delete statement w/ single column primary key', function () {
        const p = new Person();
        p.id = 5;
        p.name = 'John Doe';
        p.age = 27;

        const _delete = new DeleteBuilder(p);
        const statement = _delete.build();
        expect(statement.sql).equal('DELETE FROM People WHERE id = ?');
        expect(statement.parameters).eql([5]);
    });

    it('should create a valid delete statement w/ composite key', function () {
        const c = new Car();
        c.make = 'Ferrari';
        c.model = 'F40';
        c.year = 1987;
        c.color = 'red';

        const _delete = new DeleteBuilder(c);
        const statement = _delete.build();
        expect(statement.sql).equal('DELETE FROM Cars WHERE make = ? AND model = ? AND year = ?');
        expect(statement.parameters).eql(['Ferrari', 'F40', 1987]);
    });
});