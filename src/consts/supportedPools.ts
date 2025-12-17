import {
  AaveV3Sepolia,
  AaveV3BaseSepolia,
  AaveV3Ethereum,
  AaveV3Base,
} from '@bgd-labs/aave-address-book';

import type { SUPPORTED_CHAINS } from '@/types/chains';

const supportedPools = {
  AaveV3Sepolia,
  AaveV3BaseSepolia,
  AaveV3Ethereum,
  AaveV3Base,
} as const satisfies { [key: string]: { CHAIN_ID: SUPPORTED_CHAINS } };
export default supportedPools;
