import { BaseCondition } from '../condition/base-condition';
import { ConditionInterface, Condition } from '../condition/i-condition';
import { ParenthesesDecorator } from '../condition/parentheses';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Interface used solely by ConditionBuilder; describes
 * an entry in the the ConditionBuilder's stack.
 *
 * @internal
 */
interface StackEntry {
    /**
     * Condition which was current at the time the entry is added to the stack.
     */
    condition?: ConditionInterface,

    /**
     * Conjunction used to conjugate the condition after the entry is popped off the stack.
     */
    conjunction?: 'and' | 'or'
}

/**
 * Tool for conjugating multiple conditions into one.
 * 
 * @internal
 */
export class ConditionBuilder {
    /**
     * Current condition to build off of (current state).
     */
    private current?: ConditionInterface;

    /**
     * Next conjunction to use.
     */
    private conjunction?: 'and' | 'or';

    /**
     * Stack used for parentheses management.
     */
    private stack: StackEntry[] = [];

    /**
     * Adds a sub-condition onto the condition.
     * 
     * @param condition Sub-condition to add.
     * 
     * @throws Error if called when a condition exists
     * and no conjugation is set.
     */
    where(condition: BaseCondition): ConditionBuilder {
        if (!this.current) {
            this.current = condition;
            return this;
        }

        // If a condition exists, a conjunction must be set to join the provided condition
        // with the current condition.
        if (!this.conjunction) {
            throw new Error('Unset conjunction: `and()` or `or()` call is missing.');
        }

        if (this.conjunction === 'and') {
            this.current = this.current.and(condition);
        } else {
            this.current = this.current.or(condition);
        }

        this.conjunction = undefined; // force user to call conjunction function before next call
        return this;
    }
    
    /**
     * Sets the conjunction to 'and'.
     */
    and(): ConditionBuilder {
        this.conjunction = 'and';
        return this;
    }
    
    /**
     * Sets the conjunction to 'or'.
     */
    or(): ConditionBuilder {
        this.conjunction = 'or';
        return this;
    }

    /**
     * Modifies the state of the ConditionBuilder to decorate
     * future conditions in parentheses.
     */
    openP(): ConditionBuilder {
        this.stack.push({
            condition: this.current,
            conjunction: this.conjunction
        });

        this.current = undefined;
        return this;
    }
    
    /**
     * Modifies the state of the ConditionBuilder to conjugate future conditions
     * outside of the parentheses configured from the last `pOpen()` call.
     */
    closeP(): ConditionBuilder {
        const top = this.stack.pop();
        if (!this.current || !top) {
            return this;
        }

        // Conjugate the decorated condition w/ the condition which
        // was existed before this set of parentheses was opened.
        // If there was no condition prior to the parentheses being
        // opened, the current should be the decorated condition.
        const decorated = new ParenthesesDecorator(this.current);
        if (top.condition && top.conjunction) {
            if (top.conjunction === 'and') {
                this.current = top.condition.and(decorated);
            } else {
                this.current = top.condition.or(decorated);
            }
        } else {
            this.current = decorated;
        }

        return this;
    }
    
    /**
     * Builds and returns a Condition instance. 
     */
    build(): Condition {
        const current: ConditionInterface | undefined = this.current;
        if (!current) {
            return {
                condition: '',
                parameters: [],
            };
        }

        return current.getCondition();
    }

    /**
     * Resets the state of the ConditionBuilder instance.
     */
    resetState(): void {
        this.current = undefined;
        this.conjunction = undefined;
        this.stack = [];
    }
}