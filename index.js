const express = require('express')
const account = require('./xrp/account')
const recharge = require('./xrp/recharge')
const withdraw = require('./xrp/withdraw')
const blocknumber = require('./xrp/blocknumber')
const logger = require('./lib/logger')
const app = express()

app.use('/xrp', [account, recharge, withdraw, blocknumber])

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
