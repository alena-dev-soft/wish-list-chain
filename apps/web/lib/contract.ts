export const CONTRACT_ADDRESS = "0x90de4a1934d0B062423adAEeDEe37Bb6fD12D0Ca";

export const ABI = [
  {
    name: 'totalDreamPower',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'addGoal',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_targetAmount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'getGoals',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_owner', type: 'address' }],
    outputs: [{
      type: 'tuple[]',
      components: [
        { name: 'name', type: 'string' },
        { name: 'targetAmount', type: 'uint256' },
        { name: 'currentAmount', type: 'uint256' },
        { name: 'dreamPower', type: 'uint256' },
        { name: 'isFulfilled', type: 'bool' },
        { name: 'createdAt', type: 'uint256' },
      ],
    }],
  },
  {
    name: 'donate',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_goalIndex', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;