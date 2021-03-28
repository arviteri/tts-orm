import { Database } from 'sqlite3';
import { ConnectionInterface } from '../../../../src/dbal/connection/i-connection';

/**
 * SQLite3 Connection created for integration testing purposes.
 */
export class Connection implements ConnectionInterface {
    private lastInsertedId: any = null;

    constructor(
        private database: Database
    ) {}

    async query(sql: string, parameters: any[]): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.database.all(sql, parameters, function (err, rows) {
                if (err) { 
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    async exec(sql: string, parameters: any[]): Promise<void> {
        const _this = this;
        return new Promise<void>(function (resolve, reject) {
            _this.database.run(sql, parameters, function (err) {
                if (err) { 
                    reject(err);
                }
                
                _this.lastInsertedId = this.lastID;
                resolve();
            });
        });
    }

    async lastId(): Promise<any> {
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