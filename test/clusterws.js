/* global wss: false */
const WebSocket = require('ws')
const logger = require('../lib/logger')
const ws = new WebSocket('ws://localhost:3031')

ws.on('connected', () => {
    logger.info('connected')
})
ws.on('disconnected', () => {
    logger.info('disconnected')
})
ws.on('error', (error) => {
    logger.info('error', error)
})
ws.on('message', (data) => {
    logger.info('message', data)
    
    if (typeof data == 'object' && data.toString() == '9') {
        ws.send(Buffer.from('A'))
    }
})
ws.on('close', (() => {
    logger.info('close')
}))
ws.on('open', () => {
    logger.info('open')
    const subscribe = {
        '#' : [
            's',
            's',
            'accountInfo'
        ]
    }
    ws.send(JSON.stringify(subscribe))
})
