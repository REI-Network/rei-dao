const registerAbi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "genesisAddrs",
        type: "address[]",
      },
      {
        internalType: "bytes[]",
        name: "genesisBLSPublicKey",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "validator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "BLSPublicKey",
        type: "bytes",
      },
    ],
    name: "SetBLSPublicKey",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "getBLSPublicKey",
    outputs: [
      {
        internalType: "bytes",
        name: "key",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "key",
        type: "bytes",
      },
    ],
    name: "isBLSPublicKeyExist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "isRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "key",
        type: "bytes",
      },
    ],
    name: "setBLSPublicKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "validators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "validatorsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export default registerAbi;
