const express = require('express')
const router = express.Router()

const {xrp, xrpPromise} = require('../lib/websocket')
const logger = require('../lib/logger')

router.post('/getFee', (req, res) => {
    xrpPromise.then(() => {
        xrp.getFee().then(result => {
            logger.info('getFee result: ', result)
            
            res.json({code: 0, data: result })
        })
    })
})

router.post('/getServerInfo', (req, res) => {
    xrpPromise.then(() => {
        xrp.getServerInfo().then(result => {
            logger.info('getServerInfo result: ', result)
            
            res.json({code: 0, data: result })
        })
    })
})

module.exports = router