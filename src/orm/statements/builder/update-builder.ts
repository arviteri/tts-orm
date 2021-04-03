import { checkDefinition, isPrimary } from "../../lib/definition";
import { Property } from "../../lib/property";
import { AbstractStatementBuilder } from "./a-builder";
import { Statement } from "../i-statement";

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * SQL `UPDATE` statement builder.
 * 
 * @internal
 */
export class UpdateBuilder extends AbstractStatementBuilder {
    /**
     * @inheritdoc
     * NOTE: Ignores non-nullable properties with null (or undefined) values.
     * Undefined nullable properties are included as null.
     */
    build(): Statement {
        const def = checkDefinition(this.model.constructor, false);

        // Get columns and values.
        const conditioner = (column: string, property: Property, value: any): boolean => !(isPrimary(def, column) || (value == null && !property.nullable));
        const columns = this.getColumns(this.model, conditioner);
        const values = this.getValues(this.model, conditioner);
        
        const idConditioner = (column: string, property: Property, value: any): boolean => isPrimary(def, column);
        const conditionColumns = def.primaries;
        const conditionValues = this.getValues(this.model, idConditioner); // use getValues so that undefined will be casted to null
        
        // Build SQL statement and parameters.
        const set = columns.join(' = ?, ') + ' = ?';
        const conditions: string = conditionColumns.join(' = ? AND ') + ' = ?';
        const sql: string = `UPDATE ${def.table} SET ${set} WHERE ${conditions}`;

        return {sql, parameters: [...values, ...conditionValues]};
    }
}