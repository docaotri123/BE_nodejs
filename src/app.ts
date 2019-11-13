import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { SERVER_PORT } from './app.config';
import { exercise4 } from './exercise4/exercise4'
import { exercise1 } from './exercise1/exercise1';
const app = createExpressServer({});

// excercise 1
console.log('Exercise 1');

console.log(exercise1());

// excercise 4
console.log('Exercise 4');
console.log(exercise4());


app.listen(SERVER_PORT, () => {
    console.log(`Server is running port ${SERVER_PORT}`);
    
});
