import { EntityManager } from '../entity-manager/entity-manager';
import { Statement } from '../statements/i-statement';
import { getHydrator } from '../lib/definition';

/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Abstract model repository.
 */
export abstract class AbstractRepository {
    /**
     * New Repository.
     * 
     * @param model Model class associated with the repository.
     * @param entityManager EntityManager which is configured with the 
     * database connection that the repository should use.
     */
    constructor(
        private model: new (...ConstructorParameters: any) => Object, // eslint-disable-line
        private entityManager: EntityManager
    ) {}

    /**
     * Performs a query and returns a set of hydrated objects. Hydration
     * is based on the model provided upon creation of the repository.
     * 
     * @param statement Query to be executed.
     */
    protected async query(statement: Statement): Promise<Object[]> { // eslint-disable-line
        const hydrator: (row: any) => Object = getHydrator(this.model); // eslint-disable-line
        const results = await this.entityManager.getConnection().query(statement.sql, statement.parameters);
        
        return results.map((result: any) => hydrator(result)); // eslint-disable-line
    }
}