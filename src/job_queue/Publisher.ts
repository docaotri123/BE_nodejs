const amqp = require('amqplib');
import { resolve } from 'bluebird'
import { rabbitConfig } from '../app.config';

const assertQueueOptions = { durable: true }
const sendToQueueOptions = { persistent: true }
let data = 'data receive from API'
const { uri, workQueue } = rabbitConfig

const lightTask = () => resolve(console.log('Light task abstraction'))

const assertAndSendToQueue = channel => {
    const bufferedData = Buffer.from(JSON.stringify(data))

    return channel.assertQueue(workQueue, assertQueueOptions)
        .then(() => channel.sendToQueue(workQueue, bufferedData, sendToQueueOptions))
        // .then(() => channel.close())
}

const sendHardTaskToQueue = () => amqp.connect(uri)
    .then(connection => connection.createChannel())
    .then(channel => assertAndSendToQueue(channel))

export const startPublisher = dataAPI => lightTask()
    .tap(() => data = dataAPI)
    .then(() => sendHardTaskToQueue())
