const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const { xrp, xrpPromise } = require('../lib/websocket')
const logger = require('../lib/logger')

router.use(bodyParser.json())

router.use(function timeLog(req, res, next) {
    logger.info('Request Original Url: ' + req.originalUrl)
    next()
})

router.post('/generateAddress', async function (req, res) {
    const bob = await xrp.generateAddress()
    const data = {
        address: bob.address,
        secret: bob.secret
    }

    res.json({
        code: 0,
        data
    })
})

router.post('/isValidAddress', async function(req, res) {
    if (!req.body || !req.body.address)
        return res.json({ code: 404, msg: 'missing params' })

    const flag = await xrp.isValidAddress(req.body.address)
    res.json({ code: 0, flag})
})

router.post('/getBalances', async function (req, res) {
    if (!req.body || !req.body.address)
        return res.json({ code: 404, msg: 'missing params' })

    logger.info('Request Body: ', req.body)

    xrpPromise.then(async () => {
        const data = await xrp.getBalances(req.body.address)
        logger.info('Balances: ', JSON.stringify(data))

        res.json({ code: 0, data: data })
    }).catch(error => {
        logger.info(error)
        res.json({ code: 400, msg: error.data && error.data.error_message })
    })
})

router.post('/getAccountInfo', async (req, res) => {
    if (!req.body || !req.body.address)
        return res.json({ code: 404, msg: 'missing params' })

    logger.info('Request Body: ', req.body)

    xrpPromise.then(async () => {
        const account_info = await xrp.getAccountInfo(req.body.address)

        logger.info('Account Info: ', JSON.stringify(account_info))
        res.json({code: 0, data: account_info})
    }).catch(error => {
        logger.info(error)
        res.json({ code: 400, msg: error.data && error.data.error_message })
    })
})

module.exports = router