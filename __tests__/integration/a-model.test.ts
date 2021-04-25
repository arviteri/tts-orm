// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Connection } from './connections/sqlite3/connection';
import { init, Model, Column, ActiveModel } from '../../index';
import { Database } from 'sqlite3';

const em = init({
    connection: new Connection(new Database(':memory:')) 
});
 

/**======================================
 *  Mock Models
 *=======================================*/

@Model({table: 'People'})
class Person extends ActiveModel {
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

describe('ActiveModel', function () {
    it('should query from model class', async function () {
        const p = new Person();
        p.name = 'Mike Wazowski';
        p.age = 43;
        
        const saveResult = await p.save(true);
        expect(saveResult).equal(true);

        const people: Person[] = <Person[]> await Person.where('age', 43).all();
        expect(people.length).equal(1);
        expect(people[0].constructor.name).equal('Person');
    });
});