const config = {
    's1_ripple_com': 'wss://s1.ripple.com', // (Main Net Public Server)
    's2_ripple_com': 'wss://s2.ripple.com', // (Full History Public Server)
    's_rippletest_net': 'wss://s.altnet.rippletest.net', // (Test Net Public Server)
    'localhost': 'ws://localhost:6006', // (Local rippled Server on port 6006)

    'subTag': 'Example watch one account',
    'listenAccount': 'rHcFoo6a9qT5NHiVn1THQRhsEGcxtYCV4d',
    'ratio': 0.000001
}

module.exports = config