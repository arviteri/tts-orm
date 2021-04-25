import { checkDefinition } from '../../lib/definition';
import { Property } from '../../lib/property';
import { AbstractStatementBuilder } from './a-builder';
import { Statement } from '../i-statement';

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
     * @inheritDoc
     * NOTE: Ignores non-nullable properties with null (or undefined) values.
     * Undefined nullable properties are included as null.
     */
    build(): Statement {
        const def = checkDefinition(this.model.constructor, false);
        const conditioner = (column: string, property: Property, value: any): boolean => !(value == null && !property.nullable); // eslint-disable-line

        const columns = this.getColumns(this.model, conditioner);
        const values = this.getValues(this.model, conditioner);
        const sql = `INSERT INTO ${def.table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;

        return {sql, parameters: values};
    }
}