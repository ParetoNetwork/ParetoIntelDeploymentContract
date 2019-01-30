import web3 from './web3';
import IntelInstance from './IntelInstance';

export default async (id) => {
    const accounts = await web3.eth.getAccounts();

    await IntelInstance.methods.distributeReward(id).send({ from: accounts[0] });  
}

