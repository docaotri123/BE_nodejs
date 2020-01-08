import { SQL_HOST, SQL_PORT, SQL_USER, SQL_PASSWORD, SQL_DATABASE } from "../environments/environment"
import { ConnectionOptions } from "typeorm"

export const rabbitConfig = {
    uri: process.env.rabbbitUri || 'amqp://localhost',
    workQueue: process.env.workQueue || 'bookingQueue',
}
export const SERVER_HOST = '0.0.0.0'
export const SERVER_PORT = process.env.PORT || 3000
export const SECRET = 'Hotel@@'
export const sqlConfig: ConnectionOptions  = {
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
    cli: {
       entitiesDir: "src/entity",
       migrationsDir: "src/migration"
    }
}

export const sqlConfig_test: ConnectionOptions  = {
   type: "mysql",
   host: SQL_HOST,
   port: SQL_PORT,
   username: SQL_USER,
   password: SQL_PASSWORD,
   database: "test",
   entities: [
      "src/entity/**/*.ts"
   ],
   migrations: [
      "src/migration/**/*.ts"
   ],
   cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration"
   }
}

export const appConfig = {
   defaultErrorHandler: false,
   cors: true,
   controllers: [__dirname + '/controller/*.ts'],
   middlewares: [__dirname + '/middleware/*.ts']
}
