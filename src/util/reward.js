import web3 from './web3';
import IntelInstance from './IntelInstance';

export default async (id, depositAmount) => {
    const accounts = await web3.eth.getAccounts();
    depositAmount = web3.utils.toWei(depositAmount, 'ether');

    const depositBalance = await IntelInstance.methods.getParetoBalance(accounts[0]).call();

    if (depositAmount <= depositBalance) {
        console.log("using deposits");
        // do the creation
        await IntelInstance.methods.sendReward(id, depositAmount).send({ from: accounts[0] });

    } else {
        console.log("You don't have enough deposited balance in the contract and the tokens will taken from your account");
        // ======================
        // await TokenInstance.methods.approve(IntelInstance.options.address, depositAmount).send({
        //     from: accounts[0]
        // })

        await IntelInstance.methods.sendReward(id, depositAmount).send({ from: accounts[0] });

        // alert(web3.utils.fromWei(result.events.Deposited.returnValues.amount, 'ether') + " Pareto tokens has been deposited!")
        // ======================
    }




}