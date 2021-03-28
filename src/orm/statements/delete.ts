
import { checkDefinition, isPrimary } from "../lib/definition";
import { Property } from "../lib/property";
import { AbstractStatementBuilder } from "./a-statement";
import { Statement } from "./i-statement";

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
        
        const idConditioner = (column: string, property: Property, value: any): boolean => isPrimary(def, column);
        const conditions: string = def.primaries.join(' = ? AND ') + ' = ?';
        const parameters = this.getValues(this.model, idConditioner);

        const sql: string = `DELETE FROM ${def.table} WHERE ${conditions}`;

        return {sql, parameters};
    }
}