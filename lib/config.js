const configs = {
    'development': {
        s1_ripple_com: 'wss://s1.ripple.com',
        s2_ripple_com: 'wss://s2.ripple.com',
        s_rippletest_net: 'wss://s.altnet.rippletest.net',
        localhost: 'wss://s1.ripple.com',

        subTag: 'Example watch one account',
        listenAccount: 'rHcFoo6a9qT5NHiVn1THQRhsEGcxtYCV4d',
        ratio: 0.000001,
        ding_token: '2d8c3b3d33c990243c3b3e23ce2bad6ebb2264cd4b9836b841e63b9def380a03'
    },
    'production': {
        s1_ripple_com: 'wss://s1.ripple.com',
        s2_ripple_com: 'wss://s2.ripple.com',
        s_rippletest_net: 'wss://s.altnet.rippletest.net',
        localhost: 'ws://localhost:6006',

        subTag: 'Example watch one account',
        listenAccount: 'rHcFoo6a9qT5NHiVn1THQRhsEGcxtYCV4d',
        ratio: 0.000001,
        ding_token: 'b9e9a2ed2f9a036c64c974614758fa7ea396e7631354bc0f44fc4fb5a69fbf17'
    }
}

const config = configs[process.env.NODE_ENV]
module.exports = config