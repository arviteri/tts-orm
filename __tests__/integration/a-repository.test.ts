// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Connection } from '../integration/connections/sqlite3/connection';
import { init, Model, Column, AbstractRepository, QueryBuilder } from '../../index';
import { Database } from 'sqlite3';

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
    async findAll(): Promise<Person[]> {
        const qb = new QueryBuilder();
        qb.select('*').from('People');
        
        const result: Person[] = <Person[]> await this.query(qb.build());
        return result;
    }
}

/**======================================
 *  Unit Tests
 *=======================================*/
 
const em = init({
    connection: new Connection(new Database(':memory:')) 
 });
 
 
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

        const personRepo = new PersonRepository(Person, em);
        const people: Person[] = await personRepo.findAll();
        expect(people.length).equal(1);
        expect(people[0].constructor.name).equal('Person');
    })
});