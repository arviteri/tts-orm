import { checkDefinition, Definition, setDefinition } from '../lib/definition';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Interface of argument provided to Model decorator.
 * 
 * @internal
 */
interface Model {
    /**
     * Name of table which the model represents.
     */
    table: string;
}

/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Registers the tagged class as a model.
 * 
 * @param model Model interface.
 */
export function Model(model?: Model): ClassDecorator {
    // eslint-disable-next-line
    return function <TFunction extends Function>(_class: TFunction): void {
        const def: Definition = checkDefinition(_class, true);
        // If no argument is provided to the decorator, use the model name as the table name.
        def.table = model?.table ?? _class.name;

        setDefinition(_class, def);
    };
}