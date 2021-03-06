export const ENVIRONMENT = process.env.ENVIRONMENT || 'LOCAL';

const LOCAL_SQL_USER = 'root';
const LOCAL_SQL_HOST = 'localhost';
const LOCAL_SQL_PORT = 3306;
const LOCAL_SQL_PASSWORD = '123456';
const LOCAL_DATABASE_NAME = 'hotel';
const LOCAL_INSTANCE_CONNECTION_NAME = '';

export const SQL_USER = process.env.SQL_USER || LOCAL_SQL_USER;
export const SQL_HOST = process.env.SQL_HOST || LOCAL_SQL_HOST;
export const SQL_PORT = parseInt((process.env.SQL_PORT || LOCAL_SQL_PORT).toString(), 0) || 3306;
export const SQL_PASSWORD = process.env.SQL_PASSWORD || LOCAL_SQL_PASSWORD;
export const SQL_DATABASE = process.env.DATABASE_NAME || LOCAL_DATABASE_NAME;
export const SQL_INSTANCE_CONNECTION_NAME = process.env.INSTANCE_CONNECTION_NAME || LOCAL_INSTANCE_CONNECTION_NAME;

// TYPEORM CONFIG
const LOCAL_ENTITY = '/entity/*{.ts,.js}';
export const TYPE_ORM_ENTITY_LOCATION = process.env.ENTITY_LOCALTION || LOCAL_ENTITY;
