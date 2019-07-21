// nodemon is not in package.json
// run the file with node new_task.js sender or producer
// worker.js consumer doing the work send
const amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'task_queue';
        // process.argv is used is used to get the world with the running of file
        // example.......
        // ./new_task.js First message.   running this file with First message as perameter
        var msg = process.argv.slice(2).join(' ') || "Hello World!";


        // making the queue durable so that if server (rabbitmq)
        // data may not lost
        channel.assertQueue(queue, {
            durable: true
        });

        // setting perisistent since rabbitmq server is durable
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        console.log(" [x] Sent '%s'", msg);
    });

    // closing the connection
    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});