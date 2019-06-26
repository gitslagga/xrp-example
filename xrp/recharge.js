const express = require('express')
const router = express.Router()
const { xrp, xrpPromise } = require('../lib/websocket')
const logger = require('../lib/logger')

async function getTransfers() {

    return {}
}

router.post('/rechargeList', async function (req, res) {
    if (!req.body || !req.body.address) 
        return res.json({ code: 404, msg: 'missing params' })

    logger.info('Request Body: ', req.body)
    
    const transfers = await getTransfers(req.body.address)
    res.json({ code: 0, data: transfers })
})

module.exports = router