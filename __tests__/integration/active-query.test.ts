// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { Model, Column, ActiveModel, ActiveQuery } from '../../index';
import { entityManager as em } from './init/tts-orm-init';

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

describe('ActiveQuery', function () {
    it('should use the connection from the model class\'s EntityManager', function () {
        const query = new ActiveQuery(Person);
        expect(query.getConnection()).equal(em.getConnection());
    });
});