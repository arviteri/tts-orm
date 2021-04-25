import {SQLType} from '../../dbal/connection/i-connection';

/**======================================
 *  FOR INTERNAL USE ONLY
 *=======================================*/

/**
 * Interface which defines a SQL statement.
 * 
 * @interal
 */
export interface Statement {
    /**
     * Raw SQL statement.
     */
    sql: string;

    /**
     * Parameter values of the SQL statement.
     */
    parameters: SQLType[];
}