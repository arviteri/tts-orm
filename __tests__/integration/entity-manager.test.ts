// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Connection } from '../integration/connections/sqlite3/connection';
import { init, Model, Column } from '../../index';
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


describe('EntityManger', function () {
    it('should successfully create, update and delete a model row', async function () {
        ///////////////
        // CREATE
        //////////////

        // Test create single column primary key.
        const p = new Person();
        p.name = 'Mike Wazowski';
        p.age = 43;

        const didCreatePerson = await em.save(p, true);
        expect(didCreatePerson).equal(true);
        expect(p.id).is.not.null;
        expect(p.id).is.not.undefined;

        // Test create on compsite primary key.
        const c = new Car();
        c.make = 'Toyota';
        c.model = 'Corolla';
        c.year = 2003;
        const didCreateCar = await em.save(c, true);
        expect(didCreateCar).equal(true);

        ///////////////
        // UPDATE
        //////////////
        p.bio = 'My name is Mike!';
        const didUpdatePerson = await em.save(p, true);
        expect(didUpdatePerson).equal(true);

        c.color = 'silver';
        const didUpdateCar = await em.save(c, true);
        expect(didUpdateCar).equal(true);

        ///////////////
        // DELETE
        //////////////
        const didDeletePerson = await em.delete(p, true);
        expect(didDeletePerson).equal(true);

        const didDeleteCar = await em.delete(c, true);
        expect(didDeleteCar).equal(true);
    });
});