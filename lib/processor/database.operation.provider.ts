import {Inject, Injectable} from '@nestjs/common';
import {ReadOperation} from './impl/read.operation';
import {WriteOperation} from './impl/write.operation';
import {ExecuteOperation} from './impl/execute.operation';
import {Neo4jOperationProcessor} from './neo4j.operation.processor';
import {Neo4jOperation} from './neo4j.operation.type';

@Injectable()
export class DatabaseOperationProvider {
    @Inject(ReadOperation) private readonly readOperation: ReadOperation;
    @Inject(WriteOperation) private readonly writeOperation: WriteOperation;
    @Inject(ExecuteOperation) private readonly defaultOperation: ExecuteOperation;


    getProvider(operation: Neo4jOperation): Neo4jOperationProcessor<any> {
        return [this.readOperation, this.writeOperation, this.defaultOperation].find(r => r.getType() === operation);
    }
}
