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
  let owner_balance = await getOwnerDepositBalance(publicKey);
  console.log(
    "The amount of Pareto that will get distributed " + owner_balance / 10 ** 18
  );

  const participants_batches = [];
  await prepareParticipantsBatches(participants, participants_batches);

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
    console.log("Transaction address for the distribution " + hash);
  });
}

async function getAllParticipants() {
  const participants = await intelInstance.methods.getParticipants().call();
  return participants;
}

async function getNonce(publicKey) {
  return await web3.eth.getTransactionCount(publicKey);
}

async function getOwnerDepositBalance(publicKey) {
  return await intelInstance.methods.getParetoBalance(publicKey).call();
}

async function getTotalParetoBalance() {
  return await intelInstance.methods.totalParetoBalance().call();
}

async function getIntelContractDepositBalance() {
  return await intelInstance.methods
    .getParetoBalance(intelInstance.options.address)
    .call();
}

async function getParetoDepositBalance(address) {
  return await intelInstance.methods.getParetoBalance(address).call();
}

async function prepareParticipantsBatches(participants, participants_batches) {
  let index = 0;
  let batch = [];
  const totalParetoBalance = await getTotalParetoBalance();
  const owner_balance = await getOwnerDepositBalance(publicKey);
  const Intel_contract_balance = await getIntelContractDepositBalance();

  const totalCirculatingAmount =
    totalParetoBalance - Intel_contract_balance - owner_balance;

  for (let i = 0; i < participants.length; i++) {
    if (participants[i] === publicKey) {
      continue;
    }

    batch.push(participants[i]);

    const participant_balance = await getParetoDepositBalance(participants[i]);
    console.log(
      participants[i] +
        " Participant will receive a distribution of " +
        ((participant_balance / totalCirculatingAmount) * owner_balance) /
          10 ** 18 +
        ", current balance " +
        participant_balance / 10 ** 18
    );
    index++;

    if (index >= BATCH_SIZE) {
      participants_batches.push(batch);
      index = 0;
      batch = [];
    }
  }
  participants_batches.push(batch);
}
