import web3 from './web3';
import IntelInstance from './IntelInstance';

export default async () => {
    const accounts = await web3.eth.getAccounts();

    return await IntelInstance.methods.intelCount().call({ from: accounts[0] });
}
