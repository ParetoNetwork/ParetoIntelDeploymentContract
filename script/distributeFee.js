const Tx = require("ethereumjs-tx");

const Web3 = require("Web3");
const ETHwallet = require("ethereumjs-wallet");

const ABI = require("./IntelABI");
const Config = require("./config");

const web3 = new Web3(new Web3.providers.HttpProvider(Config.network_URL));

const intelAddress = Config.intelAddress;

const BATCH_SIZE = 250;

const intelInstance = new web3.eth.Contract(ABI, intelAddress);

const privKey = Config.ownerPrivateKey;
let privateKeyBuff = new Buffer(privKey, "hex");
const wallet = ETHwallet.fromPrivateKey(privateKeyBuff);
const publicKey = wallet.getChecksumAddressString();

startDistribution();

async function startDistribution() {
  console.log(`
        --------------------------------------------
        ---------Performing distribution ------------
        --------------------------------------------
      `);

  const participants = await getAllParticipants();

  console.log(`There are ${participants.length} participants`);

  let gPrice, txData, data, transaction, serializedTx, gas;
  let nonceNumber = await web3.eth.getTransactionCount(publicKey);
  let owner_balance = await intelInstance.methods
    .getParetoBalance(publicKey)
    .call();

  let batch = [];
  const participants_batches = [];
  let index = 0;
  for (let i = 0; i < participants.length; i++) {
    batch.push(participants[i]);
    index++;

    if (index >= BATCH_SIZE) {
      participants_batches.push(batch);
      index = 0;
      batch = [];
    }
  }

  participants_batches.push(batch);

  console.log(participants_batches);
  gPrice = await web3.eth.getGasPrice();
  console.log("Gas Price: ",gPrice);

  for (let i = 0; i < participants_batches.length; i++) {
    try {
      gas = await intelInstance.methods
        .distributeFeeRewards(participants_batches[i], owner_balance)
        .estimateGas({ from: publicKey });

      data = intelInstance.methods
        .distributeFeeRewards(participants_batches[i], owner_balance)
        .encodeABI();
      // construct the transaction data
      txData = {
        nonce: web3.utils.toHex(nonceNumber++),
        gasLimit: web3.utils.toHex(gas),
        gasPrice: web3.utils.toHex(gPrice),
        to: intelAddress,
        from: publicKey,
        data
      };

      transaction = new Tx(txData);
      transaction.sign(privateKeyBuff);
      serializedTx = transaction.serialize().toString("hex");
      web3.eth.sendSignedTransaction("0x" + serializedTx, (err, hash) => {
        console.log(hash);
      });
    } catch (err) {
      console.log("ERROR:", err);
    }
  }
}

async function getAllParticipants() {
  const participants = await intelInstance.methods.getParticipants().call();
  return participants;
}
