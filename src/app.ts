import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { SERVER_PORT } from './app.config';
import { excercise1 } from './excercise1/excercise1A'
import { excercise4 } from './excercise4/excercise4';

const app = createExpressServer({});

// excercise 1
console.log('Excercise 1');

console.log(excercise1());

// excercise 4
console.log('Excercise 4');
// console.log(excercise4());


app.listen(SERVER_PORT, () => {
    console.log(`Server is running port ${SERVER_PORT}`);
    
});
