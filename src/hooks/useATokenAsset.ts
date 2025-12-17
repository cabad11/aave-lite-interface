import { ERC20_ABI } from '@/consts/erc20Abi';
import { useAccount, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import type { SUPPORTED_SYMBOLS } from '@/types/symbols';
import type { ValueOf } from '@/types/utils';
import { POOL_ABI } from '@/consts/poolAbi';
import type { ASSET } from './useAssets';
import type { UNDERLYING_ADDRESSES } from '@/types/addresses';
import useCurrentPool from './useCurrentPool';

export type A_TOKEN_ASSET = Omit<ASSET, 'name' | 'logoURI' | 'symbol'> & {
  underlying: UNDERLYING_ADDRESSES
  symbol: `a${SUPPORTED_SYMBOLS}`
};

const useATokensAssets = () => {
  const { address, isConnected } = useAccount();
  const { pool, chainId, isSupportedChain } = useCurrentPool();
  const poolAssetEntries = pool
    ? (Object.entries(pool.ASSETS) as [SUPPORTED_SYMBOLS, ValueOf<typeof pool.ASSETS>][])
    : [];
  const { data: ATokenContacts, isSuccess, ...contractsRest } = useReadContracts({
    contracts: poolAssetEntries.map(assetEntry => ({
      chainId: chainId,
      address: pool?.POOL as `0x${string}`,
      abi: POOL_ABI,
      functionName: 'getReserveAToken',
      args: [assetEntry[1].UNDERLYING],
    })),
    query: { enabled: isConnected && !!address && !!pool },
  });
  const { data, ...rest } = useReadContracts({
    contracts: poolAssetEntries?.map((_, i) => ({
      chainId: chainId,
      address: ATokenContacts?.[i]?.result,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address!],
    })),
    query: { enabled: isSuccess && !ATokenContacts.some(c => c.error) },
  });

  const assets: A_TOKEN_ASSET[] | undefined = data?.map((readData, i) => {
    if (readData?.error) {
      return null;
    }
    const symbol = poolAssetEntries[i][0];
    return {
      symbol: `a${symbol}` as `a${SUPPORTED_SYMBOLS}`,
      underlying: poolAssetEntries[i][1].UNDERLYING,
      decimals: poolAssetEntries[i][1].decimals,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      balance: formatUnits(readData.result as any, poolAssetEntries[i][1].decimals),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      address: ATokenContacts?.[i]?.result as any,
    };
  }).filter(el => el != null).filter(asset => +asset.balance > 0.000001);
  console.log(ATokenContacts, data, assets);
  if (!isSupportedChain) {
    return {
      data: undefined,
      isLoading: false,
      isPending: false,
      isError: true,
      error: new Error('Unsupported network'),
      isSuccess: false,
      refetch: null,
    };
  }

  return { data: assets, ...contractsRest, ...rest };
};

export default useATokensAssets;
