import {init} from '../../../index';
import {Connection} from '../connections/sqlite3/connection';
import {Database} from 'sqlite3';

/**
 * EntityManager used throughout the the test suite.
 *
 * IMPORTANT: This is done to ensure one initialization
 * in the test suite. Initializing tts-orm multiple times
 * will produce unexpected results in the Active Record
 * implementation due to the change in references to the
 * database connection instance.
 */
export const entityManager = init({
    connection: new Connection(new Database(':memory:'))
});