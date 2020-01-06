const amqp = require('amqplib');
import { resolve } from 'bluebird'
import { rabbitConfig } from '../app.config';

const assertQueueOptions = { durable: true }
const consumeQueueOptions = { noAck: false }
const { uri, workQueue } = rabbitConfig
let done = null;

const assertAndConsumeQueue = (channel, doWork) => {

    const ackMsg = (msg) => resolve(msg)
        .tap(async () => done = await doWork(JSON.parse(msg.content.toString())))
        .then((msg) => {
            if(done) {
                console.log('done task queue');
                channel.ack(msg);
            } else {
                console.log('error when handle task queue'); 
                process.exit(0);
            }
        })

    return channel.assertQueue(workQueue, assertQueueOptions)
        .then(() => channel.prefetch(1))
        .then(() => channel.consume(workQueue, ackMsg, consumeQueueOptions))
}
  
export const listenToBookingQueue = (doWork) => amqp.connect(uri)
    .then(connection => connection.createChannel())
    .then(channel => assertAndConsumeQueue(channel, doWork))