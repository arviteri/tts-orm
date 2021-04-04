import { Condition, ConditionInterface } from "./i-condition";
import { ConjugatedCondition } from './conjunction';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Condition decorator which wraps a condition in a set of parentheses.
 * 
 * @internal
 */
export class ParentheseDecorator implements ConditionInterface {
    /**
     * New ParenthesesDecorator
     * 
     * @param condition Condition to be decorated.
     */
    constructor(
        private condition: ConditionInterface
    ) {}

    and(condition: ConditionInterface): ConditionInterface {
        return new ConjugatedCondition(this, condition, 'AND');
    }

    or(condition: ConditionInterface): ConditionInterface {
        return new ConjugatedCondition(this, condition, 'OR');
    }

    getCondition(): Condition {
        const condition = this.condition.getCondition();

        return {
            condition: `(${condition.condition})`,
            parameters: condition.parameters
        }
    }
}