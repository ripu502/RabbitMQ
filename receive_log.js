const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'logs';

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        // assertQueue for making a queue if not exist with randomName
        // which is exclusive means will be deleted 
        // when the receiver_log.js is stop or receiver is lost
        // when the queue is created function is called which takes error and reply
        // reply have queue name in it which is accessed by q.queue in this example
        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            // conecting our newly created queue with the echange having msg
            channel.bindQueue(q.queue, exchange, '');
            // consuming the msg from queue
            channel.consume(q.queue, function (msg) {
                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                }
            }, {
                    noAck: true
                });
        });
    });
});