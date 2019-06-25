const RippleAPI = require('ripple-lib').RippleAPI
const config = require('./config')
const logger = require('./logger')

const api = new RippleAPI({
    server: config.s_rippletest_net // config.s1_ripple_com
})

api.on('error', (errorCode, errorMessage) => {
    logger.error('ripple ' + errorCode + ': ' + errorMessage)
})
api.on('connected', () => {
    logger.info('ripple connected')
})
api.on('disconnected', (code) => {
    logger.info('ripple disconnected, code: ', code)
})

module.exports = api