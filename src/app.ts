import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { SERVER_PORT } from './app.config';
import { createConnection } from 'typeorm';
import { SQL_HOST, SQL_PORT, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_INSTANCE_CONNECTION_NAME, TYPE_ORM_ENTITY_LOCATION } from '../environments/environment';

const app = createExpressServer({
    defaultErrorHandler: false,
    cors: true,
    controllers: [__dirname + '/controller/*.ts'],
    middlewares: [__dirname + '/middleware/*.ts']
});

console.log('****infomation cloud db5***');

createConnection({
    type: 'mysql',
    host: SQL_HOST,
    port: SQL_PORT,
    username: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    migrations: ["migration/*.ts"],
    entities: [
        __dirname + TYPE_ORM_ENTITY_LOCATION
    ],
    cli: {
        migrationsDir: "migration"
    },
    synchronize: false,
    logging: false
})
    .then(async (conn) => {
        await conn.runMigrations();
        console.log(`Server connect DB !`);
        app.listen(SERVER_PORT, () => {
            console.log(`Server is running port ${SERVER_PORT}`);
        
        });
    })
    .catch(err => {
        console.log(' ** connetc DB fail **');
        console.dir(err, {depth: 0})
    });



