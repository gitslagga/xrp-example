var XrpWallet = require('./rippleWallet')
const srcAddress = 'rnJNioQ53oo3GNcyWz5sF68JVeViuVGEp6'
const secret = 'snfwqG9w63krZe34ArCJwnWYCvGv6'

const desAddress = 'raFU6QmuBbRFWW1cLsg2LiFTaPtgnikpRc'
const listenWallet = 'raFU6QmuBbRFWW1cLsg2LiFTaPtgnikpRc'
var options = {}
const pXrp = new XrpWallet(srcAddress, secret, 401143, listenWallet)

pXrp.xrpInit()
pXrp.xrpGetTransactions(function(result){console.log(result)},function (err) {console.log(err)},options); //测试获取历史记录
pXrp.xrpGetBalances(function(result){console.log(result)},function (err) {console.log(err)}); //查询账户余额
pXrp.xrpPayment(desAddress,2,false,function(result){console.log(result)},function (err){console.log("call payment error: " + err)}) //测试转账
