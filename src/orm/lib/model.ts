import { checkDefinition } from "../lib/definition";
import { checkProperty, Property } from "./property";

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Name of member instantiated on all model instances
 * loaded from the database.
 * 
 * @internal
 */
 export const LOADED_MEMBER = '__tts_loaded__';

/**
 * Determines whether or not the model's id is properly set.
 * E.g. For a composite primary key, all values must be either
 * defined or undefined (or null).
 *  
 * @param model 
 * 
 * @throws Error when composite primary key is partially defined.
 * 
 * @internal
 */
export function hasId(model: Object): boolean {
    const instance: any = model;
    const def = checkDefinition(model.constructor, false);

    if (def.primaries.length === 0) {
        return false;
    }

    // Iterate the primary keys to ensure they are all defined or all undefined (or null).
    let i = 0;
    let prop: Property = checkProperty(def.properties, def.primaries[i]);
    let set: boolean = instance[prop.member] != null;
    for (i = 1; i < def.primaries.length; i++) {
        prop = checkProperty(def.properties, def.primaries[i]);
        const current = instance[prop.member] != null;
        
        if (current !== set) {
            throw new Error('Model\'s composite key is partially set.');
        }
    }

    return set;
}

/**
 * Determines whether or not the model instance was instantiated via the hydrator.
 * 
 * @param model Model to check.
 * 
 * @internal
 */
export function loaded(model: Object): boolean {
    const instance: any = model;
    return instance[LOADED_MEMBER] === true;
}

/**
 * Defines a non-enumerable, non-writable property on the model instance
 * which signifies the model was loaded via an existing entity in the
 * database.
 * 
 * @param model 
 * 
 * @internal
 */
export function load(model: Object): void {
    Object.defineProperty(model, LOADED_MEMBER, {
        enumerable: false,
        writable: false,
        value: true
    });
}