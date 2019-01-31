import web3 from './web3';
import IntelInstance from './IntelInstance';
import TokenInstance from './TokenInstance';

export default async () => {
    const accounts = await web3.eth.getAccounts();
    
    return await TokenInstance.methods.allowance(accounts[0], IntelInstance.options.address).call({
        from: accounts[0]
    })

}