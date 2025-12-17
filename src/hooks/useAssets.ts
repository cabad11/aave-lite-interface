import { ERC20_ABI } from '@/consts/erc20Abi';
import type { UNDERLYING_ADDRESSES, A_TOKEN_ADDRESSES } from '@/types/addresses';
import { useAccount, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import type { SUPPORTED_SYMBOLS } from '@/types/symbols';
import getTokenData from '@/utils/getTokenData';
import type { ValueOf } from '@/types/utils';
import useCurrentPool from './useCurrentPool';

export type ASSET = {
  symbol: SUPPORTED_SYMBOLS
  name?: string
  decimals: number
  balance: string
  address: UNDERLYING_ADDRESSES | A_TOKEN_ADDRESSES
  logoURI?: string
};

const useAssets = () => {
  const { address, isConnected } = useAccount();
  const { pool, chainId, isSupportedChain } = useCurrentPool();
  const poolAssetEntries = pool
    ? (Object.entries(pool.ASSETS) as [SUPPORTED_SYMBOLS, ValueOf<typeof pool.ASSETS>][])
    : [];
  const { data, ...rest } = useReadContracts({
    contracts: poolAssetEntries.map(asset => ({
      chainId: chainId,
      address: asset[1].UNDERLYING,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address!],
    })),
    query: { enabled: isConnected && !!address },
  });

  const assets: ASSET[] | undefined = data?.map((readData, i) => {
    if (readData?.error) {
      return null;
    }
    const symbol = poolAssetEntries[i][0];
    return {
      symbol,
      decimals: poolAssetEntries[i][1].decimals,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      balance: formatUnits(readData.result as any, poolAssetEntries[i][1].decimals),
      address: poolAssetEntries[i][1].UNDERLYING,
      ...getTokenData({ symbol }),
    };
  }).filter(el => el != null).filter(asset => +asset.balance > 0.000001);

  if (!isSupportedChain) {
    return {
      data: undefined,
      isLoading: false,
      isPending: false,
      isError: true,
      status: 'error',
      error: new Error('Unsupported network'),
      isSuccess: false,
      refetch: null,
    };
  }

  return { data: assets, ...rest };
};

export default useAssets;
