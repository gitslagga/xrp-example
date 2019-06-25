const express = require('express')
const router = express.Router()
const xrp = require('../lib/websocket')
const logger = require('../lib/logger')

async function getTransfers(blockNumber) {
    await xrp.isReady
    const transferCallIndex = Buffer.from(xrp.tx.xAssets.transfer.callIndex).toString('hex')

    const blockHash = await xrp.rpc.chain.getBlockHash(blockNumber)
    const block = await xrp.rpc.chain.getBlock(blockHash)
    const estrinsics = block.block.extrinsics
    const transfers = []

    for (let i = 0; i < estrinsics.length; i++) {
        const e = estrinsics[i]
        if (Buffer.from(e.method.callIndex).toString('hex') === transferCallIndex) {
            const allEvents = await xrp.query.system.events.at(blockHash)
            events = allEvents
                .filter(({ phase }) => phase.type === 'ApplyExtrinsic' && phase.value.eqn(i))
                .map(event => {
                    const o = event.toJSON()
                    o.method = event.event.data.method
                    return o
                })
            result = events[events.length - 1].method

            if (result === 'ExtrinsicSuccess')
                transfers.push({
                    send: e.signature.toJSON().signer,
                    to: e.method.toJSON().args.dest,
                    token: e.method.toJSON().args.token,
                    value: e.method.toJSON().args.value,
                    txHash: e.hash.toHex(),
                })
        }
    }

    return transfers
}

router.post('/rechargeList', async function (req, res) {
    if (!req.body || !req.body.blockNumber) 
        return res.json({ code: 404, msg: 'missing params' })

    logger.info('Request Body: ', req.body)
    
    const transfers = await getTransfers(req.body.blockNumber)
    res.json({ code: 0, data: transfers })
})

module.exports = router