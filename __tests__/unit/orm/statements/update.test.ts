// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model } from '../../../../src/orm/decorators/model';
import { Column } from '../../../../src/orm/decorators/column';
import { UpdateBuilder } from '../../../../src/orm/statements/update';

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

describe('Update statement', function () {
    it('should create a valid update statement w/ single column primary key', function () {
        const p = new Person();
        p.id = 5;
        p.name = 'John Doe';
        p.age = 27;

        // NOTICE: Bio should be included because it's a nullable column.
        const update = new UpdateBuilder(p);
        const statement = update.build();
        expect(statement.sql).equal('UPDATE People SET name = ?, age = ?, bio = ? WHERE id = ?');
        expect(statement.parameters).eql(['John Doe', 27, null, 5]);
    });

    it('should create a valid update statement w/ composite key', function () {
        const c = new Car();
        c.make = 'Ferrari';
        c.model = 'F40';
        c.year = 1987;

        // NOTICE: Color should be included because it's a nullable column.
        const update = new UpdateBuilder(c);
        const statement = update.build();
        expect(statement.sql).equal('UPDATE Cars SET color = ? WHERE make = ? AND model = ? AND year = ?');
        expect(statement.parameters).eql([null, 'Ferrari', 'F40', 1987]);
    });
});