import { Operator } from '../../query/condition/base-condition';
import { ActiveQuery } from "../../query/active/active-query";
import { EntityManager } from "../entity-manager/entity-manager";

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Sets the staic entityManager propertyon the ActiveModel class. This should
 * only be done once, and should only be done during initialization.
 * 
 * @param ActiveModel ActiveModel class.
 * @param entityManager EntityManager instance to set on the ActiveModel class.
 * 
 * @internal.
 */
export function setEntityManager(ActiveModel: Function, entityManager: EntityManager): void {
    const _class: any = ActiveModel;
    _class['entityManager'] = entityManager;
}

/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Base model; Active-Record implementation of tts-orm.
 */
export abstract class ActiveModel {
    /**
     * EntityManager instance which provides save and delete operations
     * to the active record.
     */
    private static entityManager: EntityManager;

    /**
     * Creates an ActiveQuery instance based on the model with using the condition provided.
     * 
     * @param operand Operand which the condition operates upon.
     * @param value Value to check the operand against.
     * @param operator Operator used in condition.
     */
    static where(operand: string, value: string | boolean | number | null, operator: Operator = '='): ActiveQuery {
        const model: any = this;
        const query = new ActiveQuery(model);
        query.setConnection(ActiveModel.entityManager.getConnection());
        query.where(operand, value, operator);

        return query;
    }

    /**
     * Saves the model instance to the database.
     * 
     * @param throwOnError Whether or not to throw an error if the save operation fails.
     * @returns True if the save was successful, false otherwise.
     */
    async save(throwOnError: boolean = false): Promise<boolean> {
        return ActiveModel.entityManager.save(this, throwOnError);
    }

    /**
     * Deletes the model instance from the database.
     * 
     * @param throwOnError Whether or not to throw an error if the delete operation fails.
     * @returns True if the delete was successful, false otherwise.
     */
    async delete(throwOnError: boolean = false): Promise<boolean> {
        return ActiveModel.entityManager.delete(this, throwOnError);
    }
}