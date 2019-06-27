const RippleAPI = require('ripple-lib').RippleAPI
const config = require('./config')
const logger = require('./logger')

const xrp = new RippleAPI({
    server: config.s2_ripple_com
})
let xrpPromise = xrp.connect().then(() => {
    logger.info('ripple begin connect')
})

xrp.on('error', (errorCode, errorMessage) => {
    logger.error('ripple ' + errorCode + ': ' + errorMessage)
})
xrp.on('connected', () => {
    logger.info('ripple connected')
})
xrp.on('disconnected', (code) => {
    logger.info('ripple disconnected, code: ', code)

    xrpPromise = xrp.connect().then(() => {
        logger.info('ripple begin reconnect')
    })
})

module.exports = { xrp, xrpPromise }