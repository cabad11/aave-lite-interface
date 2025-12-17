import { config as wagmiConfig } from '@/consts/wagmiConfig';
import pools from '@/consts/supportedPools';

import { useChainId } from 'wagmi';

const useCurrentPool = () => {
  const chainId = useChainId<typeof wagmiConfig>();
  const pool = Object.values(pools).find(p => p.CHAIN_ID === chainId);
  return {
    pool,
    isSupportedChain: !!pool,
    chainId,
  };
};

export default useCurrentPool;
