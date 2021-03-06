import { Operator } from '../../query/condition/base-condition';
import { ActiveQuery } from '../../query/active/active-query';
import { EntityManager } from '../entity-manager/entity-manager';
import {SQLType} from '../../dbal/connection/i-connection';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Sets the static entityManager property on the ActiveModel class. This should
 * only be done once, and should only be done during initialization.
 * 
 * @param ActiveModel ActiveModel class.
 * @param entityManager EntityManager instance to set on the ActiveModel class.
 * 
 * @internal.
 */
export function setEntityManager(ActiveModel: Function, entityManager: EntityManager): void { // eslint-disable-line
    const _class: any = ActiveModel; // eslint-disable-line
    _class['entityManager'] = entityManager;
}

/**
 * Checks a model class for an EntityManager instance.
 *
 * Intention: allow ActiveQuery to inherit the connection
 * from the EntityManager instance attached to the model
 * class passed to the constructor.
 *
 * @param Model class of model to check for EntityManager instance.
 *
 * @internal
 */
export function checkEntityManager(Model: Function): EntityManager | null { // eslint-disable-line
    const _class: any = Model; // eslint-disable-line
    const value = _class['entityManager'] ?? null;

    if (value && value instanceof EntityManager) {
        return value;
    }

    return null;
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
     * Saves the model instance to the database.
     * 
     * @param throwOnError Whether or not to throw an error if the save operation fails.
     * @returns True if the save was successful, false otherwise.
     */
    async save(throwOnError = false): Promise<boolean> {
        return ActiveModel.entityManager.save(this, throwOnError);
    }

    /**
     * Deletes the model instance from the database.
     * 
     * @param throwOnError Whether or not to throw an error if the delete operation fails.
     * @returns True if the delete was successful, false otherwise.
     */
    async delete(throwOnError = false): Promise<boolean> {
        return ActiveModel.entityManager.delete(this, throwOnError);
    }

    /**
     * Creates an ActiveQuery instance based on the model with using the condition provided.
     *
     * @param operand Operand which the condition operates upon.
     * @param value Value to check the operand against.
     * @param operator Operator used in condition.
     * @param parameterize Whether or not to parameterize the value.
     */
    static where(operand: string, value: SQLType, operator: Operator = '=', parameterize = true): ActiveQuery {
        const model: any = this; // eslint-disable-line
        const query = new ActiveQuery(model);
        query.where(operand, value, operator, parameterize);

        return query;
    }
}