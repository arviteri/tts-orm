import { ConjugatedCondition } from './conjunction';
import { Condition, ConditionInterface } from './i-condition';
import {SQLType} from '../../dbal/connection/i-connection';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Operator type.
 */
export type Operator = '<' | '>' | '<=' | '>=' | '=' | '<>' | 'LIKE' | 'NOT LIKE';

/**
 * Representation of a bear SQL query condition.
 * 
 * @internal
 */
export class BaseCondition implements ConditionInterface {
    /**
     * New BaseCondition.
     * 
     * @param operand Operand which the condition operates upon.
     * @param value Value to check the operand against.
     * @param operator Operator used in condition.
     * @param parameterize Whether or not to parameterize the value.
     */
    constructor(
        private operand: string,
        private value: SQLType,
        private operator: Operator,
        private parameterize = true
    ) {}

    and(condition: ConditionInterface): ConditionInterface {
        return new ConjugatedCondition(this, condition, 'AND');
    }
    
    or(condition: ConditionInterface): ConditionInterface {
        return new ConjugatedCondition(this, condition, 'OR');
    }

    getCondition(): Condition {
        if (!this.parameterize) {
            return {
                condition: `${this.operand} ${this.operator} ${this.value}`,
                parameters: []
            };
        }

        return {
            condition: `${this.operand} ${this.operator} ?`,
            parameters: [this.value]
        };
    }
}