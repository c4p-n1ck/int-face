export const scheduledTransfersABI = [
  { inputs: [{ internalType: 'bytes', name: 'innerError', type: 'bytes' }], name: 'BatchError', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'address', name: 'token', type: 'address' },
      { indexed: false, internalType: 'address', name: 'oracle', type: 'address' },
    ],
    name: 'PoolCreated',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'bytes[]', name: 'calls', type: 'bytes[]' },
      { internalType: 'bool', name: 'revertOnFail', type: 'bool' },
    ],
    name: 'batch',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_oracle', type: 'address' },
      { internalType: 'address', name: '_token', type: 'address' },
    ],
    name: 'createContract',
    outputs: [{ internalType: 'address', name: 'createdContract', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'oracle',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permitToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
