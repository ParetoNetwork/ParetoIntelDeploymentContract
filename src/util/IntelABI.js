export default [
	{
		"constant": true,
		"inputs": [
			{
				"name": "intelIndex",
				"type": "uint256"
			}
		],
		"name": "getIntel",
		"outputs": [
			{
				"name": "intelProvider",
				"type": "address"
			},
			{
				"name": "depositAmount",
				"type": "uint256"
			},
			{
				"name": "desiredReward",
				"type": "uint256"
			},
			{
				"name": "balance",
				"type": "uint256"
			},
			{
				"name": "intelID",
				"type": "uint256"
			},
			{
				"name": "rewardAfter",
				"type": "uint256"
			},
			{
				"name": "rewarded",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalParetoBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "destination",
				"type": "address"
			},
			{
				"name": "account",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "gasLimit",
				"type": "uint256"
			}
		],
		"name": "proxy",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "participants",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getParetoBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_token",
				"type": "address"
			}
		],
		"name": "setParetoToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getParticipants",
		"outputs": [
			{
				"name": "_participants",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "intelIndex",
				"type": "uint256"
			},
			{
				"name": "rewardAmount",
				"type": "uint256"
			}
		],
		"name": "sendReward",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_participants",
				"type": "address[]"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "distributeFeeRewards",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "intelIndex",
				"type": "uint256"
			}
		],
		"name": "distributeReward",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "intelIndex",
				"type": "uint256"
			}
		],
		"name": "contributionsByIntel",
		"outputs": [
			{
				"name": "addresses",
				"type": "address[]"
			},
			{
				"name": "amounts",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "registered",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "makeDeposit",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAllIntel",
		"outputs": [
			{
				"name": "intelID",
				"type": "uint256[]"
			},
			{
				"name": "intelProvider",
				"type": "address[]"
			},
			{
				"name": "depositAmount",
				"type": "uint256[]"
			},
			{
				"name": "desiredReward",
				"type": "uint256[]"
			},
			{
				"name": "balance",
				"type": "uint256[]"
			},
			{
				"name": "rewardAfter",
				"type": "uint256[]"
			},
			{
				"name": "rewarded",
				"type": "bool[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "paretoAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "intelCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "intelsByProvider",
		"outputs": [
			{
				"name": "intelProvider",
				"type": "address"
			},
			{
				"name": "depositAmount",
				"type": "uint256"
			},
			{
				"name": "desiredReward",
				"type": "uint256"
			},
			{
				"name": "balance",
				"type": "uint256"
			},
			{
				"name": "intelID",
				"type": "uint256"
			},
			{
				"name": "rewardAfter",
				"type": "uint256"
			},
			{
				"name": "rewarded",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_provider",
				"type": "address"
			}
		],
		"name": "getIntelsByProvider",
		"outputs": [
			{
				"name": "intelID",
				"type": "uint256[]"
			},
			{
				"name": "intelProvider",
				"type": "address[]"
			},
			{
				"name": "depositAmount",
				"type": "uint256[]"
			},
			{
				"name": "desiredReward",
				"type": "uint256[]"
			},
			{
				"name": "balance",
				"type": "uint256[]"
			},
			{
				"name": "rewardAfter",
				"type": "uint256[]"
			},
			{
				"name": "rewarded",
				"type": "bool[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "intelProvider",
				"type": "address"
			},
			{
				"name": "depositAmount",
				"type": "uint256"
			},
			{
				"name": "desiredReward",
				"type": "uint256"
			},
			{
				"name": "intelID",
				"type": "uint256"
			},
			{
				"name": "ttl",
				"type": "uint256"
			}
		],
		"name": "create",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_token",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "intelIndex",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "rewardAmount",
				"type": "uint256"
			}
		],
		"name": "Reward",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "intelProvider",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "depositAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "desiredReward",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "intelID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "ttl",
				"type": "uint256"
			}
		],
		"name": "NewIntel",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "intelIndex",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "provider_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "provider",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "distributor",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "distributor_amount",
				"type": "uint256"
			}
		],
		"name": "RewardDistributed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "destination",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "gasLimit",
				"type": "uint256"
			}
		],
		"name": "LogProxy",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposited",
		"type": "event"
	}
]