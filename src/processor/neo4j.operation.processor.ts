import {RxSession} from 'neo4j-driver';
import {Observable} from 'rxjs';
import {Parameters} from 'neo4j-driver/types/query-runner';
import {Neo4jOperation} from './neo4j.operation.type';
import {Record, ResultSummary, TransactionConfig} from 'neo4j-driver-core';

export abstract class Neo4jOperationProcessor<T extends ResultSummary | Record> {

    abstract getType(): Neo4jOperation;

    // records => The records function returns an Observable which produces a stream of rows
    // consume =>  Not interested in any rows, just the summary
    abstract run(queries: string[], session: RxSession, parameters?: Parameters, config?: TransactionConfig): Observable<T[]>;

}
