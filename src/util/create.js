import web3 from './web3';
import IntelInstance from './IntelInstance';
import TokenInstance from './TokenInstance';

export default async (provider_address, depositAmount, desiredReward, intelID, ttl) => {
    const accounts = await web3.eth.getAccounts();
    // approve tokens
    console.log(typeof depositAmount);
    depositAmount = web3.utils.toWei(depositAmount, 'ether');
    desiredReward = web3.utils.toWei(desiredReward, 'ether');

    const depositBalance = await IntelInstance.methods.getParetoBalance(provider_address).call();

    if (depositAmount <= depositBalance) {
        console.log("using deposits");
        // do the creation
        await IntelInstance.methods.create(provider_address, depositAmount, desiredReward, intelID, ttl).send({ from: accounts[0] });

    } else {
        console.log("two transaction method");
        // ======================
        await TokenInstance.methods.approve(IntelInstance.options.address, depositAmount).send({
            from: accounts[0]
        })

        await IntelInstance.methods.create(provider_address, depositAmount, desiredReward, intelID, ttl).send({ from: accounts[0] });

        // alert(web3.utils.fromWei(result.events.Deposited.returnValues.amount, 'ether') + " Pareto tokens has been deposited!")
        // ======================
    }




}