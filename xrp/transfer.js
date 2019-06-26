const express = require('express')
const router = express.Router()

const {xrp, xrpPromise} = require('../lib/websocket')
const logger = require('../lib/logger')

async function assetsTransfer(from, key, to, value, memo) {

    const address = 'rnJNioQ53oo3GNcyWz5sF68JVeViuVGEp6'
    const secret = 'snfwqG9w63krZe34ArCJwnWYCvGv6'
    const amount = '100000000'
    
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

        const account = {
            address: 'raFU6QmuBbRFWW1cLsg2LiFTaPtgnikpRc',
            secret: 'ssbscpGwrJndoJQ7GbvGpVGGyDn6K'
        }
        console.log('Generated new account:', account.address)

        xrp.preparePayment(address, {
            source: {
                address: address,
                maxAmount: {
                    value: amount,
                    currency: 'XRP'
                }
            },
            destination: {
                address: account.address,
                amount: {
                    value: amount,
                    currency: 'XRP'
                }
            }
        }).then(prepared => {
            const { id, signedTransaction } = xrp.sign(prepared.txJSON, secret)
            console.log('Payment transaction signed...', id)
            xrp.submit(signedTransaction).then((result) => {
                // xrp.getTransaction(id).then(transaction => {
                //     console.log(`transaction list ${transaction}`)
                // })

                console.log(`Funded ${account.address} with ${amount} XRP`)
                
                logger.info('submit result: ', result)
                return { code: 0, data: result }
            })
        })
    }).catch(err => { console.log(err) })
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
        api.getServerInfo().then(info => {
            const arr = info.completeLedgers.spit('-')
            const options = {
                minLedgerVersion: arr[0],
                maxLedgerVersion: arr[1]
            }
            xrp.getTransaction(req.body.id, options).then((result) => {
                res.json({ code: 0, data: result})
            })
        })
    })
})

module.exports = router
