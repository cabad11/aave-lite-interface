export const POOL_ABI = [{ inputs:
  [
    { internalType: 'address', name: 'asset', type: 'address' },
    { internalType: 'uint256', name: 'amount', type: 'uint256' },
    { internalType: 'address', name: 'onBehalfOf', type: 'address' },
    { internalType: 'uint16', name: 'referralCode', type: 'uint16' },
  ],
name: 'supply', outputs: [], stateMutability: 'nonpayable', type: 'function' },
{ inputs:
  [
    { internalType: 'address', name: 'asset', type: 'address' },
    { internalType: 'uint256', name: 'amount', type: 'uint256' },
    { internalType: 'address', name: 'to', type: 'address' },
  ],
name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
{
  inputs: [
    {
      name: 'asset',
      type: 'address',
    },
  ],
  name: 'getReserveAToken',
  outputs: [
    {
      name: '',
      type: 'address',
    },
  ],
  payable: false,
  stateMutability: 'view',
  type: 'function',
},
] as const;
