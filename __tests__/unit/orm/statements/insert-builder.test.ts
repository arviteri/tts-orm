// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model } from '../../../../src/orm/decorators/model';
import { Column } from '../../../../src/orm/decorators/column';
import { InsertBuilder } from '../../../../src/orm/statements/builder/insert-builder';

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
    })
});