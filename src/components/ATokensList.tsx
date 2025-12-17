import useATokensAssets, { type A_TOKEN_ASSET } from '@/hooks/useATokenAsset';
import { useQueryStateByKey } from '@/hooks/useQueryStateByKey';
import { formatBalance, shorifyAddress } from '@/utils/format';
import { Copy } from 'lucide-react';
import Button from './ui/Button';

const ATokensList = () => {
  const { data } = useATokensAssets();
  const { setValue } = useQueryStateByKey<A_TOKEN_ASSET['symbol']>('aTokenSymbolSelected');

  return (
    <div
      className={`
        flex flex-col gap-6 rounded-xl border bg-card text-card-foreground
      `}
    >
      <div
        className="flex flex-col items-start gap-1.5 px-6 pt-6"
      >
        <h4 className="leading-none">Your positions (aTokens)</h4>
        <p className="text-muted-foreground">
          View your deposited assets and
          interest-bearing aTokens
        </p>
      </div>
      <div
        className="px-6"
      >
        <div className="overflow-x-auto">
          <div
            className="relative w-full overflow-x-auto"
          >
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr
                  className={`
                    border-b transition-colors
                    hover:bg-muted/50
                  `}
                >
                  <th
                    className={`
                      h-10 px-2 text-left align-middle font-medium
                      whitespace-nowrap text-foreground
                    `}
                  >
                    Asset
                  </th>
                  <th
                    className={`
                      hidden h-10 px-2 text-left align-middle font-medium
                      whitespace-nowrap text-foreground
                      md:table-cell
                    `}
                  >
                    aToken Address
                  </th>
                  <th
                    className={`
                      h-10 px-2 text-right align-middle font-medium
                      whitespace-nowrap text-foreground
                    `}
                  >
                    Balance
                  </th>
                  <th
                    className={`
                      h-10 px-2 text-right align-middle font-medium
                      whitespace-nowrap text-foreground
                    `}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {!!data?.length && data?.map(asset => (
                  <tr
                    key={asset.symbol}
                    className={`
                      border-b transition-colors
                      hover:bg-muted/50
                      data-[state=selected]:bg-muted
                    `}
                  >
                    <td
                      className="p-2 align-middle whitespace-nowrap"
                    >
                      <div>
                        <span className="font-medium text-text">{asset.symbol}</span>
                        <div className={`
                          mt-1 flex items-center gap-1
                          md:hidden
                        `}
                        >
                          <span className="text-xs text-text">{shorifyAddress(asset.address)}</span>
                          <button
                            aria-label="Copy contract address"
                            className={`
                              shrink-0 p-0.5 text-subtext transition-opacity
                              hover:opacity-70
                            `}
                          >
                            <Copy className="h-3 w-3" onClick={() => navigator.clipboard.writeText(asset.address)} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`
                        hidden p-2 align-middle whitespace-nowrap
                        md:table-cell
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-subtext">
                          {shorifyAddress(asset.address)}
                        </span>
                        <button
                          aria-label="Copy contract address"
                          className={`
                            shrink-0 p-0.5 text-subtext transition-opacity
                            hover:opacity-70
                          `}
                        >
                          <Copy className="h-3 w-3" onClick={() => navigator.clipboard.writeText(asset.address)} />
                        </button>
                      </div>
                    </td>
                    <td
                      className={`
                        p-2 text-right align-middle whitespace-nowrap
                        text-subtext
                      `}
                    >
                      <span>{formatBalance(asset.balance)}</span>
                    </td>
                    <td
                      className="p-2 text-right align-middle whitespace-nowrap"
                    >
                      <Button
                        variant="white"
                        onClick={() => setValue(asset.symbol)}
                        aria-label={`Withdraw ${asset.symbol}`}
                      >
                        Withdraw
                      </Button>
                    </td>
                  </tr>
                ))}
                {!data?.length && (
                  <tr
                    className={`
                      border-b transition-colors
                      hover:bg-muted/50
                      data-[state=selected]:bg-muted
                    `}
                  >
                    <td
                      className={`
                        p-2 py-8 text-center align-middle whitespace-nowrap
                        text-subtext
                      `}
                      colSpan={4}
                    >
                      No positions yet. Deposit tokens to start
                      earning interest.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATokensList;
