import {ConnectionInterface, SQLType} from '../../dbal/connection/i-connection';
import { QueryBuilder } from '../builder/query-builder';
import { getHydrator, getTable } from '../../orm/lib/definition';
import { Operator } from '../condition/base-condition';

/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Self-executable query.
 */
export class ActiveQuery {
    /**
     * Connection used to execute the query.
     */
    private connection: ConnectionInterface;

    /**
     * Model class which represents the table that the query should select from.
     */
    private model: new (...ConstructorParameters: any) => Object; // eslint-disable-line

    /**
     * QueryBuilder instance used to build the executable query.
     */
    private queryBuilder: QueryBuilder;

    // eslint-disable-next-line
    constructor(model: new (...ConstructorParameters: any) => Object) {
        this.model = model;

        this.queryBuilder = new QueryBuilder();
        this.queryBuilder.select('*');
        this.queryBuilder.from(getTable(model));
    }

    /**
     * Sets the connection instance.
     */
    setConnection(connection: ConnectionInterface): void {
        this.connection = connection;
    }

    /**
     * Adds a condition to the `WHERE` clause of the SQL query.
     * 
     * @param operand Operand which the condition operates upon.
     * @param value Value to check the operand against.
     * @param operator Operator used in condition.
     */
    where(operand: string,  value: SQLType, operator: Operator): ActiveQuery {
        this.queryBuilder.where(operand, value, operator);

        return this;
    }

    /**
     * Configures the ActiveQuery to conjugate the next condition via 'AND'.
     */
    and(): ActiveQuery {
        this.queryBuilder.and();

        return this;
    }

    /**
     * Configures the ActiveQuery to conjugate the next condition via 'OR'.
     */
    or(): ActiveQuery {
        this.queryBuilder.or();

        return this;
    }

    /**
     * Configures the ActiveQuery to build future conditions inside of a set
     * of parentheses.
     */
    openP(): ActiveQuery {
        this.queryBuilder.openP();

        return this;
    }

    /**
     * Configures the ActiveQuery to close the most recently opened set of parentheses
     * and conjugate future conditions to the enclosed condition.
     */
    closeP(): ActiveQuery {
        this.queryBuilder.closeP();

        return this;
    }

    /**
     * Executes the query and returns its results.
     */
    async all(): Promise<Object[]> { // eslint-disable-line
        return this.execute();
    }

    /**
     * Performs the query and returns a set of hydrated objects. Hydration
     * is based on the model provided upon creation of the query.
     */
    private async execute(): Promise<Object[]> { // eslint-disable-line
        const statement = this.queryBuilder.build();
        this.resetQueryBuilder();

        const result = await this.connection.query(statement.sql, statement.parameters);
        const hydrator = getHydrator(this.model);

        // eslint-disable-next-line
        return result.map((result: any) => hydrator(result));
    }

    /**
     * Resets the state of the QueryBuilder instance.
     */
    private resetQueryBuilder(): void {
        this.queryBuilder.resetState();
        this.queryBuilder.select('*');
        this.queryBuilder.from(getTable(this.model));
    }
}