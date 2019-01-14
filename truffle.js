var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "avocado armed also position solution total token maze deny neutral bless share";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://heavily-resolved-condor.quiknode.io/adc544a9-3571-41db-ba04-b4e00d19b728/szTTYvyyy-oAGZVn3CR7EQ==/",0,9)
      },
      network_id: 3,
      gas: 4712388

    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/QWMgExFuGzhpu2jUr6Pq",0 ,9)
      },
      network_id: 4,
      // gas: 6712388,
      // gasPrice:8000000000
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://internally-settling-racer.quiknode.io/b5d97fc4-1946-4411-87e1-c7d961fb0e8d/X2kLtRMEBbjEkSJCCK8hFA==/")
      },
      network_id: 1,
      gas: 4712388

    }   
    
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }};