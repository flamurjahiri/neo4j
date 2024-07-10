# Neo4j for NestJS: Simple, Powerful, and Fun 🚀

![Neo4j Logo](assets/logo.png)
<br>
<br>
This module provides a simple and efficient way to interact with Neo4j databases within your NestJS applications. It
offers a clean and intuitive API for executing queries, managing connections, and handling health checks.

## Ready to Unleash the Power of Graphs? Let's Get Coding!

### Installation

```bash
npm i neo4j-nestjs
```

### Configuration

#### Neo4JModule.forRoot()

> The Neo4jModule.forRoot() is used to configure the Neo4j module for your application's root module. It provides a
> global configuration for all Neo4j connections within your application.
>
> This method takes an object with the following configuration options | Single or Array:
>
> * **uri:** The URI of the Neo4j database.
> * **user:** The username for the Neo4j database.
> * **password:** The password for the Neo4j database.
> * **connectionName:** (Optional) The name of the connection (in case of multiple clusters).
>
> **Example:**
>
> ```typescript
> import { Module } from '@nestjs/common';
> import { Neo4jModule } from 'neo4j-nestjs';
>
> @Module({
>   imports: [
>     Neo4jModule.forRoot({
>       uri: 'bolt://localhost:7687',
>       user: 'neo4j',
>       password: 'password',
>       connectionName: 'default'
>     }),
>   ],
> })
> export class AppModule {}
> ```

#### Neo4jModule.forFeature()

> The Neo4jModule.forFeature() allows you to configure the Neo4j module for a specific feature module.
>
> This method takes an object with the following configuration options | Single or Array:
>
> * **database:** The database name.
> * **indexes:** List of indexes you want to create on startup for that database.
> * **connectionName:** (Optional) The name of the connection (in case of multiple clusters).
>
> **Example:**
>
> ```typescript
> import { Module } from '@nestjs/common';
> import { Neo4jModule } from 'neo4j-nestjs';
>
> @Module({
>   imports: [
>     Neo4jModule.forFeature({
>       database: 'neo4j',
>       indexes: ['CREATE INDEX ON :Person(name)'],
>       connectionName: 'default'
>     }),
>   ],
> })
> export class UserModule {}
> ```

### Usage

#### Database Service

> The database service is used that you can run/execute single/multiple queries on the Neo4j database.
>
> You can Read, Write or Execute a query on the database.
>
> **Comments:**
>
> * **InjectNeo4jDatabase:** This token is used to inject the Neo4JUtils(database utils) into your class.
> * **database:** Specifies the name of the database.
> * **connectionName:** (Optional) The name of the connection (in case of multiple clusters).
>
> **Example:**
>
> ```typescript
> import { Injectable, Inject } from '@nestjs/common';
> import { InjectNeo4jDatabase , Neo4JUtils } from 'neo4j-nestjs';
> 
> @Injectable()
> export class MyService {
> 
>   @InjectNeo4jDatabase('myDatabase', 'connectionName') private readonly neo4j: Neo4JUtils;
> 
>   async getDataAsPromise() {
>      const result = await lastValueFrom(this.neo4j.query('MATCH (n) RETURN n', 'READ'));
>      return result;
>   }
>
>   getDataAsObservable() {
>      return this.neo4j.query('MATCH (n) RETURN n', 'READ');
>   }
>}
> ```

#### Health Service

> The health service is used to check the health of the Neo4j database connection.
>
> You can use a specific client or all clients to check the health of the Neo4j database.
>
> **Comments:**
>
> * **InjectNeo4jHealth:** This token is used to inject the Neo4JHealthService into your class.
> * **connectionName:** (Optional) The name of the connection (in case of multiple clusters).
>
> * **checkHealth:** This method on the Neo4JHealthService performs a health check on the Neo4j connection and returns a health status object.
>
> **Example:**
>
> ```typescript
> import { Injectable, Inject } from '@nestjs/common';
> import { InjectNeo4jDatabase , Neo4JUtils } from 'neo4j-nestjs';
> 
> @Injectable()
> export class HealthCheckService {
> 
>   @InjectNeo4jHealth('connectionName') private readonly healthService: Neo4JHealthService;
> 
>   async checkHealthAsPromise() {
>      const health = await lastValueFrom(this.healthService.check());
>      return result;
>   }
>
>   checkHealthAsObservable() {
>      return this.healthService.check();
>   }
>}
> ```