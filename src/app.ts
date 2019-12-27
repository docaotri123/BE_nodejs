import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { handleBookingRoom } from './util/BookingRoom';
import { listenToBookingQueue } from './job_queue/worker';
import { SERVER_PORT , sqlConfig, appConfig } from './app.config';


(async () => {
    try {
        console.log('connect SQL');
        const connection = await createConnection(sqlConfig);
        await connection.runMigrations();
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = createExpressServer(appConfig);

    await listenToBookingQueue(handleBookingRoom);

    app.listen(SERVER_PORT, () => console.log(`Server is running port ${SERVER_PORT}`));
})();



