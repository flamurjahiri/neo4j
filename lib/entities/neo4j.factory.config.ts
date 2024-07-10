export class Neo4jFactoryConfig {
    database: string;
    connectionName?: string;
    indexes?: string[];


    constructor(database: string, connectionName?: string, indexes?: string[]) {
        this.database = database;
        this.indexes = indexes;
        this.connectionName = connectionName;
    }
}
