import { Field, Label } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { POOL_ABI } from '@/consts/poolAbi';
import { type Config } from 'wagmi';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import useATokensAssets, { type A_TOKEN_ASSET } from '@/hooks/useATokenAsset';
import { useEffect, useState } from 'react';
import Listbox from '@/components/ui/Listbox';
import { parseUnits } from 'viem';
import useAssets from '@/hooks/useAssets';
import { cn } from '@/utils/cn';
import { formatBalance, shorifyAddress } from '@/utils/format';
import { useQueryStateByKey } from '@/hooks/useQueryStateByKey';
import useCurrentPool from '@/hooks/useCurrentPool';
import { simulateContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/consts/wagmiConfig';

const WithdrawTokenForm = () => {
  const { address } = useAccount();
  const { data, refetch: aTokensRefetch } = useATokensAssets();
  const { refetch: assetsRefetch } = useAssets();
  const { pool, isSupportedChain } = useCurrentPool();

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError }
    = useWaitForTransactionReceipt({
      confirmations: 2,
      hash,
    });

  const { value: selectedSymbol, setValue: setSelectedSymbol } = useQueryStateByKey<A_TOKEN_ASSET['symbol']>('aTokenSymbolSelected');
  const [amount, setAmount] = useState<string>('0.00');
  const [isSimulating, setIsSimulating] = useState(false);
  const usedToken = data?.find(token => token.symbol === selectedSymbol);
  const isFormDisabled = !(data?.length) || !usedToken || !isSupportedChain;
  const amountError = !isFormDisabled && (parseUnits(amount, usedToken?.decimals) > parseUnits(usedToken.balance, usedToken?.decimals));

  useEffect(() => {
    if (data?.length && !usedToken) {
      setSelectedSymbol(data[0].symbol);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length, usedToken]);

  useEffect(() => {
    if (!isConfirmed) return;
    toast.success(`Withdraw successfuly`);

    setAmount('');
    assetsRefetch?.();
    aTokensRefetch?.();
  }, [aTokensRefetch, assetsRefetch, isConfirmed]);

  useEffect(() => {
    if (!isError) return;
    toast.error(`Withdraw error`);
  }, [isError]);

  const handleSubmit = async () => {
    if (!usedToken) {
      toast.error('Submit error: no token found');
      return;
    }
    if (!address) {
      toast.error('Submit error: no address');
      return;
    }
    if (!pool) {
      toast.error('Submit error: no pool found');
      return;
    }
    try {
      setIsSimulating(true);
      const txParams = {
        abi: POOL_ABI,
        address: pool.POOL,
        functionName: 'withdraw',
        args: [
          usedToken.underlying,
          parseUnits(amount, usedToken.decimals),
          address,
        ],
      } as const;
      await simulateContract(wagmiConfig as Config, txParams);
      writeContract(txParams);
    }
    catch (error) {
      if (error instanceof Error) {
        toast.error('Submit error: ' + error.message);
        return;
      }
      toast.error('Submit error: ' + error);
    }
    finally {
      setIsSimulating(false);
    }
  };

  return (
    <div
      className={`
        flex flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground
      `}
    >
      <div
        className="flex flex-col items-start gap-1.5"
      >
        <h4 className="leading-none">Withdraw</h4>
        <p className="text-muted-foreground">Withdraw your tokens</p>
      </div>
      <div
        className="space-y-4"
      >
        <div className="space-y-2">
          <Field disabled={isFormDisabled} className="space-y-2">
            <Label
              className={`
                flex items-center gap-2 text-sm leading-none font-medium
                select-none
                data-disabled:pointer-events-none data-disabled:opacity-50
              `}
            >
              Token
            </Label>
            <Listbox options={data?.map(asset => asset.symbol)} value={selectedSymbol || 'aUSDC'} onChange={setSelectedSymbol} />
          </Field>
          <p className="text-sm text-subtext">
            aToken:
            {shorifyAddress(usedToken?.address)}
          </p>
        </div>
        <div className="space-y-2">
          <Field disabled={isFormDisabled} className="space-y-2">
            <Label
              className={`
                flex items-center gap-2 text-sm leading-none font-medium
                select-none
                data-disabled:pointer-events-none data-disabled:opacity-50
              `}
            >
              Amount
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                className={`
                  flex-1
                  md:text-sm
                `}
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <Button
                variant="white"
                className="h-auto"
                onClick={() => usedToken && setAmount(usedToken.balance)}
              >
                Max
              </Button>
            </div>
            <p className={cn(`text-sm text-danger`, { hidden: !amountError })}>
              Amount exceeds balance
            </p>
            <p className="text-sm text-subtext">
              Available:
              {formatBalance(usedToken?.balance)}
              {' '}
              {usedToken?.symbol}
            </p>
          </Field>
        </div>
        <Button
          disabled={isFormDisabled || amountError || isConfirming || !(+amount) || isSimulating}
          type="submit"
          onClick={handleSubmit}
        >
          {isSimulating
            ? 'Checking transaction...'
            : 'Withdraw'}
        </Button>
      </div>
    </div>
  );
};
export default WithdrawTokenForm;
