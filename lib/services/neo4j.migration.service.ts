import {Driver} from "neo4j-driver";
import {
    concatMap,
    defer,
    filter,
    finalize,
    forkJoin,
    from,
    map,
    mergeMap,
    Observable,
    of,
    reduce,
    takeLast,
    tap
} from "rxjs";
import {Neo4JMigration} from "../entities";
import {Logger} from "@nestjs/common";


export class Neo4jMigrationService {

    constructor(private readonly driver: Driver, private readonly versions: Neo4JMigration[]) {
    }


    migrate(): Observable<any> {

        if (!this.versions?.length) {
            return of(void 0);
        }

        const sortedVersions = this.versions.sort((a, b) => a.version() - b.version());

        const session = this.driver.rxSession();

        return session.executeRead(tx => tx.run('MATCH (m:InternalNeo4jMigration) RETURN m').records()).pipe(
            map(r => r.get('version') as number),
            reduce((a, version) => a.concat(version), [] as number[]),
            mergeMap(savedMigrations => {

                    return from(sortedVersions).pipe(
                        filter(version => {
                            const found = (savedMigrations || []).includes(version.version());

                            if (found) {
                                Logger.debug(`Neo4j Migration: ${version.version()} skipped because it has been executed earlier!`);
                                return false;
                            }

                            return true;
                        }),
                        concatMap(migration => {

                            return defer(() => from(migration.migrationQuery())).pipe(
                                reduce((a, v: string | string[]) => a.concat(v), [] as string[]),
                                mergeMap(queries => {
                                    return session.executeWrite(tx =>
                                        forkJoin(queries.map(q => tx.run(q).consume())).pipe(takeLast(1))
                                    );
                                }),
                                takeLast(1),
                                concatMap(() => {
                                    return session.executeWrite(tx => tx.run('CREATE (a:InternalNeo4jMigration {version: $version, description: $description, createdAt: $createdAt})', {
                                        version: migration.version(),
                                        description: migration.description(),
                                        createdAt: new Date()
                                    }).consume().pipe(takeLast(1)));
                                }),
                                tap({
                                    next: () => Logger.log(`Neo4j Migration: ${migration.version()} executed successfully!`),
                                    error: (error) => Logger.error(`Neo4j Migration: ${migration.version()} failed to execute!`, error)
                                })
                            )

                        }),
                        takeLast(1),
                    )
                }
            ),
            tap(_ => Logger.log('Neo4j Migration: All Database migration started successfully!')),
            finalize(() => session.close().subscribe({error: (err) => Logger.error('Failed to close session', err)}))
        )


    }

}