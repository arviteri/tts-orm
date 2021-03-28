import { load } from "../lib/model";
import { Properties } from "./property";

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Name of static member instantiated on all models which
 * holds model definition metadata.
 * 
 * @internal
 */
export const DEFINITION_MEMBER = '__tts_def__';

/**
 * Interface which describes metadata that defines a mapping between a model
 * and database table.
 * 
 * @internal
 */
export interface Definition {
    /**
     * Name of database table which the model represents.
     */
    table: string;

    /**
     * Columns which make up the database table's primary key.
     */
    primaries: string[];

    /**
     * Column to model member metadata mappings.
     */
    properties: Properties;

    /**
     * Function which creates a new instance of the model, hydrated with the values from
     * a database row.
     * 
     * @param row Database row used to hydrate model instance.
     * 
     * @throws Error if column parser returns undefined.
     */
    hydrator: (row: any) => Object;
}

/**
 * Checks a model's constructor for an existing definition.
 * 
 * @param _class Class of the model to check for the definition. 
 * @param create Whether or not to create a definition if it doesn't exist.
 * @returns Copy of the model definition of the class provided.
 * 
 * @throws Error if no definition exists and `create` is set to false.
 * 
 * @internal
 */
export function checkDefinition<TFunction extends Function>(_class: TFunction, create: boolean): Definition {
    const _constructor: any = _class;
    
    // Look for existing definition.
    if (_constructor[DEFINITION_MEMBER] == null) {
        if (!create) {
            throw new Error('Non-existent model definition.');
        }

         setDefinition(_class, {
            table: '',
            primaries: [],
            properties: {},
            hydrator: buildHydrator(_class)
        });
    }

    return {..._constructor[DEFINITION_MEMBER]};
}

/**
 * Sets a model definition on a class constructor.
 * 
 * @param _class Class for which to set the provided definition.
 * @param definition Definition to set of the class provided.
 * 
 * @internal
 */
export function setDefinition<TFunction extends Function>(_class: TFunction, definition: Definition): void {
    const _constructor: any = _class;
    if (_constructor[DEFINITION_MEMBER] === undefined) {
        // The first time this is defined, it should be defined as non-enumerable.
        Object.defineProperty(_constructor, DEFINITION_MEMBER, {
            enumerable: false,
            writable: true 
        });
    }

    _constructor[DEFINITION_MEMBER] = {...definition}
}

/**
 * Builds a function using the class provided which creates a new, hydrated model instance
 * using a database row.
 * 
 * @param _class Class of the model for which the hydration function should create an instance of.
 * @returns Function which creates a hydrated instance of the provided class using a database row.
 * 
 * @internal
 */
function buildHydrator<TFunction extends Function>(_class: TFunction): (row: any) => Object {
    return (row: any) => {
        const def: Definition = checkDefinition(_class, false);
        const instance = new _class.prototype.constructor();

        // Hydrate instance.
        Object.keys(row).forEach((column: string) => {
            const member = def.properties[column].member;
            const parser = def.properties[column].parser;

            const raw: any = row[column];
            let value: any = raw;
            if (parser != null) {
                value = parser(raw);

                // Undefined represents a parse failure.
                if (value === undefined) {
                    throw new Error(`Failed to parse database result for column '${column}' of table ${def.table}`);
                }
            }

            instance[member] = value;
        });

        load(instance);
        
        return instance;
    }
}

/**
 * Checks whether or not a column is set as a primary key on the provided model
 * definition.
 * 
 * @param definition Model definition to check if primary key includes the column.
 * @param column Column to check if it exists in the model definition's primaries.
 * @returns Whether or not a column is set as in the model definition's primaries.
 * 
 * @internal
 */
 export function isPrimary(definition: Definition, column: string): boolean {
    return definition.primaries.includes(column);
}


/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

// /**
//  * Gets the name of the table associated with the provided model.
//  * 
//  * @param _class Class of the model for which to return the associated table.
//  * @returns Name of table associated with provided model.
//  * 
//  * @throws Error if the class provided is not a model.
//  * 
//  * @deprecated No known use cases for this. Members of the model definition should
//  * only be used internally.
//  */
// export function getTable<TFunction extends Function>(_class: TFunction): string {
//     return checkDefinition(_class, false).table;
// }

/**
 * Gets the hydration function used to create new, hydrated model instances.
 * 
 * @param _class Class of the model for which to create a hydrated instance.
 * @returns Function which creates a hydrated instance of the provided class using a database row.
 * 
 * @throws Error if the class provided is not a model.
 */
export function getHydrator<TFunction extends Function>(_class: TFunction): (row: any) => Object {
    return checkDefinition(_class, false).hydrator;
}