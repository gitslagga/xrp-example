const express = require('express')
const router = express.Router()

const {xrp, xrpPromise} = require('../lib/websocket')
const logger = require('../lib/logger')

function assetsTransfer(from, key, to, value, tag, quit, fail) {
    xrpPromise.then(async () => {
        const payment = {
            source: {
                address: from,
                maxAmount: {
                    value: String(value),
                    currency: 'XRP'
                }
            },
            destination: {
                address: to,                
                amount: {
                    value: String(value),
                    currency: 'XRP'
                },
                tag
            }
        }
        const instructions = {maxLedgerVersionOffset: 5}
        return xrp.preparePayment(from, payment, instructions).then(prepared => {
            const { id, signedTransaction } = xrp.sign(prepared.txJSON, key)
            console.log('Payment transaction signed...', id)

            xrp.submit(signedTransaction).then(quit, fail)
        })
    })
}


router.post('/assetsTransfer', async function (req, res) {
    if (!req.body || !req.body.from || !req.body.key || !req.body.to || !req.body.value || !req.body.tag)
        return res.json({ code: 404, msg: 'missing params' })

    logger.info('Request Body: ', req.body)

    assetsTransfer(req.body.from, req.body.key, req.body.to, req.body.value, req.body.tag, function(result) {
        logger.info('AssetsTransfer Result: ', result)
        res.json({ code: 0, data: result })
    }, function(error){
        logger.error('AssetsTransfer Error: ' + error)
        res.json({ code: 500, msg: error })
    })
})

router.post('/getTransaction', async function (req, res) {
    if (!req.body || !req.body.id)
        return res.json({ code: 404, msg: 'missing params' })

    logger.info('Request Body: ', req.body)

    xrpPromise.then(() => {
        xrp.getServerInfo().then(info => {
            logger.info('getServerInfo: ', info)
            const arr = info.completeLedgers.split('-')
            const options = {
                minLedgerVersion: Number(arr[0]),
                maxLedgerVersion: Number(arr[1])
            }
            xrp.getTransaction(req.body.id, options).then((result) => {
                res.json({ code: 0, data: result})
            })
        })
    })
})

module.exports = router
