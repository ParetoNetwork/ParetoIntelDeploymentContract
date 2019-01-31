import web3 from './web3';
import IntelInstance from './IntelInstance';

export default async (tokenAmount) => {
    const accounts = await web3.eth.getAccounts();
    // approve tokens
    const amount = web3.utils.toWei(tokenAmount, 'ether');

    // await TokenInstance.methods.approve(IntelInstance.options.address, amount).send({
    //         from: accounts[0]
    // })

    const result = await IntelInstance.methods.makeDeposit(accounts[0], amount).send({
        from: accounts[0]
    })
    alert(web3.utils.fromWei(result.events.Deposited.returnValues.amount, 'ether') + " Pareto tokens has been deposited!")

}