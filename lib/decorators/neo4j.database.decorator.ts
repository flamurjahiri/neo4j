import {Inject} from '@nestjs/common';
import {NEO_4J_CONNECTION_DRIVER, NEO_4J_DATABASE, NEO_4J_HEALTH_CHECK} from "../constants";


export function InjectNeo4jDatabase(database: string, connectionName?: string) {
    return Inject(NEO_4J_DATABASE(database, connectionName));
}

export function InjectNeo4jDriver(connectionName?: string) {
    return Inject(NEO_4J_CONNECTION_DRIVER(connectionName));
}

export function InjectNeo4jHealth(connectionName?: string) {
    return Inject(NEO_4J_HEALTH_CHECK(connectionName));
}
