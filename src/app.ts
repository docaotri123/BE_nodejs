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

console.log('infomation cloud db1');
console.log(SQL_HOST);
console.log(SQL_DATABASE);
console.log(SQL_USER);
console.log(SQL_PASSWORD);

createConnection({
    type: 'mysql',
    host: SQL_HOST,
    port: SQL_PORT,
    username: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    extra: {
        'socketPath': SQL_INSTANCE_CONNECTION_NAME
    },
    entities: [
        __dirname + TYPE_ORM_ENTITY_LOCATION
    ],
    synchronize: true,
    logging: false
})
    .then((conn) => {
        console.log(`Server connect DB !`);
    })
    .catch(err => {
        console.log(' ** connetc DB fail **');
        console.log(err)
    });


app.listen(SERVER_PORT, () => {
    console.log(`Server is running port ${SERVER_PORT}`);

});
