import useAssets from '@/hooks/useAssets';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import Listbox from '@/components/ui/Listbox';
import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import { type Config } from 'wagmi';
import { Field, Label } from '@headlessui/react';
import { cn } from '@/utils/cn';
import useAllowance from '@/hooks/useAllowance';
import { parseUnits } from 'viem';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { ERC20_ABI } from '@/consts/erc20Abi';
import { POOL_ABI } from '@/consts/poolAbi';
import useATokensAssets from '@/hooks/useATokenAsset';
import { useQueryStateByKey } from '@/hooks/useQueryStateByKey';
import type { SUPPORTED_SYMBOLS } from '@/types/symbols';
import useCurrentPool from '@/hooks/useCurrentPool';
import { simulateContract } from '@wagmi/core';
import { config as wagmiConfig } from '@/consts/wagmiConfig';

const DepositTokensForm = () => {
  const { address } = useAccount();
  const { data, refetch: assetsRefetch, status } = useAssets();
  const { refetch: aTokensRefetch } = useATokensAssets();
  const { pool, isSupportedChain } = useCurrentPool();

  const { value: selectedSymbol, setValue: setSelectedSymbol } = useQueryStateByKey<SUPPORTED_SYMBOLS>('assetSymbolSelected');
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError }
    = useWaitForTransactionReceipt({
      confirmations: 2,
      hash,
    });
  const [amount, setAmount] = useState<string>('0.00');
  const [isSimulating, setIsSimulating] = useState(false);
  const usedToken = data?.find(token => token.symbol === selectedSymbol);
  const { data: tokenAllowance, status: allowanceStatus, refetch: allowanceRefetch, isRefetching } = useAllowance(usedToken);
  const isFormDisabled = !(data?.length) || !usedToken || !isSupportedChain;
  const allowanceEnough = allowanceStatus === 'success' && tokenAllowance && usedToken && tokenAllowance >= parseUnits(amount, usedToken.decimals);
  const amountError = !isFormDisabled && (parseUnits(amount, usedToken?.decimals) > parseUnits(usedToken.balance, usedToken?.decimals));

  useEffect(() => {
    if (data?.length && !usedToken) {
      setSelectedSymbol(data[0].symbol);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length, usedToken]);

  useEffect(() => {
    if (!isConfirmed) return;
    toast.success(`${allowanceEnough ? 'Deposit' : 'Approve'} successfuly`);
    setAmount('');
    assetsRefetch?.();
    allowanceRefetch();
    aTokensRefetch?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  useEffect(() => {
    if (!isError) return;
    toast.error(`${allowanceEnough ? 'Deposit' : 'Approve'} error`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (!allowanceEnough) {
        const txParams = {
          abi: ERC20_ABI,
          address: usedToken.address,
          functionName: 'approve',
          args: [
            pool.POOL,
            parseUnits(amount, usedToken.decimals),
          ],
          account: address,
        } as const;
        await simulateContract(wagmiConfig as Config, txParams);
        writeContract(txParams);
        return;
      }
      const txParams = {
        abi: POOL_ABI,
        address: pool.POOL,
        functionName: 'supply',
        args: [
          usedToken.address,
          parseUnits(amount, usedToken.decimals),
          address,
          0,
        ],
        account: address,
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
        <h4 className="leading-none">Deposit</h4>
        <p className="text-muted-foreground">
          Deposit your tokens into Aave to
          start earning interest
        </p>
      </div>
      <div
        className="space-y-4"
      >
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
          <Listbox options={data?.map(asset => asset.symbol)} value={selectedSymbol || 'USDC'} onChange={setSelectedSymbol} />
        </Field>
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
              onClick={() => usedToken?.balance && setAmount(usedToken.balance)}
            >
              Max
            </Button>
          </div>
          <p className={cn(`text-sm text-danger`, { hidden: !amountError })}>
            Insufficient balance
          </p>
        </Field>
        <Button
          disabled={status === 'pending' || isRefetching || isConfirming || !(+amount) || isSimulating}
          onClick={handleSubmit}
        >
          {isSimulating
            ? 'Checking transaction...'
            : (status === 'pending' || allowanceStatus === 'pending')
                ? 'Loading...'
                : (
                    <>
                      {status === 'error' && 'Get allowance error'}
                      {status === 'success' && allowanceEnough && 'Deposit'}
                      {status === 'success' && !allowanceEnough && 'Approve to continue'}
                    </>
                  )}

        </Button>
      </div>
    </div>
  );
};

export default DepositTokensForm;
