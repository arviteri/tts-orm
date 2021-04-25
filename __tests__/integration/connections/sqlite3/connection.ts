import { Database } from 'sqlite3';
import {ConnectionInterface, SQLType} from '../../../../index';

/**
 * SQLite3 Connection created for integration testing purposes.
 */
export class Connection implements ConnectionInterface {
    private lastInsertedId: number | null = null;

    constructor(
        private database: Database
    ) {}

    async query(sql: string, parameters: SQLType[]): Promise<any[]> { // eslint-disable-line
        // eslint-disable-next-line
        return new Promise<any[]>((resolve, reject) => {
            this.database.all(sql, parameters, function (err, rows) {
                if (err) { 
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    async exec(sql: string, parameters: SQLType[]): Promise<void> {
        const _this = this; // eslint-disable-line

        return new Promise<void>((resolve, reject) => {
            _this.database.run(sql, parameters, function (err) {
                if (err) { 
                    reject(err);
                }
                
                _this.lastInsertedId = this.lastID;
                resolve();
            });
        });
    }

    async lastId(): Promise<number | null> {
        return this.lastInsertedId;
    }

    beginTransaction(): Promise<void> {
        throw new Error('Not supported for test cases.');
    }

    commit(): Promise<void> {
        throw new Error('Not supported for test cases.');
    }
    rollback(): Promise<void> {
        throw new Error('Not supported for test cases.');
    }
}