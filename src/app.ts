import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { SERVER_PORT } from './app.config';
import { RotationK, data } from './excercise1/excercise1A'

const app = createExpressServer({});

console.log(RotationK(data, 2));


app.listen(SERVER_PORT, () => {
    console.log(`Server is running port ${SERVER_PORT}`);
    
});
