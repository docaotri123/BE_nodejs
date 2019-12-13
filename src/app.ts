import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { SERVER_PORT } from './app.config';
import { createConnection } from 'typeorm';
import { SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_PORT, SQL_HOST } from '../environments/environment';


(async () => {
    try {
        const connection = await createConnection({
            type: "mysql",
            host: SQL_HOST,
            port: SQL_PORT,
            username: SQL_USER,
            password: SQL_PASSWORD,
            database: SQL_DATABASE,
            entities: [
               "src/entity/**/*.ts"
            ],
            migrations: [
               "src/migration/**/*.ts"
            ],
            subscribers: [
               "src/subscriber/**/*.ts"
            ],
            cli: {
               entitiesDir: "src/entity",
               migrationsDir: "src/migration",
               subscribersDir: "src/subscriber"
            }
         });
        await connection.runMigrations();
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = createExpressServer({
        defaultErrorHandler: false,
        cors: true,
        controllers: [__dirname + '/controller/*.ts'],
        middlewares: [__dirname + '/middleware/*.ts']
    });
    app.listen(SERVER_PORT, () => {
        console.log(`Server is running port ${SERVER_PORT}`);

    });
})();



