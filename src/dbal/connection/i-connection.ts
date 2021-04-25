/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Represents valid Js/Ts types that can safely be inserted into a database.
 */
export type SQLType = string | number | boolean | null;

/**
 * Interface which defines a database connection.
 */
export interface ConnectionInterface {
    /**
     * Runs a SQL query against the database and returns the results. 
     * 
     * @param sql Query to be executed against the database.
     * @param parameters Parameters of the SQL query.
     * @return An array of database rows.
     */
    query(sql: string, parameters: SQLType[]): Promise<any[]>; // eslint-disable-line

    /**
     * Executes a SQL statement against the database. 
     * 
     * @param sql Statement to be executed against the database.
     * @param parameters Parameters of the SQL statement.
     */
    exec(sql: string, parameters: SQLType[]): Promise<void>;

    /**
     * Returns the last inserted id in the database.
     */
    lastId(): Promise<number | null>;

    /**
     * Begins a database transaction.
     */
    beginTransaction(): Promise<void>;

    /**
     * Commits a database transaction.
     */
    commit(): Promise<void>;

    /**
     * Rolls back a database transaction.
     */
    rollback(): Promise<void>;
}