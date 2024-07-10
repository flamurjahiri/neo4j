import {BadRequestException, Logger} from '@nestjs/common';
import {Driver} from 'neo4j-driver';
import {finalize, map, Observable, throwError} from 'rxjs';
import {Record, ResultSummary, SessionConfig, TransactionConfig} from 'neo4j-driver-core';
import {DatabaseOperationProvider} from '../processor/database.operation.provider';
import {Parameters} from 'neo4j-driver/types/query-runner';
import {Neo4jOperation} from '../processor/neo4j.operation.type';

export class Neo4JUtils {

    constructor(private readonly driver: Driver, private readonly database: string, private readonly operationProvider: DatabaseOperationProvider) {
    }


    query(query: string, operation: Neo4jOperation, parameters?: Parameters): Observable<Record[]> {
        return this.runQueries([query], operation, parameters);
    }

    // Comment #1
    // Keep in mind that executing a lot of queries, you keep a database connection opened for a very long time.
    // Basically, until you read/write the whole content.
    // As you don't have many connection (limited by the database),
    // doing so will keep a dedicated connection that cannot be used by the rest of the application.
    runQueries(queries: string[], operation: Neo4jOperation, parameters?: Parameters): Observable<Record[]> {
        if (operation === Neo4jOperation.EXECUTE) {
            return throwError(() => new BadRequestException('Only Read/Write Inputs allowed!'));
        }

        return this.run(queries, operation, parameters) as Observable<Record[]>;
    }


    execute(query: string, parameters?: Parameters): Observable<ResultSummary> {
        return this.runExecution([query], parameters).pipe(
            map(r => r?.[0])
        );
    }

    // Relates to Comment #1
    runExecution(queries: string[], parameters?: Parameters): Observable<ResultSummary[]> {
        return this.run(queries, Neo4jOperation.EXECUTE, parameters) as Observable<ResultSummary[]>;
    }


    private run(queries: string[],
                operation: Neo4jOperation,
                parameters?: Parameters,
                config?: TransactionConfig,
                sessionParams?: SessionConfig): Observable<ResultSummary[] | Record[]> {
        const session = this.driver.rxSession({...(sessionParams || {}), database: this.database});

        const provider = this.operationProvider.getProvider(operation);

        if (!provider) {
            return throwError(() => new BadRequestException('Not supported!'));
        }

        // because of the Comment #1
        // we close connection on stream finish
        return provider.run(queries, session, parameters || {}, config).pipe(
            finalize(() => session.close().subscribe({error: (err) => Logger.error('Failed to close session', err)}))
        );
    }


}
