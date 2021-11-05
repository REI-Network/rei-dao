const abiRouter = [
    {
      "inputs": [
        {
          "internalType": "contract IConfig",
          "name": "config",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "feeUsage",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "freeFeeUsage",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "contractFeeUsage",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "balanceUsage",
          "type": "uint256"
        }
      ],
      "name": "UsageInfo",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "validator",
          "type": "address"
        }
      ],
      "name": "assignBlockReward",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "validator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "feeUsage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "freeFeeUsage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "contractFeeUsage",
          "type": "uint256"
        }
      ],
      "name": "assignTransactionReward",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "config",
      "outputs": [
        {
          "internalType": "contract IConfig",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "estimateTotalFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "freeFee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "contractFee",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "acValidators",
          "type": "address[]"
        },
        {
          "internalType": "int256[]",
          "name": "priorities",
          "type": "int256[]"
        }
      ],
      "name": "onAfterBlock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
export default abiRouter
