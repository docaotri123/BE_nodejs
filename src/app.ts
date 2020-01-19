import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { BookRoomService } from './service/book_room/BookRoomV1.0Service';
import { listenToBookingQueue } from './job_queue/worker';
import { SERVER_PORT, sqlConfig, appConfig } from './app.config';

console.log('connect SQL');
createConnection(sqlConfig)
    .then((connection) => {
        connection.runMigrations();
        const bookingInstance = BookRoomService.getInstance();
        listenToBookingQueue(bookingInstance.handleBookingRooms);
    })
    .catch(err => {
        console.log('Error while connecting to the database', err);
        return err;
    })

const app = createExpressServer(appConfig);

app.listen(SERVER_PORT, () => console.log(`Server is running port ${SERVER_PORT}`));


export default app;


