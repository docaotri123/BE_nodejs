import 'reflect-metadata';
import { createExpressServer, Get } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { BookRoomService } from './service/v1.0/BookRoomService';
import { listenToBookingQueue } from './job_queue/worker';
import { SERVER_PORT, sqlConfig, appConfig } from './app.config';
import { optionsSwagger } from './swagger/swagger.config';
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

console.log('connect SQL');
createConnection(sqlConfig)
    .then((connection) => {
        connection.runMigrations();
        const bookingInstance = BookRoomService.getInstance();
        listenToBookingQueue(bookingInstance.handleBookingRooms);
        console.log('connect SQL successfully');
    })
    .catch(err => {
        console.log('Error while connecting to the database', err);
        return err;
    })

const app = createExpressServer(appConfig);
var options = {
    explorer: true
  };
const swaggerSpec = swaggerJsdoc(optionsSwagger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

app.listen(SERVER_PORT, () => console.log(`Server is running port ${SERVER_PORT}`));

export default app;


