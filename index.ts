import { EntityManager } from './src/orm/entity-manager/entity-manager'; 
import { ConnectionInterface } from './src/dbal/connection/i-connection';
import { AbstractRepository } from './src/orm/repository/a-repository';
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
    return new EntityManager(configuration.connection);
}

export {
    ConnectionInterface,
    AbstractRepository,
    QueryBuilder,
    Model,
    Column,
    toBoolean,
    toInt,
    toFloat,
    toBigInt,
    toString,
    toObject
};