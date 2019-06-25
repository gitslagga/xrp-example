const express = require('express')
const router = express.Router()

const xrp = require('../lib/websocket')
const logger = require('../lib/logger')

router.post('/getBlocknumber', (req, res) => {
    const subscription = xrp.chain.subscribeNewHead().subscribe(result => {
        logger.info('subscribeNewHead result: ', result)
        
        subscription.unsubscribe()
        res.json({code: 0, data: result })
    })
})

module.exports = router