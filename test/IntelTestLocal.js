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

        // approve 10 Pareto tokens
        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_one })

        const account_one_approve_after = await TokenInstance.allowance.call(account_one, IntelInstance.address);

        assert.equal(web3.toBigNumber(depositAmount).toNumber(), account_one_approve_after.toNumber());

    })

    it("Deposit 10 approved Pareto tokens to the Intel contract from account one", async () => {
        const depositAmount = web3.toWei("10", "ether");

        const account_one_deposit_before = await IntelInstance.getParetoBalance.call(account_one);

        // deposit 10 Pareto tokens from account one
        await IntelInstance.makeDeposit(account_one, depositAmount, { from: account_one });

        const account_one_deposit_after = await IntelInstance.getParetoBalance.call(account_one);
        assert.equal(account_one_deposit_before.toNumber() + web3.toBigNumber(depositAmount).toNumber(), account_one_deposit_after.toNumber());


    })

    it("Create Intel one using deposits from account one", async () => {
        const depositAmount = web3.toWei("10", "ether");
        const desiredReward = web3.toWei("1000", "ether");
        const ttl = Math.round(new Date().getTime() / 1000) + 3;
        const intelID = 1;

        const account_one_deposit_before = await IntelInstance.getParetoBalance.call(account_one);

        //create Intel from account one. It will automatically make use of deposits that we did in the previous test
        await IntelInstance.create(account_one, depositAmount, desiredReward, intelID, ttl, { from: account_one });

        const account_one_deposit_after = await IntelInstance.getParetoBalance.call(account_one);

        assert.equal(account_one_deposit_before.toNumber() - web3.toBigNumber(depositAmount).toNumber(), account_one_deposit_after.toNumber());

    })

    it("Create Intel two using two steps of approve/create from account two", async () => {
        const depositAmount = web3.toWei("100", "ether");
        const desiredReward = web3.toWei("1000", "ether");
        const ttl = Math.round(new Date().getTime() / 1000) + 10;
        const intelID = 2;

        // approve tokens to Intel contract from account two
        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_two })
        const account_two_approve_after = await TokenInstance.allowance.call(account_two, IntelInstance.address);
        assert.equal(web3.toBigNumber(depositAmount).toNumber(), account_two_approve_after.toNumber());

        const account_two_token_balance_before = await TokenInstance.balanceOf.call(account_two);

        //create Intel from account two. This will do the actual transfer of Pareto tokens as the account two does not have any deposits Pareto tokens
        await IntelInstance.create(account_two, depositAmount, desiredReward, intelID, ttl, { from: account_two });

        const account_two_token_balance_after = await TokenInstance.balanceOf.call(account_two);

        assert.equal(account_two_token_balance_before.toNumber() - web3.toBigNumber(depositAmount).toNumber(), account_two_token_balance_after.toNumber());

    })

    it("Reward Intel one with 70 Pareto tokens using deposits from account two", async () => {
        const depositAmount = web3.toWei("70", "ether");
        const intelID = 1;
        let Intel;

        // approve 70 tokens from account two to Intel contract
        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_two });

        //depsoit 70 tokens from account two to Intel contract
        await IntelInstance.makeDeposit(account_two, depositAmount, { from: account_two });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_before = Intel[3].toNumber()

        // send the reward to Intel one from account two. It will automatically use deposits as the account two has enough deposit balance in Intel contract
        await IntelInstance.sendReward(intelID, depositAmount, { from: account_two });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_after = Intel[3].toNumber();

        assert.equal(IntelBalance_before + web3.toBigNumber(depositAmount).toNumber(), IntelBalance_after);

        const account_two_deposit_balance = await IntelInstance.getParetoBalance.call(account_two);
        assert.equal(account_two_deposit_balance.toNumber(), 0);
    })


    it("Reward Intel one with 80 Pareto tokens using approve/send two transactions from account three", async () => {
        const depositAmount = web3.toWei("80", "ether");
        const intelID = 1;
        let Intel;

        // approve 80 tokens from account three to Intel contract
        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_three });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_before = Intel[3].toNumber()

        const account_three_token_balance_before = await TokenInstance.balanceOf.call(account_three);

        // send reward to Intel one. It will do the actual transfer of Pareto tokens as account three does not have enough deposits in the Intel contract.
        await IntelInstance.sendReward(intelID, depositAmount, { from: account_three });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_after = Intel[3].toNumber();

        assert.equal(IntelBalance_before + web3.toBigNumber(depositAmount).toNumber(), IntelBalance_after);

        const account_three_token_balance_after = await TokenInstance.balanceOf.call(account_three);

        assert.equal(account_three_token_balance_before.toNumber() - web3.toBigNumber(depositAmount).toNumber(), account_three_token_balance_after.toNumber())

    })

    it("Distribute Intel one using account one", async () => {
        const intelID = 1;

        const account_one_token_balance_before = await TokenInstance.balanceOf.call(account_one);

        const Intel = await IntelInstance.getIntel(intelID);
        const IntelBalance = Intel[3].toNumber();

        const owner = await IntelInstance.owner.call();
        const owner_balance_before = await IntelInstance.getParetoBalance.call(owner);

        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {

                    // distribute the rewards of Intel one by making transaction from account one
                    await IntelInstance.distributeReward(intelID, { from: account_one });

                    const account_one_token_balance_after = await TokenInstance.balanceOf.call(account_one);

                    // expected account one's balance should be old_balance + 95% of Intel's balance
                    const expected_account_one_balance = (account_one_token_balance_before.toNumber() + (web3.toBigNumber(IntelBalance).toNumber() * .95)).toPrecision(10)

                    assert.equal(expected_account_one_balance, account_one_token_balance_after.toNumber());

                    const owner_balance_after = await IntelInstance.getParetoBalance.call(owner);

                    // owner's new balance should be old_balance + 5% of Intel balance
                    assert.equal((owner_balance_before.toNumber() + (web3.toBigNumber(IntelBalance).toNumber() * 0.05)).toPrecision(10), owner_balance_after.toNumber())


                    resolve();
                } catch (err) {
                    reject(err)
                }
            }, 5000);
        })
    })

    it("Reward Intel two with 150 Pareto tokens using deposits from account one", async () => {
        const depositAmount = web3.toWei("150", "ether");
        const intelID = 2;
        let Intel;

        //approve 150 tokens from account one to Intel contract
        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_one });

        //deposit 150 tokens from account one to Intel contract
        await IntelInstance.makeDeposit(account_one, depositAmount, { from: account_one });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_before = Intel[3].toNumber()

        //send reward from account one to Intel two. It will automatically deposits from account one as it has enough deposits.
        await IntelInstance.sendReward(intelID, depositAmount, { from: account_one });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_after = Intel[3].toNumber();

        assert.equal(IntelBalance_before + web3.toBigNumber(depositAmount).toNumber(), IntelBalance_after);

        const account_one_deposit_balance = await IntelInstance.getParetoBalance.call(account_one);
        assert.equal(account_one_deposit_balance.toNumber(), 0);
    })

    it("Reward Intel two with 800 Pareto tokens using approve/send two transactions from account three", async () => {
        const depositAmount = web3.toWei("800", "ether");
        const intelID = 2;
        let Intel;

        // approve 800 tokens from account three to Intel contract.
        await TokenInstance.approve(IntelInstance.address, depositAmount, { from: account_three });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_before = Intel[3].toNumber()

        const account_three_token_balance_before = await TokenInstance.balanceOf.call(account_three);

        //send reward from account three to Intel two. It will do the actual transfer of Pareto tokens as account three does not have enough deposited balance in Intel contract
        await IntelInstance.sendReward(intelID, depositAmount, { from: account_three });

        Intel = await IntelInstance.getIntel.call(intelID);
        const IntelBalance_after = Intel[3].toNumber();

        assert.equal(IntelBalance_before + web3.toBigNumber(depositAmount).toNumber(), IntelBalance_after);

        const account_three_token_balance_after = await TokenInstance.balanceOf.call(account_three);

        assert.equal(account_three_token_balance_before.toNumber() - web3.toBigNumber(depositAmount).toNumber(), account_three_token_balance_after.toNumber())

    })

    it("Distribute Intel two using account two", async () => {
        const intelID = 2;

        const account_two_token_balance_before = await TokenInstance.balanceOf.call(account_two);

        const Intel = await IntelInstance.getIntel(intelID);
        const IntelBalance = Intel[3].toNumber();

        const owner = await IntelInstance.owner.call();
        const owner_balance_before = await IntelInstance.getParetoBalance.call(owner);

        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    // distribute the rewards of Intel two by making transaction from account two
                    await IntelInstance.distributeReward(intelID, { from: account_two });

                    const account_two_token_balance_after = await TokenInstance.balanceOf.call(account_two);

                    // expected account two's balance should be old_balance + 95% of Intel's balance
                    const expected_account_two_balance = (account_two_token_balance_before.toNumber() + (web3.toBigNumber(IntelBalance).toNumber() * .95)).toPrecision(10)

                    assert.equal(expected_account_two_balance, account_two_token_balance_after.toNumber());

                    const owner_balance_after = await IntelInstance.getParetoBalance.call(owner);

                    // owner's new balance should be old_balance + 5% of Intel balance
                    assert.equal((owner_balance_before.toNumber() + (web3.toBigNumber(IntelBalance).toNumber() * 0.05)).toPrecision(10), owner_balance_after.toNumber())

                    resolve();
                } catch (err) {
                    reject(err)
                }
            }, 7000);
        })
    })

    it("Distribute Fee rewards from owner", async () => {
        const depositAmount_one = web3.toWei("100", "ether");
        const depositAmount_two = web3.toWei("150", "ether");

        const participants = await IntelInstance.getParticipants.call();
        const owner_address = await IntelInstance.owner.call();
        let owner_balance = await IntelInstance.getParetoBalance.call(owner_address);

        let totalParetoBalance = await IntelInstance.totalParetoBalance.call();
        assert.equal(totalParetoBalance.toNumber(), owner_balance.toNumber());


        // =================== Approve and Deposit Tokens ==================
        await TokenInstance.approve(IntelInstance.address, depositAmount_one, { from: account_one });
        await TokenInstance.approve(IntelInstance.address, depositAmount_two, { from: account_two });

        await IntelInstance.makeDeposit(account_one, depositAmount_one, { from: account_one });
        await IntelInstance.makeDeposit(account_two, depositAmount_two, { from: account_two });
        // =================== END ==================

        totalParetoBalance = await IntelInstance.totalParetoBalance.call();
        const Intel_contracts_deposit_balance = await IntelInstance.getParetoBalance.call(IntelInstance.address);

        const participants_balance_before = [];
        for (let i = 0; i < participants.length; i++) {
            let balance = await IntelInstance.getParetoBalance.call(participants[i]);
            participants_balance_before[i] = balance.toNumber();
        }

        await IntelInstance.distributeFeeRewards(participants, owner_balance.toNumber(), { from: accounts[3] });

        const participants_balance_after = [];
        for (let i = 0; i < participants.length; i++) {
            let balance = await IntelInstance.getParetoBalance.call(participants[i]);
            participants_balance_after[i] = balance.toNumber();
        }

        for (let q = 0; q < participants.length; q++) {
            // console.log(web3.toBigNumber(participants_balance_before[q]).toNumber() / (totalParetoBalance.toNumber() - Intel_contracts_deposit_balance.toNumber() - owner_balance.toNumber()) * owner_balance.toNumber());
            assert.equal(web3.toBigNumber(participants_balance_before[q]).toNumber() + (web3.toBigNumber(participants_balance_before[q]).toNumber() / (totalParetoBalance.toNumber() - Intel_contracts_deposit_balance.toNumber() - owner_balance.toNumber()) * owner_balance.toNumber()), participants_balance_after[q]);
        }

        owner_balance = await IntelInstance.getParetoBalance.call(owner_address);
        assert.equal(owner_balance.toNumber(), 0);


    })

})