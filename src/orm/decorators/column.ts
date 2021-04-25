import { checkDefinition, Definition, setDefinition } from '../lib/definition';
import { Property, setProperty } from '../lib/property';
import {SQLType} from '../../dbal/connection/i-connection';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Interface of argument provided to Column decorator.
 * 
 * @internal
 */
interface Column {
    /**
     * Name of the column which the class member represents.
     * 
     * NOTICE: If not provided, the name of the class member is used.
     */
    name?: string;

    /**
     * Whether or not the column is part of a primary key.
     */
    primary?: boolean;

    /**
     * Whether or not the column auto-increments.
     * 
     * NOTICE: Ignored if more than one column is defined to be part
     * of a primary key (composite key). 
     */
    autoIncrements?: boolean;

    /**
     * Whether or not the column is nullable.
     * 
     * NOTICE: Ignored if `primary` is set to true. Primary keys
     * are assumed to be NOT NULL.
     */
    nullable?: boolean;

    /**
     * Function used to parse results from the database.
     */
    parser?: (value: any) => any, // eslint-disable-line

    /**
     * Function used to cast member values to a database type.
     * An undefined result represents a casting error.
     */
    caster?: (value: any) => SQLType | undefined // eslint-disable-line
}

/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Defines an association between a class property and a database column.
 */
export function Column(column?: Column): PropertyDecorator {
    // eslint-disable-next-line
    return function (target: any, member: string | symbol): void {
        // Symbols are not supported.
        if ('symbol' === typeof member) {
            throw new Error('Symbols are not supported by the Column decorator.');
        }

        const columnName: string = column?.name ?? member;

        // Null object converter used in place of undefined parser, caster.
        // eslint-disable-next-line
        const nullConverter = (value: any) => value;

        // Columns should be nullable unless it represents a primary key.
        let isNullable: boolean = column?.nullable ?? true;
        if (column?.primary) {
            isNullable = false;
        }

        const def: Definition = checkDefinition(target.constructor, true);
        const prop: Property = {
            member: member,
            autoIncrements: column?.autoIncrements ?? false,
            nullable: isNullable,
            parser: column?.parser ?? nullConverter,
            caster: column?.caster ?? nullConverter,
        };
        
        // Update definition.
        def.properties = setProperty(def.properties, columnName, prop);
        if (column?.primary) {
            def.primaries.push(columnName);
        }

        setDefinition(target.constructor, def);
    };
}