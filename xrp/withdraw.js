const express = require('express')
const router = express.Router()

const xrp = require('../lib/websocket')
const logger = require('../lib/logger')

async function assetsTransfer(from, key, to, value, memo) {
    const bobAssets = await xrp.asset.getAssetsByAccount(from, 0, 10)
    logger.info('bobAssets: ', JSON.stringify(bobAssets))

    const free = bobAssets.data.filter(assets => assets.name === 'PCX').map(data => {
        return data.details.Free | 0
    })

    const extrinsic = await xrp.asset.transfer(to, 'PCX', value, memo)
    logger.info('Function: ', extrinsic.method.toHex())

    const addressFee = await extrinsic.getFee(from, { acceleration: 1 });
    if (free < (value + addressFee)) {
        logger.info(`${from} has ${free} amount, need ${value + addressFee} amount`)
        return {code: 400, msg: 'not enough amount'}
    }

    const result = await new Promise((resolve, reject) => {
        extrinsic.signAndSend(key, (error, response) => {
            if (error) {
                logger.error("transaction error ", error)
                reject(error)
            } else if (response.status === 'Finalized') {
                resolve(response)
            }
        })
    })

    logger.info('result: ', result)
    return {code: 0, msg: 'success', data: {
        result: result.result,
        txHash: result.txHash,
        blockHash: result.blockHash,
        status: result.status
    }}
}


router.post('/assetsTransfer', async function (req, res) {
    if (!req.body || !req.body.from || !req.body.key || !req.body.to || !req.body.value) 
        return res.json({ code: 404, msg: 'missing params' })

    logger.info('Request Body: ', req.body)

    const transfers = await assetsTransfer(req.body.from, req.body.key, req.body.to, req.body.value, req.body.memo)
    res.json(transfers)
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