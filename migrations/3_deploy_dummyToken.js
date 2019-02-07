var ncp = require('ncp').ncp;
var DummyToken = artifacts.require("DummyToken");

module.exports = function (deployer, network, accounts) {
    if(network !== "mainnet") {
        deployer.deploy(DummyToken);
        ncp.limit = 16;

        ncp("build", "src", function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('done!');
        });
    }
}