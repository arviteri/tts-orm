import { EntityManager } from './src/orm/entity-manager/entity-manager'; 
import { SQLType, ConnectionInterface } from './src/dbal/connection/i-connection';
import { AbstractRepository } from './src/orm/repository/a-repository';
import { ActiveModel, setEntityManager } from './src/orm/model/a-model';
import { ActiveQuery } from './src/query/active/active-query';
import { QueryBuilder } from './src/query/builder/query-builder';
import { Model } from './src/orm/decorators/model';
import { Column } from './src/orm/decorators/column';
import {
    toBoolean,
    toInt,
    toFloat,
    toBigInt,
    toString,
    toObject
} from './src/orm/lib/types';

/**
 * Configuration used to initiate tts-orm.
 */
interface Configuration {
    /**
     * Database connection used by tts-orm to perform database operations.
     */
    connection: ConnectionInterface;
}

/**
 * Initiates tts-orm.
 * 
 * @param configuration tts-orm configuration.
 */
export function init(configuration: Configuration): EntityManager {
    const entityManager = new EntityManager(configuration.connection);
    setEntityManager(ActiveModel, entityManager);

    return entityManager;
}

export {
    SQLType,
    EntityManager,
    ConnectionInterface,
    AbstractRepository,
    QueryBuilder,
    ActiveModel,
    ActiveQuery,
    Model,
    Column,
    toBoolean,
    toInt,
    toFloat,
    toBigInt,
    toString,
    toObject
};