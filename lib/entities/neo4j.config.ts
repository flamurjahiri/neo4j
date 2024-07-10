import {types} from 'neo4j-driver-core';

export class Neo4jConfig {
    uri: string;
    user: string;
    password: string;
    connectionName?: string;
    config?: types.Config;


    constructor(uri: string, user: string, password: string, connectionName?: string, config?: types.Config) {
        this.uri = uri;
        this.user = user;
        this.password = password;
        this.config = config;
        this.connectionName = connectionName;
    }
}
