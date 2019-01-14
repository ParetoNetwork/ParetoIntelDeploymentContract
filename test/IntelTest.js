var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic =
  "avocado armed also position solution total token maze deny neutral bless share"; // 12 word mnemonic
var provider = new HDWalletProvider(
  mnemonic,
  "https://ropsten.infura.io/QWMgExFuGzhpu2jUr6Pq",
  0,
  9
);

const Web3 = require("web3");
const web3 = new Web3(provider);

const Intel_Contract_Schema = require("../build/contracts/Intel.json");
const IntelInstance = new web3.eth.Contract(
  Intel_Contract_Schema.abi,
  Intel_Contract_Schema.networks["3"].address
);

const Pareto_Contract_Schema = require("../build/contracts/ParetoNetworkToken.json");
const ParetoTokenInstance = new web3.eth.Contract(
  Pareto_Contract_Schema.abi,
  Pareto_Contract_Schema.networks["3"].address
);

const Dummy_Contract_Schema = require("../build/contracts/DummyToken.json");
const DummyTokenInstance = new web3.eth.Contract(
  Dummy_Contract_Schema.abi,
  Dummy_Contract_Schema.networks["3"].address
);

contract("Intel", () => {
  let gasPrice;
  let _intelID = 17;
  let accounts;

  (async () => {
    // Get the gas price for current network
    web3.eth.getGasPrice((err, _gasPrice) => {
      if (err) {
        throw err;
      }
      gasPrice = _gasPrice;
      console.log(`Gas price is ${gasPrice} Wei`);
    });
  })();

  it("Test fallback function", async () => {
    try {
      await IntelInstance.sendTransaction({
        from: accounts[7],
        value: web3.toWei("0.1", "ether")
      }); // set Pareto token address in Intel contract
      assert(false);
    } catch (e) {
      assert(true);
    }
  });

  it("Make Deposit to Intel contract", async () => {
    accounts = await web3.eth.getAccounts();
    const depositor = accounts[0];
    const depositAmount = "100";

    const approveGas = await ParetoTokenInstance.methods
      .approve(
        IntelInstance.options.address,
        web3.utils.toWei(depositAmount, "ether")
      )
      .estimateGas({ from: depositor });

    await await ParetoTokenInstance.methods
      .approve(
        IntelInstance.options.address,
        web3.utils.toWei(depositAmount, "ether")
      )
      .send({
        from: depositor,
        gas: approveGas
      });

    const depositGas = await IntelInstance.methods
      .makeDeposit(depositor, web3.utils.toWei(depositAmount, "ether"))
      .estimateGas({ from: depositor });

    await IntelInstance.methods
      .makeDeposit(depositor, web3.utils.toWei(depositAmount, "ether"))
      .send({ from: depositor, gas: depositGas });
  });

  it("Create Intel using deposit", async () => {
    accounts = await web3.eth.getAccounts();

    const _depositAmount = "100";
    const _desiredReward = "1000";
    const _ttl = Math.round(new Date().getTime() / 1000) + 11174; // add five seconds to to allow the rewarder to reward pareto tokens
    const provider_address = accounts[0];

    // Call the create function on Intel contract to create an Intel
    gas = await IntelInstance.methods
      .create(
        provider_address,
        web3.utils.toWei(_depositAmount, "ether"),
        web3.utils.toWei(_desiredReward, "ether"),
        _intelID,
        _ttl
      )
      .estimateGas({ from: provider_address });
    console.log("create requires ", gas, " gas");
    await IntelInstance.methods
      .create(
        provider_address,
        web3.utils.toWei(_depositAmount, "ether"),
        web3.utils.toWei(_desiredReward, "ether"),
        _intelID,
        _ttl
      )
      .send({ from: provider_address, gas });
  });

  it("Create Intel using two transactions, which are approve and createIntel", async () => {
    accounts = await web3.eth.getAccounts();

    const Intel_Address = IntelInstance.options.address;
    const _depositAmount = "100";
    const _desiredReward = "1000";
    const _ttl = Math.round(new Date().getTime() / 1000) + 11174; // add five seconds to to allow the rewarder to reward pareto tokens
    const provider_address = accounts[1];

    // // approve the '_depositAmount' tokens from provider to Intel Contract
    let gas = await ParetoTokenInstance.methods
      .approve(Intel_Address, web3.utils.toWei(_depositAmount, "ether"))
      .estimateGas({ from: provider_address });
    await ParetoTokenInstance.methods
      .approve(Intel_Address, web3.utils.toWei(_depositAmount, "ether"))
      .send({ from: provider_address, gas });

    // Call the create function on Intel contract to create an Intel
    gas = await IntelInstance.methods
      .create(
        provider_address,
        web3.utils.toWei(_depositAmount, "ether"),
        web3.utils.toWei(_desiredReward, "ether"),
        ++_intelID,
        _ttl
      )
      .estimateGas({ from: provider_address });
    console.log("create requires ", gas, " gas");
    await IntelInstance.methods
      .create(
        provider_address,
        web3.utils.toWei(_depositAmount, "ether"),
        web3.utils.toWei(_desiredReward, "ether"),
        _intelID,
        _ttl
      )
      .send({ from: provider_address, gas });
  });

  it("Send Reward using deposits", async () => {
    accounts = await web3.eth.getAccounts();

    const rewarder = accounts[0];

    const Intel_Address = IntelInstance.options.address;

    const _rewardAmount = "70";


    // approve the 'rewardAmount' tokens from rewarder to Intel Contract
    gas = await ParetoTokenInstance.methods
      .approve(Intel_Address, web3.utils.toWei(_rewardAmount, "ether"))
      .estimateGas({ from: rewarder });
    await ParetoTokenInstance.methods
      .approve(Intel_Address, web3.utils.toWei(_rewardAmount, "ether"))
      .send({ from: rewarder, gas });

    const depositGas = await IntelInstance.methods
      .makeDeposit(rewarder, web3.utils.toWei(_rewardAmount, "ether"))
      .estimateGas({ from: rewarder });

    await IntelInstance.methods
      .makeDeposit(rewarder, web3.utils.toWei(_rewardAmount, "ether"))
      .send({ from: rewarder, gas: depositGas });

    // Call sendReward function on Intel contract to send reward to an Intel
    gas = await IntelInstance.methods
      .sendReward(_intelID, web3.utils.toWei(_rewardAmount, "ether"))
      .estimateGas({ from: rewarder });
    console.log("sendReward requires ", gas, " gas");
    await IntelInstance.methods
      .sendReward(_intelID, web3.utils.toWei(_rewardAmount, "ether"))
      .send({ from: rewarder, gas });
  });

  it("Send Reward using approve/send", async () => {
    accounts = await web3.eth.getAccounts();

    const rewarder = accounts[0];

    const Intel_Address = IntelInstance.options.address;

    const _rewardAmount = "70";

    // approve the 'rewardAmount' tokens from rewarder to Intel Contract
    gas = await ParetoTokenInstance.methods
      .approve(Intel_Address, web3.utils.toWei(_rewardAmount, "ether"))
      .estimateGas({ from: rewarder });
    await ParetoTokenInstance.methods
      .approve(Intel_Address, web3.utils.toWei(_rewardAmount, "ether"))
      .send({ from: rewarder, gas });


    // Call sendReward function on Intel contract to send reward to an Intel
    gas = await IntelInstance.methods
      .sendReward(_intelID, web3.utils.toWei(_rewardAmount, "ether"))
      .estimateGas({ from: rewarder });
    console.log("sendReward requires ", gas, " gas");
    await IntelInstance.methods
      .sendReward(_intelID, web3.utils.toWei(_rewardAmount, "ether"))
      .send({ from: rewarder, gas });
  });

  // it("Distribute Rewards", async () => {
  //     accounts = await web3.eth.getAccounts();

  //     const distributer = accounts[4];
  //     console.log("Waiting...")

  //     return new Promise((resolve, reject) => {
  //         setTimeout(async () => {

  //             // call distributeReward on Intel contract to distribute reward to the Intel provider
  //             let gas = await IntelInstance.methods.distributeReward(_intelID).estimateGas({ from: distributer });
  //             console.log("distributeReward requires ", gas," gas");
  //             await IntelInstance.methods.distributeReward(_intelID).send({ from: distributer, gas });

  //             resolve();
  //         }, 120000);
  //     })

  // })

  // it("Test Proxy", async () => {

  //     accounts = await web3.eth.getAccounts();

  //     const depositAmount = 500 * (10 ** 18);
  //     const testAccount = accounts[5];
  //     const owner = accounts[0];

  //     // Transfer 500 dummy Tokens from testAccount to Intel contract
  //     let gas = await DummyTokenInstance.methods.transfer(IntelInstance.options.address, depositAmount).estimateGas({ from: testAccount });
  //     await DummyTokenInstance.methods.transfer(IntelInstance.options.address, depositAmount).send({ from: testAccount, gas });

  //     // Call proxy function on Intel contract to return dummy token received from testAccount
  //     gas = await IntelInstance.methods.proxy(DummyTokenInstance.address, testAccount, depositAmount, 2100000).estimateGas({ from: owner });
  //     console.log("proxy requires ", gas, " gas");
  //     await IntelInstance.methods.proxy(DummyTokenInstance.address, testAccount, depositAmount, 2100000).send({ from: owner, gas });

  // })
});
