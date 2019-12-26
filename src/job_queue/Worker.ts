const amqp = require('amqplib');
import { resolve } from 'bluebird'
import { rabbitConfig } from '../app.config';

const assertQueueOptions = { durable: true }
const consumeQueueOptions = { noAck: false }
const { uri, workQueue } = rabbitConfig

const assertAndConsumeQueue = (channel, doWork) => {
    console.log('Worker is running! Waiting for new messages...')

    const ackMsg = (msg) => resolve(msg)
        .tap(() => doWork(JSON.parse(msg.content.toString())))
        .then((msg) => channel.ack(msg))

    return channel.assertQueue(workQueue, assertQueueOptions)
        .then(() => channel.prefetch(1))
        .then(() => channel.consume(workQueue, ackMsg, consumeQueueOptions))
}
  
export const listenToQueue = (doWork) => amqp.connect(uri)
    .then(connection => connection.createChannel())
    .then(channel => assertAndConsumeQueue(channel, doWork))