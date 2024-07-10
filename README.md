# Neo4j Module for NestJS

This module provides a simple and efficient way to interact with Neo4j databases within your NestJS applications. It
offers a clean and intuitive API for executing queries, managing connections, and handling health checks.

## Installation

```bash
npm i neo4j-nestjs
```

## USAGE:

### For Root Module:

#### The forRoot method is used to configure the Neo4j module for your application's root module. It provides a global configuration for all Neo4j connections within your application.

#### uri: connection uri

#### user: username

#### password: password

#### connectionName: (Optional) the name of connection (in case of multiple clusters)

```
import { Module } from '@nestjs/common';
import { Neo4jModule } from 'neo4j-nestjs';

@Module({
  imports: [
    Neo4jModule.forRoot({
      uri: 'bolt://localhost:7687',
      user: 'neo4j',
      password: 'password',
      connectionName : 'default'
    }),
  ],
})
export class AppModule {}
```

### For Feature Module

#### forFeature: This method allows you to configure the Neo4j module for a specific feature module.

#### database: Specifies the name of the database connection.

#### connection: This name is used to identify the connection when injecting the Neo4JUtils service.

#### indexes: (Optional) An array of Cypher queries to create indexes on the database.

```
import { Module } from '@nestjs/common';
import { Neo4jModule } from 'neo4j-nestjs';

@Module({
  imports: [
    Neo4jModule.forFeature([
      {
        database: 'myDatabase', // Name of the database connection
        indexes: ['CREATE INDEX ON :Person(name)'], // Optional: Create indexes
      },
    ]),
  ],
})
export class MyFeatureModule {}

```

### Inject the Database Service

#### database: Specifies the name of the database connection.

#### connection: (Optional) This name is used to identify the connection when injecting the Neo4JUtils service.

```
import { Injectable, Inject } from '@nestjs/common';
import { NEO_4J_DATABASE , Neo4JUtils } from 'neo4j-nestjs';

@Injectable()
export class MyService {
  constructor(
    @Inject(NEO_4J_DATABASE('myDatabase', 'connectionName'))
    private readonly neo4j: Neo4JUtils,
  ) {}

  async getDataAsPromise() {
    const result = await lastValueFrom(this.neo4j.query('MATCH (n) RETURN n', 'READ'));
    return result;
  }
  
  getDataAsObservable() {
    return this.neo4j.query('MATCH (n) RETURN n', 'READ');
  }
}
```

### Inject the Health Check

#### NEO_4J_HEALTH_CHECK: This token is used to inject the Neo4JHealthService into your providers.

#### connectionName: (Optional) This name is used to identify the connection when injecting the Neo4JUtils service.

#### checkHealth(): This method on the Neo4JHealthService performs a health check on the Neo4j connection and returns a health status object.

```
import { Injectable, Inject } from '@nestjs/common';
import { Neo4JHealthService , NEO_4J_HEALTH_CHECK } from 'neo4j-nestjs';

@Injectable()
export class HealthCheckService {
  constructor(
    @Inject(NEO_4J_HEALTH_CHECK('connectionName'))
    private readonly healthService: Neo4JHealthService,
  ) {}

  async checkHealthAsPromise() {
    const health = await lastValueFrom(this.healthService.check());
    return health;
  }
  
  checkHealthAsObservable() {
    return this.healthService.check();
  }
}
```