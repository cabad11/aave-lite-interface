import Logo from '@/assets/Logo';
import Button from '@/components/ui/Button';
import { useChainId, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { config as wagmiConfig } from '@/consts/wagmiConfig';

const Header = () => {
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const isTestnet = wagmiConfig.chains.find(chain => chain.id === chainId)?.testnet;
  return (
    <header className="border-b border-border">
      <div className={`
        mx-auto flex h-16 items-center justify-between px-4
        md:px-20
      `}
      >
        <div className="flex items-center gap-2">
          <div className={`
            flex h-8 w-8 items-center justify-center rounded-lg bg-primary
          `}
          >
            <Logo />
          </div>
          <span className={`
            text-sm font-semibold text-text
            md:text-base
          `}
          >
            Aave Lite
            {isTestnet && (
              <span className={`
                hidden text-subtext
                sm:inline
              `}
              >
                (Testnet)
              </span>
            )}
          </span>
        </div>
        <div className={`
          flex items-center gap-2
          md:gap-4
        `}
        >

          <ConnectButton.Custom>
            {({
              account,
              chain,
              openConnectModal,
              openChainModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected
                = ready
                  && account
                  && chain
                  && (!authenticationStatus
                    || authenticationStatus === 'authenticated');
              if (!connected) {
                return (
                  <Button className="md:text-base" disabled={!ready} onClick={openConnectModal}>
                    Connect
                    Wallet
                  </Button>
                );
              }
              return (
                <>
                  {chain.unsupported
                    ? (
                        <Button onClick={openChainModal} invalid={true}>
                          Wrong network
                        </Button>
                      )
                    : (
                        <Button
                          variant="white"
                          onClick={openChainModal}
                        >
                          {chain.hasIcon && (
                            <div
                              className={`
                                mr-1 size-4 overflow-hidden rounded-full
                              `}
                              style={{
                                background: chain.iconBackground,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  className="size-4"
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </Button>
                      )}
                  <span
                    className={`
                      hidden text-sm text-text
                      sm:inline
                      md:text-base
                    `}
                  >
                    {account.displayName}
                  </span>
                  <Button variant="white" onClick={() => disconnect()}>
                    Disconnect
                  </Button>
                </>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
};

export default Header;
