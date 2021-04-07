import { ConnectionInterface } from "../../dbal/connection/i-connection";
import { QueryBuilder } from "../../query/builder/query-builder";
import { getHydrator, getTable } from "../../orm/lib/definition";

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
    private model: new (...ConstructorParameters: any) => Object;

    /**
     * QueryBuilder instance used to build the executable query.
     */
    private queryBuilder: QueryBuilder;

    constructor(model: new (...ConstructorParameters: any) => Object) {
        this.queryBuilder = new QueryBuilder();
        this.model = model;

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
    where(operand: string,  value: string | boolean | number | null, operator: '<' | '>' | '<=' | '>=' | '=' | '<>' | 'LIKE' | 'NOT LIKE'): ActiveQuery {
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
    async all(): Promise<Object[]> {
        return this.execute();
    }

    /**
     * Performs the query and returns a set of hydrated objects. Hydration
     * is based on the model provided upon creation of the query.
     */
    private async execute(): Promise<Object[]> {
        const statement = this.queryBuilder.build();
        this.resetQueryBuilder();

        const result = await this.connection.query(statement.sql, statement.parameters);
        const hydrator = getHydrator(this.model);

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