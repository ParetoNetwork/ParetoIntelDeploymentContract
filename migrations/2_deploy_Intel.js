const Intel = artifacts.require("./Intel");
const DummyToken = artifacts.require("./DummyToken")

const owner = "0xF646d0A6CEB626c665ACB09A139E15A265bDf4a3"; // Set Intel contract's owner address here
const ParetoTokenAddress = "0xea5f88E54d982Cbb0c441cde4E79bC305e5b43Bc";

module.exports = (deployer, network, accounts) => {
  deployer.deploy(DummyToken).then(() => {
    return deployer.deploy(Intel, owner, DummyToken.address,{ from: accounts[0], gasPrice:15000000000 })
  });
  
};
