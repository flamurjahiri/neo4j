import {Injectable} from '@nestjs/common';
import {Neo4jOperationProcessor} from '../neo4j.operation.processor';
import {Record, RxSession} from 'neo4j-driver';
import {forkJoin, Observable, reduce, toArray} from 'rxjs';
import {Parameters} from 'neo4j-driver/types/query-runner';
import {TransactionConfig} from 'neo4j-driver-core';
import {Neo4jOperation} from '../neo4j.operation.type';

@Injectable()
export class WriteOperation extends Neo4jOperationProcessor<Record> {

    run(queries: string[], session: RxSession, parameters?: Parameters, config?: TransactionConfig): Observable<Record[]> {
        return session.executeWrite(tx => {
            return forkJoin(
                queries.map(query => tx.run(query, parameters).records().pipe(toArray()))
            ).pipe(
                reduce((a, v: Record[][]) => a.concat(...v), [] as Record[])
            );
        }, config);
    }

    getType(): Neo4jOperation {
        return Neo4jOperation.WRITE;
    }
}
