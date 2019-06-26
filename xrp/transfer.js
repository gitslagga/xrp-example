const express = require('express')
const router = express.Router()

const {xrp, xrpPromise} = require('../lib/websocket')
const logger = require('../lib/logger')

async function assetsTransfer(from, key, to, value, memo) {
    xrpPromise.then(async () => {
        const bobAssets = await xrp.getBalances(from)
        logger.info('bobAssets: ', JSON.stringify(bobAssets))
    
        const free = bobAssets.filter(assets => assets.currency === 'XRP').map(data => {
            return Number(data.value)
        })[0]
    
        const fee = await xrp.getFee()
        if (free < (value + fee)) {
            logger.info(`${from} has ${free} amount, need ${value + fee} amount`)
            return { code: 400, msg: 'not enough amount' }
        }

        xrp.preparePayment(from, {
            source: {
                address: from,
                maxAmount: {
                    value,
                    currency: 'XRP'
                }
            },
            destination: {
                address: to,
                amount: {
                    value,
                    currency: 'XRP'
                }
            }
        }).then(prepared => {
            const { id, signedTransaction } = xrp.sign(prepared.txJSON, key)
            console.log('Payment transaction signed...', id)
            xrp.submit(signedTransaction).then(async (result) => {
                console.log(`Funded ${to} with ${value} XRP`)
                logger.info('submit result: ', result)

                await xrp.getServerInfo().then(info => {
                    logger.info('getServerInfo: ', info)
                    const arr = info.completeLedgers.split('-')
                    const options = {
                        minLedgerVersion: Number(arr[0]),
                        maxLedgerVersion: Number(arr[1])
                    }
                    xrp.getTransaction(id, options).then((result) => {
                        res.json({ code: 0, data: result})
                    })
                })
            })
        })
    }).catch(err => { 
        xrp.connect().then() 
        console.log(err) 
    })
}


router.post('/assetsTransfer', async function (req, res) {
    if (!req.body || !req.body.from || !req.body.key || !req.body.to || !req.body.value)
        return res.json({ code: 404, msg: 'missing params' })

    logger.info('Request Body: ', req.body)

    // xrp.connect().then(async () => {
        const transfers = await assetsTransfer(req.body.from, req.body.key, req.body.to, req.body.value, req.body.memo)
        res.json(transfers)
    // })
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
