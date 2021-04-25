// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model, Column, AbstractRepository, QueryBuilder } from '../../index';
import { entityManager as em } from './init/tts-orm-init';

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
}

/**======================================
 *  Test Repositories
 *=======================================*/

class PersonRepository extends AbstractRepository {
    constructor() {
        super(Person, em);
    }

    findAll(): Promise<Person[]> {
        const qb = new QueryBuilder();
        qb.select('*').from('People');
        
        return this.query(qb.build()) as Promise<Person[]>;
    }
}

/**======================================
 *  Unit Tests
 *=======================================*/

before(async () => {
    const connection = em.getConnection();
 
    return connection.exec(`
    CREATE TABLE IF NOT EXISTS People (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        age INTEGER,
        bio VARCHAR(255)
    )`, []).then(() => connection.exec(`
    CREATE TABLE IF NOT EXISTS Cars (
        make VARCHAR(255),
        model VARCHAR(255),
        year INTEGER,
        color VARCHAR(255),
        PRIMARY KEY(make, model, year)
    );`, []));
});

describe('AbstractRepository', function () {
    it('should return all Person objects', async function () {
        const p = new Person();
        p.name = 'Mike Wazowski';
        p.age = 43;
        
        const saveResult = await em.save(p);
        expect(saveResult).equal(true);

        const personRepo = new PersonRepository();
        const people: Person[] = await personRepo.findAll();
        expect(people.length).gte(1); // check >= because other tests may create people records
        expect(people[0].constructor.name).equal('Person');
    });
});