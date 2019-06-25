const express = require('express')
const router = express.Router()

const xrp = require('../lib/websocket')
const logger = require('../lib/logger')

async function assetsTransfer(from, key, to, value, memo) {
    // const bobAssets = await xrp.getBalances(from)
    // logger.info('bobAssets: ', JSON.stringify(bobAssets))

    // const free = bobAssets.filter(assets => assets.currency === 'XRP').map(data => {
    //     return data.value
    // })

    // const fee = await xrp.getFee()
    // if (free < (value + fee)) {
    //     logger.info(`${from} has ${free} amount, need ${value + fee} amount`)
    //     return { code: 400, msg: 'not enough amount' }
    // }

    // const result = await xrp.preparePayment(from, {
    //     "source": {
    //         "address": from,
    //         "maxAmount": {
    //             "value": value,
    //             "currency": "XRP"
    //         }
    //     },
    //     "destination": {
    //         "address": to,
    //         "amount": {
    //             "value": value,
    //             "currency": "XRP"
    //         }
    //     }
    // }).then(prepared => {
    //     const { signedTransaction } = xrp.sign(prepared.txJSON, key);
    //     console.log('Payment transaction signed...');
    //     xrp.submit(signedTransaction, result => {
    //         logger.info('transfer result: ', result)
    //     }).catch(error => {
    //         logger.error('transfer result: ' + error)
    //     })
    // })

    // logger.info('result: ', result)
    // return { code: 0, data: result }


    const address = 'rnJNioQ53oo3GNcyWz5sF68JVeViuVGEp6'
    const secret = 'snfwqG9w63krZe34ArCJwnWYCvGv6'
    const amount = 10
    xrp.connect().then(() => {
        console.log('Connected...')

        const account = xrp.generateAddress()
        console.log('Generated new account:', account.address)

        return xrp.preparePayment(address, {
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
        }, { maxLedgerVersionOffset: 5 }).then(prepared => {
            const { signedTransaction } = xrp.sign(prepared.txJSON, secret);
            console.log('Payment transaction signed...');
            xrp.submit(signedTransaction).then(() => {
                console.log(`Funded ${account.address} with ${amount} XRP`)
                res.send({
                    account: account,
                    balance: Number(amount)
                })
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
        // res.json(transfers)
    // }).then(() => {
        // xrp.disconnect()
    // })
})

module.exports = router













// const express = require('express')
// const cors = require('cors');
// const app = express()
// const port = 3000
// const RippleAPI = require('ripple-lib').RippleAPI

// const rippledUri = process.env['RIPPLED_URI']
// const address = process.env['FUNDING_ADDRESS']
// const secret = process.env['FUNDING_SECRET']
// const amount = process.env['XRP_AMOUNT']

// app.use(cors());

// app.post('/accounts', (req, res) => {
//   const api = new RippleAPI({
//     server: rippledUri
//   });

//   api.connect().then(() => {
//     console.log('Connected...')

//     const account = api.generateAddress()
//     console.log('Generated new account:', account.address)

//     return api.preparePayment(address, {
//       source: {
//         address: address,
//         maxAmount: {
//           value: amount,
//           currency: 'XRP'
//         }
//       },
//       destination: {
//         address: account.address,
//         amount: {
//           value: amount,
//           currency: 'XRP'
//         }
//       }
//     }, {maxLedgerVersionOffset: 5}).then(prepared => {
//       const {signedTransaction} = api.sign(prepared.txJSON, secret);
//       console.log('Payment transaction signed...');
//       api.submit(signedTransaction).then(() => {
//         console.log(`Funded ${account.address} with ${amount} XRP`)
//         res.send({
//           account: account,
//           balance: Number(amount)
//         })
//       })
//     })
//   }).catch(err => { console.log(err) })
// })

// app.listen(port, () => console.log(`Altnet faucet listening on port ${port}!`))