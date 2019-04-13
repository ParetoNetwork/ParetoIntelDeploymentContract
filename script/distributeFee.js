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

try {
  startDistribution();
} catch (err) {
  console.log("Error: ", err);
}

async function startDistribution() {
  console.log(`
        --------------------------------------------
        ---------Performing distribution ------------
        --------------------------------------------
      `);

  const participants = await getAllParticipants();

  console.log(`There are ${participants.length} participants`);

  let nonceNumber = await getNonce(publicKey);
  let owner_balance = await getOwnerBalance(publicKey);

  const participants_batches = [];
  prepareParticipantsBatches(participants, participants_batches);

  for (let i = 0; i < participants_batches.length; i++) {
    await makeTransaction(
      participants_batches[i],
      owner_balance,
      nonceNumber++
    );
  }
}

async function makeTransaction(participant_batch, owner_balance, nonce) {
  let gPrice, txData, data, transaction, serializedTx, gas;

  gPrice = await web3.eth.getGasPrice();
  console.log("Gas Price: ", gPrice);

  gas = await intelInstance.methods
    .distributeFeeRewards(participant_batch, owner_balance)
    .estimateGas({ from: publicKey });

  data = intelInstance.methods
    .distributeFeeRewards(participant_batch, owner_balance)
    .encodeABI();
  // construct the transaction data
  txData = {
    nonce: web3.utils.toHex(nonce),
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
}

async function getAllParticipants() {
  const participants = await intelInstance.methods.getParticipants().call();
  return participants;
}

async function getNonce(publicKey) {
  return await web3.eth.getTransactionCount(publicKey);
}

async function getOwnerBalance(publicKey) {
  return await intelInstance.methods.getParetoBalance(publicKey).call();
}

function prepareParticipantsBatches(participants, participants_batches) {
  let index = 0;
  let batch = [];
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
}
