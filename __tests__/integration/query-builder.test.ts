// Test utils
import 'mocha';
import { expect } from 'chai';

// tts-orm
import { QueryBuilder } from '../../index';

describe('QueryBuilder', function () {
    it('should create a query w/ zero conditions', function () {
        const queryBuilder = new QueryBuilder();
        queryBuilder.select('*').from('TestTable');
        const statement = queryBuilder.build();

        expect(statement.sql).equal('SELECT * FROM TestTable');
        expect(statement.parameters).eql([]);
    });

    it('should create a query w/ one condition', function () {
        const queryBuilder = new QueryBuilder();
        queryBuilder.select('col_a', 'col_b')
            .from('TestTable')
            .where('col_a', 1, '=');
        const statement = queryBuilder.build();
        expect(statement.sql).equal('SELECT col_a, col_b FROM TestTable WHERE col_a = ?');
        expect(statement.parameters).eql([1]);
    });

    it('should throw an error on conjugate if no `and()` or `or()` call was made', function () {
        const queryBuilder = new QueryBuilder();
        queryBuilder.select('col_a', 'col_b')
            .from('TestTable')
            .where('col_a', 1, '=');
        expect(queryBuilder.where.bind(queryBuilder, 'col_b', 2, '=')).to.throw('Unset conjunction: `and()` or `or()` call is missing.');
    });

    it('should create a query w/ a conjugated condition', function () {
        const queryBuilder = new QueryBuilder();
        queryBuilder.select('col_a', 'col_b')
            .from('TestTable')
            .where('col_a', 1, '=').and().where('col_b', 2, '=');
        const statement = queryBuilder.build();
        expect(statement.sql).equal('SELECT col_a, col_b FROM TestTable WHERE col_a = ? AND col_b = ?');
        expect(statement.parameters).eql([1, 2]);
    });

    it('should correctly wrap conditions in parentheses', function () {
        const queryBuilder = new QueryBuilder();
        queryBuilder.select('col_a', 'col_b')
            .from('TestTable')
            .openP().where('col_a', 1, '=').and().where('col_b', 2, '=').closeP();

        let statement = queryBuilder.build();
        expect(statement.sql).equal('SELECT col_a, col_b FROM TestTable WHERE (col_a = ? AND col_b = ?)');
        expect(statement.parameters).eql([1, 2]);

        // Test multiple parentheses.
        queryBuilder.or().openP()
            .openP().where('col_a', 5, '<').or().where('col_b', 6, '>').closeP()
            .and()
            .openP().where('col_a', 9, '>=').or().where('col_b', 10, '<=').closeP()
            .closeP();
        
        statement = queryBuilder.build();
        expect(statement.sql).equal('SELECT col_a, col_b FROM TestTable WHERE (col_a = ? AND col_b = ?) OR ((col_a < ? OR col_b > ?) AND (col_a >= ? OR col_b <= ?))');
        expect(statement.parameters).eql([1, 2, 5, 6, 9, 10]);
    });

    it('should be reusable', function () {
        const queryBuilder = new QueryBuilder();
        queryBuilder.select('col_a', 'col_b')
            .from('TestTable')
            .where('col_a', 1, '=');
        let statement = queryBuilder.build();
        expect(statement.sql).equal('SELECT col_a, col_b FROM TestTable WHERE col_a = ?');
        expect(statement.parameters).eql([1]);

        queryBuilder.resetState();

        queryBuilder.select('col_b')
            .from('TestTable')
            .where('col_b', 2, '<');
        statement = queryBuilder.build();
        expect(statement.sql).equal('SELECT col_b FROM TestTable WHERE col_b < ?');
        expect(statement.parameters).eql([2]);
    });

    it('should create a query w/ a non-parameterized value', function () {
        const queryBuilder = new QueryBuilder();
        queryBuilder.select('col_a', 'col_b')
            .from('TestTable')
            .where('col_a', '\'%some_value%\'', 'LIKE', false)
            .and()
            .where('col_b', 1);

        const statement = queryBuilder.build();
        expect(statement.sql).equal('SELECT col_a, col_b FROM TestTable WHERE col_a LIKE \'%some_value%\' AND col_b = ?');
        expect(statement.parameters).eql([1]);
    });
});