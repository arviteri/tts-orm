import { ConjugatedCondition } from "./conjunction";
import { Condition, ConditionInterface } from "./i-condition";

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

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
     */
     constructor(
        private operand: string,
        private value: string | boolean | number | null,
        private operator: '<' | '>' | '<=' | '>=' | '=' | '<>' | 'LIKE' | 'NOT LIKE'
    ) {}

    and(condition: ConditionInterface): ConditionInterface {
        return new ConjugatedCondition(this, condition, 'AND');
    }
    
    or(condition: ConditionInterface): ConditionInterface {
        return new ConjugatedCondition(this, condition, 'OR');
    }

    getCondition(): Condition {
        return {
            condition: `${this.operand} ${this.operator} ?`,
            parameters: [this.value]
        }
    }
}