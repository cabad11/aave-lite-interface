import type { ASSET } from '@/hooks/useAssets';
import { formatBalance, shorifyAddress } from '@/utils/format';
import Button from '../ui/Button';
import { Copy } from 'lucide-react';
import { useQueryStateByKey } from '@/hooks/useQueryStateByKey';
import type { SUPPORTED_SYMBOLS } from '@/types/symbols';

const AssetCard = ({ symbol, name, balance, address, logoURI }: ASSET) => {
  const { setValue } = useQueryStateByKey<SUPPORTED_SYMBOLS>('assetSymbolSelected');

  return (
    <div
      className={`
        flex items-center justify-between gap-2 rounded-xl border bg-card p-3
        md:p-4
      `}
    >
      <div className={`
        flex min-w-0 flex-1 items-center gap-2
        md:gap-3
      `}
      >
        {logoURI
          ? (
              <img src={logoURI} alt={symbol} className="size-10 rounded-full" />
            )
          : (
              <div className={`
                flex size-10 items-center justify-center rounded-full
                bg-gray-300 text-sm font-bold text-gray-600
              `}
              >
                {symbol.slice(0, 2)}
              </div>
            )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-text">{symbol}</span>
            {!!name && (
              <span
                className={`
                  text-sm text-subtext
                  md:text-base
                `}
              >
                {name}
              </span>
            )}
          </div>
          <div
            className={`
              text-sm text-text
              md:text-base
            `}
          >
            Available:
            <span className="font-medium">
              {formatBalance(balance)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`
                truncate text-xs text-subtext
                md:text-sm
              `}
            >
              Contract:
              {' '}
              {shorifyAddress(address)}
            </span>
            <button
              aria-label="Copy contract address"
              className={`
                shrink-0 p-0.5 text-subtext transition-opacity
                hover:opacity-70
              `}
            >
              <Copy className="h-3 w-3" onClick={() => navigator.clipboard.writeText(address)} />
            </button>
          </div>
        </div>
      </div>
      <Button onClick={() => setValue(symbol)} aria-label={`Deposit ${symbol}`}>
        Deposit
      </Button>
    </div>
  );
};

export default AssetCard;
