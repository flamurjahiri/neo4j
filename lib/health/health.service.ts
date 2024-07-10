import {OnModuleDestroy} from '@nestjs/common';
import {HealthCheckError, HealthIndicator, HealthIndicatorResult} from '@nestjs/terminus';
import {Driver} from 'neo4j-driver';
import {catchError, filter, from, map, mergeMap, Observable, of, throwError, toArray} from 'rxjs';
import {fromPromise} from "rxjs/internal/observable/innerFrom";

class HealthResultData {
    name: string;
    value: boolean;
    error?: any;
}

export class Neo4JHealthService extends HealthIndicator implements OnModuleDestroy {

    constructor(private readonly data: { connectionName: string, driver: Driver }[]) {
        super();
    }

    async onModuleDestroy(): Promise<void[]> {
        return Promise.all(this.data?.map(d => d?.driver?.close()) || []);
    }

    check(): Observable<HealthIndicatorResult> {
        const startTime = new Date();

        const getStatus = (status: boolean, data: HealthResultData[]): HealthIndicatorResult => {
            return this.getStatus('Neo4j Health Check', status, {
                data, duration: new Date().getTime() - startTime.getTime()
            });
        };


        return from(this.data || []).pipe(
            filter(d => !!d?.driver),
            mergeMap(d => fromPromise(d.driver.getServerInfo()).pipe(
                map(() => ({name: GET_CONNECTION_SIMPLIFY_NAME(d.connectionName), value: true})),
                catchError(err => of({name: GET_CONNECTION_SIMPLIFY_NAME(d.connectionName), value: false, err}))
            )),
            toArray(),
            mergeMap(results => {

                const isHealthy = !results.find(r => !r.value);

                if (!isHealthy) {
                    return throwError(() => new HealthCheckError('Neo4j Health Check', getStatus(false, results)));
                }

                return of(getStatus(true, results));

            })
        );

    }

}

const GET_CONNECTION_SIMPLIFY_NAME = (connectionName: string): string => {
    const split = connectionName?.split('_');

    return split[split.length - 1];
};
