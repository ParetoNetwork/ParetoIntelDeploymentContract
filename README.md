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
Under `migrations` folder in `2_deploy_Intel.js`, on line # 3, set the address of owner of Intel contract.

### 4 - Deploy Intel contract on mainnet
Deploy the Intel contract using following command
```
truffle migrate --network mainnet
```
### 5 - Integrate the artifact file into staging branch of ParetoNetwork server
Copy the `Intel.json` file under `build/contracts` on this repository and replace it with the `Intel.json` file under `build/contracts` in `staging` branch of `ParetoNetworkServer`.
