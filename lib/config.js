const configs = {
    'development': {
        's1_ripple_com': 'wss://s1.ripple.com',
        's2_ripple_com': 'wss://s2.ripple.com',
        's_rippletest_net': 'wss://s.altnet.rippletest.net',
        'localhost': 'wss://s1.ripple.com',

        'subTag': 'Example watch one account',
        'listenAccount': 'rHcFoo6a9qT5NHiVn1THQRhsEGcxtYCV4d',
        'ratio': 0.000001
    },
    'production': {
        's1_ripple_com': 'wss://s1.ripple.com',
        's2_ripple_com': 'wss://s2.ripple.com',
        's_rippletest_net': 'wss://s.altnet.rippletest.net',
        'localhost': 'ws://localhost:6006',

        'subTag': 'Example watch one account',
        'listenAccount': 'rHcFoo6a9qT5NHiVn1THQRhsEGcxtYCV4d',
        'ratio': 0.000001
    }
}

const config = configs[process.env.NODE_ENV]
module.exports = config