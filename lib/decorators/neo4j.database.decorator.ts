import {Inject} from '@nestjs/common';
import {NEO_4J_CONNECTION_DRIVER, NEO_4J_DATABASE, NEO_4J_HEALTH_CHECK} from "../constants";


export function Neo4jDatabase(database: string, connectionName?: string) {
    return Inject(NEO_4J_DATABASE(database, connectionName));
}

export function Neo4jDriver(connectionName?: string) {
    return Inject(NEO_4J_CONNECTION_DRIVER(connectionName));
}

export function Neo4jHealth(connectionName?: string) {
    return Inject(NEO_4J_HEALTH_CHECK(connectionName));
}
