import web3 from './web3';
import IntelInstance from './IntelInstance';
import TokenInstance from './TokenInstance';

export default async () => {
    const accounts = await web3.eth.getAccounts();
    // approve tokens
    const amount = web3.utils.toWei("500000000", 'ether');

    await TokenInstance.methods.approve(IntelInstance.options.address, amount).send({
            from: accounts[0]
    })

    alert("Interaction has been enabled");

}