const express = require('express')
const account = require('./xrp/account')
const recharge = require('./xrp/recharge')
const transfer = require('./xrp/transfer')
const server = require('./xrp/server')
const logger = require('./lib/logger')
const app = express()

app.use('/xrp', [account, recharge, transfer, server])

app.listen(3030, () => console.log('xrp restful api listening on port 3030'))

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
