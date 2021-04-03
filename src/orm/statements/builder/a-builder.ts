import { checkDefinition } from "../../lib/definition";
import { checkProperty, Property } from "../../lib/property";
import { Statement } from "../i-statement";

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Abstract representation of a SQL statement building class.
 * 
 * @internal
 */
export abstract class AbstractStatementBuilder {
    constructor(
        protected model: Object
    ) {}

    /**
     * Builds and returns a Statement instance.
     */
    abstract build(): Statement

    /**
     * Retrieves a list of columns from the provided model's definition based on a given conditioner function.
     * 
     * @param model Model which holds definition to retrieve columns from.
     * @param conditioner Function which decides if the column should be in the set returned.
     * @returns List of columns on model's definition.
     */
    protected getColumns(model: Object, conditioner: (column: string, property: Property, value: any) => boolean): string[] {
        const instance: any = model;
        const def = checkDefinition(model.constructor, false);
        return Object.keys(def.properties).reduce((columns: string[], column: string) => {
            const prop = checkProperty(def.properties, column);
            const value = instance[prop.member];
            if (conditioner(column, prop, value)) {
                columns.push(column);
            }

            return columns;
        }, []);
    }

    /**
     * Retrieves a list of values from the provided model instance based on a given conditioner function.
     * 
     * NOTE: Undefined values are returned as null.
     * 
     * @param model Model to retrieve values from.
     * @param conditioner Function which decides if the value should be in the set returned.
     * @returns List of model values.
     */
    protected getValues(model: Object, conditioner: (column: string, property: Property, value: any) => boolean): any[] {
        const instance: any = model;
        const def = checkDefinition(model.constructor, false);
        return Object.keys(def.properties).reduce((values: any[], column: string) => {
            const prop = checkProperty(def.properties, column);
            const value = instance[prop.member];
            if (conditioner(column, prop, value)) {
                if (value === undefined) {
                    values.push(null);
                } else {
                    values.push(value);
                }
            }

            return values;
        }, []);
    }
}