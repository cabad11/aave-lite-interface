import { ERC20_ABI } from '@/consts/erc20Abi';

import { useAccount, useReadContract } from 'wagmi';
import type { ASSET } from './useAssets';
import useCurrentPool from './useCurrentPool';

const useAllowance = (asset: ASSET | undefined) => {
  const { address, isConnected } = useAccount();
  const { pool, chainId, isSupportedChain } = useCurrentPool();

  return useReadContract({
    chainId: chainId,
    address: asset?.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address!, pool!.POOL],
    query: { enabled: isConnected && !!asset && !!address && isSupportedChain },
  });
};

export default useAllowance;
