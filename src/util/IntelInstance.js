import web3 from './web3';
import ABI from './IntelABI';

const Intel_Artifact = require("../contracts/Intel.json")

const address = Intel_Artifact.networks["3"].address;
// const address = Intel_Artifact.networks["5777"].address;

export default new web3.eth.Contract(ABI, address);