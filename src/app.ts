import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { SERVER_PORT } from './app.config';
import { createConnection } from 'typeorm';
import { SQL_HOST, SQL_PORT, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_INSTANCE_CONNECTION_NAME, TYPE_ORM_ENTITY_LOCATION } from '../environments/environment';
import { Controllers } from './controller/AllController';

const app = createExpressServer({
    defaultErrorHandler: false,
    controllers: Controllers,
    middlewares: []
});

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
// here you can start to work with your entities
})
.catch(err => console.log(err));


app.listen(SERVER_PORT, () => {
    console.log(`Server is running port ${SERVER_PORT}`);
    
});
