import { Condition, ConditionInterface } from './i-condition';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Representation of conjugated SQL query conditions.
 * 
 * @internal
 */
export class ConjugatedCondition implements ConditionInterface {
    /**
     * New ConjugatedCondition.
     * 
     * @param left Left side of conjunction.
     * @param right Right side of conjunction.
     * @param conjunction Conjunction operator.
     */
    constructor(
        private left: ConditionInterface,
        private right: ConditionInterface,
        private conjunction: 'AND' | 'OR'
    ) {}

    and(condition: ConditionInterface): ConditionInterface {
        return new ConjugatedCondition(this, condition, 'AND');
    }
    
    or(condition: ConditionInterface): ConditionInterface {
        return new ConjugatedCondition(this, condition, 'OR');
    }

    getCondition(): Condition {
        const left = this.left.getCondition();
        const right = this.right.getCondition();
        
        return {
            condition: `${left.condition} ${this.conjunction} ${right.condition}`,
            parameters: [...left.parameters, ...right.parameters]
        };
    }
}