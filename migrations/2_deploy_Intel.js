const Intel = artifacts.require("./Intel");
var ParetoNetworkToken = artifacts.require("ParetoNetworkToken");

const owner = "0x6d2020E8F4c8267F8E9ADC6d2111a492279D2046"; // Set Intel contract's owner address here
const ParetoTokenAddress = "0xea5f88E54d982Cbb0c441cde4E79bC305e5b43Bc";

module.exports = (deployer, network, accounts) => {
  if (network === "development") {
    console.log("Network is development");
    deployer.deploy(ParetoNetworkToken).then(() => {
      return deployer.deploy(Intel, owner, ParetoNetworkToken.address, {
        from: accounts[0],
        gasPrice: 15000000000
      }).then(async () => {

        const TokenInstance = await ParetoNetworkToken.deployed();
        await TokenInstance.transfer(accounts[2], 10000 * (10 ** 18), { from: accounts[0] })

      });
    });
  } else if (network === "ropsten") {
    console.log("Network is ropsten");
    deployer.deploy(Intel, owner, "0xbcce0c003b562f47a319dfca4bce30d322fa0f01", {
      from: accounts[0],
      gasPrice: 15000000000
    })
  } else if(network === "mainnet"){
    deployer.deploy(Intel, owner, ParetoTokenAddress, {
      from: accounts[0],
      gasPrice: 15000000000
    })
  }

};
