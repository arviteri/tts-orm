import { hasId, load, loaded } from "../lib/model";
import { checkDefinition } from "../lib/definition";
import { checkProperty } from "../lib/property";
import { DeleteBuilder } from "../statements/builder/delete-builder";
import { InsertBuilder } from "../statements/builder/insert-builder";
import { UpdateBuilder } from "../statements/builder/update-builder";
import { ConnectionInterface } from "../../dbal/connection/i-connection";

/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Service which manages the create, update, and delete operations of models.
 */
export class EntityManager {
    constructor(
        private connection: ConnectionInterface
    ) {}

    /**
     * Gets the EntityManager's connection instance.
     */
    getConnection(): ConnectionInterface {
        return this.connection;
    }

    /**
     * Saves a model in the database.
     * 
     * @param model Model that will be saved.
     * @param throwOnError Whether or not to throw if an error occurs.
     * @returns True if successful, false if failed.
     */
    async save(model: Object, throwOnError: boolean = false): Promise<boolean> {
        try {
            if (hasId(model) && loaded(model)) {
                return this.update(model, throwOnError);
            }
    
            return this.create(model, throwOnError);
        } catch (e) {
            if (throwOnError) {
                throw e;
            }

            return false;
        }
    }

    /**
     * Deletes a model in the database.
     * 
     * @param model Model that will be deleted.
     * @param throwOnError Whether or not to throw if an error occurs.
     * @returns True if successful, false if failed.
     */
    async delete(model: Object, throwOnError: boolean): Promise<boolean> {
        try {
            if (!hasId(model) || !loaded(model)) {
                throw new Error('Cannot delete model: model does not accurately portray persisted record.')
            }

            const _delete = new DeleteBuilder(model);
            const statement = _delete.build();
            await this.getConnection().exec(statement.sql, statement.parameters);
        } catch (e) {
            if (throwOnError) {
                throw e;
            }

            return false;
        }

        return true;
    }

    /**
     * Creates a model in the database.
     * 
     * @param model Model that will be created.
     * @param throwOnError Whether or not to throw if an error occurs.
     * @returns True if successful, false if failed.
     */
    private async create(model: Object, throwOnError: boolean): Promise<boolean> {
        try {
            const insert = new InsertBuilder(model);
            const statement = insert.build();
            await this.getConnection().exec(statement.sql, statement.parameters);
        
            // Check for auto-incrementing primary key.
            const def = checkDefinition(model.constructor, false);
            if (def.primaries.length === 1) {
                const prop = checkProperty(def.properties, def.primaries[0]); // get property of only primary key
                if (prop.autoIncrements) {
                    const instance: any = model;
                    instance[prop.member] = await this.getConnection().lastId();
                }
            }
        } catch (e) {
            if (throwOnError) {
                throw e;
            }

            return false;
        }

        load(model);
        
        return true;
    }

    /**
     * Updates a model in the database.
     * 
     * @param model Model that will be updated.
     * @param throwOnError Whether or not to throw if an error occurs.
     * @returns True if successful, false if failed.
     */
    private async update(model: Object, throwOnError: boolean): Promise<boolean> {
        try {
            const update = new UpdateBuilder(model);
            const statement = update.build();
            await this.getConnection().exec(statement.sql, statement.parameters);
        } catch (e) {
            if (throwOnError) {
                throw e;
            }

            return false;
        }

        return true;
    }
}