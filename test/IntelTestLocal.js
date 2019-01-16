const Intel = artifacts.require("Intel");
const ParetoToken = artifacts.require("ParetoNetworkToken");

contract("Test Intel Contract", async (accounts) => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    let IntelInstance;
    let TokenInstance;

    beforeEach("", async () => {
        IntelInstance = await Intel.deployed();
        TokenInstance = await ParetoToken.deployed();
    })

    it("Approve 10 Pareto tokens from accounts one", async () => {
        const depositAmount = web3.toWei("10", "ether");

        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_one })

        const account_one_approve_after = await TokenInstance.allowance.call(account_one, IntelInstance.address);

        assert.equal(parseInt(depositAmount), account_one_approve_after.toNumber());

    })

    it("Deposit 10 approved Pareto tokens to the Intel contract from account one", async () => {
        const depositAmount = web3.toWei("10", "ether");

        const account_one_deposit_before = await IntelInstance.getParetoBalance.call(account_one);

        await IntelInstance.makeDeposit(account_one, depositAmount, { from: account_one });

        const account_one_deposit_after = await IntelInstance.getParetoBalance.call(account_one);
        assert.equal(account_one_deposit_before.toNumber() + parseInt(depositAmount), account_one_deposit_after.toNumber());


    })

    it("Create Intel one using deposits from account one", async () => {
        const depositAmount = web3.toWei("10", "ether");
        const desiredReward = web3.toWei("1000", "ether");
        const ttl = Math.round(new Date().getTime() / 1000) + 3;
        const intelID = 1;

        const account_one_deposit_before = await IntelInstance.getParetoBalance.call(account_one);

        await IntelInstance.create(account_one, depositAmount, desiredReward, intelID, ttl, { from: account_one });

        const account_one_deposit_after = await IntelInstance.getParetoBalance.call(account_one);

        assert.equal(account_one_deposit_before.toNumber() - parseInt(depositAmount), account_one_deposit_after.toNumber());

    })

    it("Create Intel two using two steps of approve/create from account two", async () => {
        const depositAmount = web3.toWei("100", "ether");
        const desiredReward = web3.toWei("1000", "ether");
        const ttl = Math.round(new Date().getTime() / 1000) + 3;
        const intelID = 2;

        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_two })
        const account_two_approve_after = await TokenInstance.allowance.call(account_two, IntelInstance.address);
        assert.equal(parseInt(depositAmount), account_two_approve_after.toNumber());

        const account_two_token_balance_before = await TokenInstance.balanceOf.call(account_two);

        await IntelInstance.create(account_two, depositAmount, desiredReward, intelID, ttl, { from: account_two });

        const account_two_token_balance_after = await TokenInstance.balanceOf.call(account_two);

        assert.equal(account_two_token_balance_before.toNumber() - parseInt(depositAmount), account_two_token_balance_after.toNumber());

    })

    it("Reward Intel one with 70 Pareto tokens using deposits from account two", async () => {
        const depositAmount = web3.toWei("70", "ether");
        const intelID = 1;
        let Intel;

        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_two });

        await IntelInstance.makeDeposit(account_two, depositAmount, { from: account_two });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_before = Intel[3].toNumber()

        await IntelInstance.sendReward(intelID, depositAmount, { from: account_two });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_after = Intel[3].toNumber();

        assert.equal(IntelBalance_before + parseInt(depositAmount), IntelBalance_after);

        const account_two_deposit_balance = await IntelInstance.getParetoBalance.call(account_two);
        assert.equal(account_two_deposit_balance.toNumber(), 0);
    })


    it("Reward Intel one with 80 Pareto tokens using approve/send two transactions from account three", async () => {
        const depositAmount = web3.toWei("80", "ether");
        const intelID = 1;
        let Intel;

        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_three });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_before = Intel[3].toNumber()

        const account_three_token_balance_before = await TokenInstance.balanceOf.call(account_three);

        await IntelInstance.sendReward(intelID, depositAmount, { from: account_three });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_after = Intel[3].toNumber();

        assert.equal(IntelBalance_before + parseInt(depositAmount), IntelBalance_after);

        const account_three_token_balance_after = await TokenInstance.balanceOf.call(account_three);

        assert.equal(account_three_token_balance_before.toNumber() - parseInt(depositAmount), account_three_token_balance_after.toNumber())

    })

    it("Distribute Intel one using account one", async () => {
        const intelID = 1;

        const account_one_token_balance_before = await TokenInstance.balanceOf.call(account_one);
        // const account_two_balance_before = await TokenInstance.balanceOf.call(account_two);
        // const account_three_balance_before = await TokenInstance.balanceOf.call(account_three);

        const Intel = await IntelInstance.getIntel(intelID);
        const IntelBalance = Intel[3].toNumber();

        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await IntelInstance.distributeReward(intelID, { from: account_one });

                    const account_one_token_balance_after = await TokenInstance.balanceOf.call(account_one); 
                    const expected_account_one_balance = (account_one_token_balance_before.toNumber() + (parseInt(IntelBalance) * .95)).toPrecision(10)
                    
                    assert.equal(expected_account_one_balance, account_one_token_balance_after.toNumber());

                    resolve();
                } catch (err) {
                    reject(err)
                }
            }, 5000);
        })
    })

})