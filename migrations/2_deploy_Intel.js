const Intel = artifacts.require("./Intel");

const owner = ""; // Set Intel contract's owner address here
const ParetoTokenAddress = "0xea5f88E54d982Cbb0c441cde4E79bC305e5b43Bc";

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Intel, owner, ParetoTokenAddress,{ from: accounts[0] })
};
