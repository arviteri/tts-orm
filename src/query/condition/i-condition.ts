import {SQLType} from '../../dbal/connection/i-connection';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Interface which defines a SQL query condition.
 * 
 * @internal
 */
export interface Condition {
    /**
     * Raw condition.
     */
    condition: string;

    /**
     * Parameter values of the condition.
     */
    parameters: SQLType[];
}

/**
 * Interface which describes an object-oriented representation
 * of a SQL query condition.
 * 
 * @internal
 */
export interface ConditionInterface {
    /**
     * Conjugates this condition with the provided
     * condition using 'and'.
     * 
     * @param condition Condition to conjugate.
     */
    and(condition: ConditionInterface): ConditionInterface;

    /**
     * Conjugates this condition with the provided
     * condition using 'or'.
     * 
     * @param condition Condition to conjugate.
     */
    or(condition: ConditionInterface): ConditionInterface;
 
    /**
     * Builds and returns a Condition instance.
     */
    getCondition(): Condition;
}