import {Observable} from "rxjs";

export abstract class Neo4JMigration {

    connection(): string {
        return 'default';
    }

    abstract version(): number;

    abstract description(): string;

    abstract migrationQuery(): Observable<string> | Observable<string[]> | Promise<string> | Promise<string[]> | string | string[]

}