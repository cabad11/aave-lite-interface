import { useAccount } from 'wagmi';
import useAssets from '@/hooks/useAssets';
import AssetCard from './common/AssetCard';
import Skeleton from './ui/Skeleton';
import ErrorMessage from './common/ErrorMessage';

const WalletAssetsList = () => {
  const { isConnected } = useAccount();
  const { data, status, refetch, error } = useAssets();

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Your tokens (available to deposit)</h2>
      </div>
      <div
        className={`
          flex flex-col gap-6 rounded-xl border bg-card text-card-foreground
        `}
      >
        {!isConnected
          ? (
              <div
                className="px-6 pt-12 pb-6 text-center"
              >
                <p className="text-subtext">Connect your wallet to view balances</p>
              </div>
            )
          : (
              <>
                {status === 'pending' && [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-26" />
                ))}
                {status === 'error' && <ErrorMessage message={error!.message} refetch={() => refetch?.()} />}
                {status === 'success' && !!data?.length && data?.map(asset => <AssetCard key={asset.symbol} {...asset} />)}
                {status === 'success' && !data?.length && (
                  <div
                    className="px-6 pt-12 pb-6 text-center"
                  >
                    <p className="text-subtext">No tokens found</p>
                  </div>
                )}
              </>
            )}
      </div>
    </div>
  );
};

export default WalletAssetsList;
