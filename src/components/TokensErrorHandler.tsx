import { useEffect } from 'react';
import useAssets from '@/hooks/useAssets';
import { toast } from 'react-hot-toast';
import useATokensAssets from '@/hooks/useATokenAsset';

const TokensErrorHandler = () => {
  const { error, isError } = useAssets();
  const { error: aError, isError: isAError } = useATokensAssets();

  useEffect(() => {
    if (isError && error) {
      toast.error('Get token balance Error ' + error.message);
    }
    if (isAError && aError) {
      toast.error('Get atoken balance Error ' + aError.message);
    }
  }, [isError, error, aError, isAError]);

  return null;
};

export default TokensErrorHandler;
