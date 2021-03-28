// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model } from '../../../../src/orm/decorators/model';
import { Column } from '../../../../src/orm/decorators/column';
import { hasId } from '../../../../src/orm/lib/model';

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
 *  Unit Tests
 *=======================================*/

describe('Model', function () {
    it('@hasId should determine if a model has an id', function () {
        const p = new Person();
        const c = new Car();

        // Test w/ no IDs.
        expect(hasId(p)).equal(false);
        expect(hasId(c)).equal(false);

        // Test w/ partially set composite primary.
        c.make = 'Toyota';
        c.model = 'Corolla';
        expect(hasId.bind(this, c)).to.throw('Model\'s composite key is partially set.');

        // Test w/ IDs.
        p.id = 4;
        c.make = 'Mercedes';
        c.model = 'AMG GTs';
        c.year = 2017;
        expect(hasId(p)).equal(true);
        expect(hasId(c)).equal(true);
    });
});