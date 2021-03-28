/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

import { Definition } from "./definition";

/**
 * Interface which describes metadata that defines a mapping between a model member
 * and database column.
 * 
 * @internal
 */
export interface Property {
    /**
     * Member of the class which represents the property.
     */
    member: string;

    /**
     * Whether or not the database column associated w/ this property auto-increments.
     */
    autoIncrements: boolean; 

    /**
     * Whether or not the database column associated w/ this property is nullable.
     */
    nullable: boolean;
    
    /**
     * Function which converts values retrieved from the database to the desired TypesScript type.
     */
    parser: (value: any) => any;

    /**
     * Function which converts values on a model's member to the desired database type.
     */
    caster: (value: any) => string | number | boolean | undefined
}


/**
 * Interface which describes a mapping of databse columns to model properties.
 * 
 * @internal
 */
export interface Properties {
    /**
     * Index signature which allows retrieval of Properties by column name.
     */
    [key: string]: Property;
}

/**
 * Checks a model definition for an existing property.
 * 
 * @param definition Model definition to check for the property.
 * @param column Database column associated with the property.
 * @returns Copy of the property associated with the provided database column.
 * 
 * @throws Error if the property does not exist.
 * 
 * @internal
 */
export function checkProperty(properties: Properties, column: string): Property {    
    if (!properties[column]) {
        throw new Error('Non-existent property on model properties.');
    }

    return {...properties[column]};
}

/**
 * Sets a property on a Properties instance using the column provided.
 * 
 * @param properties Properties instance to set the property on.
 * @param column Database column to be associated with the provided property.
 * @param property Updates Properties instance with the new property set.
 * @returns Copy of the updated properties instance.
 * 
 * @internal
 */
export function setProperty(properties: Properties, column: string, property: Property): Properties {
    const updated: Properties = {...properties};
    updated[column] = {...property};

    return updated;
}