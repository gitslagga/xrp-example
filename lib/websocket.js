const RippleAPI = require('ripple-lib').RippleAPI
const config = require('./config')
const logger = require('./logger')

const xrp = new RippleAPI({
    server: config.s_rippletest_net // config.s1_ripple_com
})
let xrpPromise = xrp.connect().then(() => {
    logger.info('ripple begin connect')

    const options = {
        accounts: ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"],
        streams: ["ledger"]
    }
    xrp.request('subscribe', options).then(response => {
        logger.info('Successfully subscribed', response)
        if (response.status === 'success')
            logger.info("subscribe")
    })
})

xrp.on('message', (message) => {
    logger.info('ripple message', message)
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