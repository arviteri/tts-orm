import { checkDefinition, isPrimary } from '../../lib/definition';
import { AbstractStatementBuilder } from './a-builder';
import { Statement } from '../i-statement';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * SQL `DELETE` statement builder.
 * 
 * @internal
 */
export class DeleteBuilder extends AbstractStatementBuilder {
    build(): Statement {
        const def = checkDefinition(this.model.constructor, false);
        const idConditioner = (column: string): boolean => isPrimary(def, column);

        const conditions: string = def.primaries.join(' = ? AND ') + ' = ?';
        const parameters = this.getValues(this.model, idConditioner);
        const sql = `DELETE FROM ${def.table} WHERE ${conditions}`;

        return {sql, parameters};
    }
}