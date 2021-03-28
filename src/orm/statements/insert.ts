import { checkDefinition } from "../lib/definition";
import { Property } from "../lib/property";
import { AbstractStatementBuilder } from "./a-statement";
import { Statement } from "./i-statement";

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * SQL `INSERT` statement builder.
 * 
 * @internal
 */
export class InsertBuilder extends AbstractStatementBuilder {
    /**
     * @inheritdoc
     * NOTE: Ignores non-nullable properties with null (or undefined) values.
     * Undefined nullable properties are included as null.
     */
    build(): Statement {
        const def = checkDefinition(this.model.constructor, false);

        const conditioner = (column: string, property: Property, value: any): boolean => !(value == null && !property.nullable);
        const columns = this.getColumns(this.model, conditioner);
        const values = this.getValues(this.model, conditioner);
        const qs = columns.map(() => '?');
        const sql: string = `INSERT INTO ${def.table} (${columns.join(', ')}) VALUES (${qs.join(', ')})`;

        return {sql, parameters: values};
    }
}