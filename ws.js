const ClusterWs = require('clusterws')
const logger = require('./lib/logger')

new ClusterWs({
    worker: Worker,
    port: 3031
})

function Worker() {
    global.wss = this.wss

    wss.on('connection', (socket) => {
        logger.info('new socket is connected')

        require('./lib/accountInfo')
        setTimeout(function() {
            wss.publish('accountInfo', {code: 666, msg: 'account info has been subscribed'})
        }, 1000)
    })
}

process.on('uncaughtException', (err) => {
    if (err) {
        logger.error(err);
    }
});

process.on('unhandledRejection', (err) => {
    if (err) {
        logger.error(err);
    }
});
