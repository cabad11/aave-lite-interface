import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { config as wagmiConfig } from '@/consts/wagmiConfig';

import DepositTokenForm from './components/DepositTokenForm';
import WalletAssetsList from './components/WalletAssetsList';
import ATokensList from './components/ATokensList';
import WithdrawTokenForm from './components/WithdrawTokenForm';
import TokensErrorHandler from './components/TokensErrorHandler';
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-bg">
            <Toaster position="top-right" />
            <TokensErrorHandler />
            <Header />
            <main className={`
              mx-auto grid grid-cols-1 gap-4 px-4 py-4
              md:gap-6 md:px-20 md:py-8
              lg:grid-cols-12
            `}
            >
              <div className={`
                space-y-4
                md:space-y-6
                lg:col-span-7
              `}
              >
                <WalletAssetsList />
                <DepositTokenForm />
              </div>
              <div className={`
                space-y-4
                md:space-y-6
                lg:col-span-5
              `}
              >
                <ATokensList />
                <WithdrawTokenForm />
              </div>
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
