# ParetoIntelDeploymentContract
The Ethereum smart contract necessary to deploy intel into the Pareto Alpha Capture System

## Steps to Deploy

### 1 - Install the project dependencies
Run this command in the root folder of project
```
npm install
```
### 2 - Change Mnemonic
In `truffle.js` file, on line # 3, set your mnemonic.

### 3 - Set owner's address
Under `migrations` folder in `2_deploy_Intel.js`, on line # 3, set the address of owner of Intel contract. (Often times, the deployment address is the address owner, so the deployment address would be address[0] of the mnemonic phrase)


####3.1 - npm install truffle-hdwallet-provider

### 4 - Deploy Intel contract on mainnet
Deploy the Intel contract using following command
```
truffle migrate --network mainnet
```

Other options are
```
truffle migrate --network ropsten
```
for deploying to Ropsten

Troubleshooting: use --reset if the command doesn't connect to the network (If "Running Migration" doesn't appear on command line)
```
truffle migrate --reset --network mainnet
```

### 5 - Integrate the artifact file into staging branch of ParetoNetworkServer
Copy the `Intel.json` file under `build/contracts` on this repository and replace it with the `Intel.json` file under `build/contracts` in `staging` branch of `ParetoNetworkServer`.

### 6 - Unit Test - truffle test
####6.1 - npm install web3 - Required by IntelTest.js
####6.2 - Install Ganache https://truffleframework.com/ganache
####6.3 - Launch Gananche. Click on Settings. Take the mnemonics from IntelTest.js paste them into the Ganache textfield for mnemonics on Account & Keys. Hit Save and Restart.
####6.4 - Run against your local environment - truffle test --network development
####6.5 - If no events are emitted when you run the test, you may need to increment your _intelID


# Distribute Fee rewards
## The Distribute Fee Rewards script is independent of the Truffle project. You should be able to run the script without getting the Truffle project to build.
## You will need to do a npm install at the root directory of the project to resolve all of the node modules include ethereum-tx
## You will set the following fields in config.js under script directory
```
"intelAddress" will be set to the Intel contract's address
```
```
"ownerPrivateKey" will be set to the private key of owner ( this address has to be the owner of Intel contract )
```
```
"network_URL" will be set to the URL of Ethereum network
```
next, you will run the command under script directory

```
node distributeFee.js
```
