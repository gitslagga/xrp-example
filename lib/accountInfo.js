/* global wss: false */
const WebSocket = require('ws')
const logger = require('./logger')
const config = require('./config')
const ws = new WebSocket(config.localhost)

const subTag = config.subTag
const listenAccount = config.listenAccount
const ratio = config.ratio

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
    
    data = JSON.parse(data)
    if (data.hasOwnProperty('type') && data.type == 'response') {
        return 
    }

    const result = parsePushData(data)
    logger.info('message result', result)
    if (result.dirct == 1 && result.success) {
        logger.info('success recharged')
        wss.publish('accountInfo', {code: 0, data: result})
    }
})
ws.on('close', (() => {
    logger.info('close')
}))
ws.on('open', () => {
    logger.info('open')
    const subscribe = {
        "id": subTag,
        "command": "subscribe",
        "accounts": [
            listenAccount
        ]
    }
    ws.send(JSON.stringify(subscribe))

    const ping = {
        "id": 1,
        "command": "ping"
    }
    setInterval(function() {
        ws.send(JSON.stringify(ping))
    }, 60000)
})


function parsePushData(data) {
    let xrpPushInfo = { 'dirct': 3 }    //1 recharge 3 ignore
    if (data.hasOwnProperty('transaction')) {
        let transaction = data.transaction
        if (data.hasOwnProperty('type') && data.type == "transaction" && transaction.TransactionType == "Payment") {
            if (listenAccount == transaction.Destination) {
                xrpPushInfo['dirct'] = 1
            }
            
            let bsuccess = false
            if (data.validated && data.meta.TransactionResult == 'tesSUCCESS') {
                bsuccess = true
            }
            xrpPushInfo['account'] = transaction.Account
            xrpPushInfo['amount'] = String(transaction.Amount * ratio)
            xrpPushInfo['destination'] = transaction.Destination
            xrpPushInfo['destinationTag'] = transaction.DestinationTag
            xrpPushInfo['fee'] = String(transaction.Fee * ratio)
            xrpPushInfo['hash'] = transaction.hash
            xrpPushInfo['date'] = transaction.date
            xrpPushInfo['code'] = data.meta.TransactionResult
            xrpPushInfo['validated'] = data.validated
            xrpPushInfo['success'] = bsuccess
        }
    }
    return xrpPushInfo
}