import { Statement } from '../../orm/statements/i-statement';
import { BaseCondition, Operator } from '../condition/base-condition';
import { ConditionBuilder } from './condition-builder';
import {SQLType} from '../../dbal/connection/i-connection';

/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Tool for building SQL queries.
 */
export class QueryBuilder {
    /**
     * Selected values. I.e values in the `SELECT` clause.
     */
    public selected: string[] = [];

    /**
     * Table to select from.
     */
    private table = '';

    /**
     * ConditionBuilder instance used to build the `WHERE` clause.
     */
    private conditionBuilder: ConditionBuilder;

    constructor() {
        this.conditionBuilder = new ConditionBuilder();
    }

    /**
     * Adds the provided selections to the values to select.
     * 
     * @param selected Values to select in the SQL query.
     */
    select(...selected: string[]): QueryBuilder {
        this.selected = [...this.selected, ...selected];

        return this;
    }

    /**
     * Sets the table to select from.
     * 
     * @param table Table to select from.
     */
    from(table: string): QueryBuilder {
        this.table = table;

        return this;
    }

    /**
     * Adds a condition to the `WHERE` clause of the SQL query.
     * 
     * @param operand Operand which the condition operates upon.
     * @param value Value to check the operand against.
     * @param operator Operator used in condition.
     * 
     * @throws Error if called prior to 'and()' or 'or()' and a condition
     * has already been created.
     */
    where(operand: string,  value: SQLType, operator: Operator): QueryBuilder {
        this.conditionBuilder.where(new BaseCondition(operand, value, operator));

        return this;
    }

    /**
     * Configures the QueryBuilder to conjugate the next condition via 'AND'.
     */
    and(): QueryBuilder {
        this.conditionBuilder.and();

        return this;
    }

    /**
     * Configures the QueryBuilder to conjugate the next condition via 'OR'.
     */
    or(): QueryBuilder {
        this.conditionBuilder.or();

        return this;
    }

    /**
     * Configures the QueryBuilder to build future conditions inside of a set
     * of parentheses.
     */
    openP(): QueryBuilder {
        this.conditionBuilder.openP();

        return this;
    }

    /**
     * Configures the QueryBuilder to close the most recently opened set of parentheses
     * and conjugate future conditions to the enclosed condition.
     */
    closeP(): QueryBuilder {
        this.conditionBuilder.closeP();

        return this;
    }

    /**
     * Builds and returns a Statement instance which contains the raw SQL query
     * and its parameters. Resets the state of the 
     */
    build(): Statement {
        const queryBase = `SELECT ${this.selected.join(', ')} FROM ${this.table}`;

        const condition = this.conditionBuilder.build();
        if (condition.condition) {
            return {
                sql: queryBase + ` WHERE ${condition.condition}`,
                parameters: condition.parameters
            };
        }

        return {
            sql: queryBase,
            parameters: []
        };
    }

    /**
     * Resets the state of the QueryBuilder instance so that it can be reused.
     */
    resetState(): void {
        this.selected = [];
        this.table = '';
        this.conditionBuilder.resetState();
    }
}