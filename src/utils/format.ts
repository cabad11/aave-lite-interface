import type { ETH_ADDRESS } from '@/types/addresses';

export const shorifyAddress = (fullAddress: ETH_ADDRESS | undefined) => fullAddress && `${fullAddress.slice(0, 6)}…${fullAddress.slice(-4)}`;

export const formatBalance = (balance: number | string | undefined) => {
  if (!balance) return null;
  const numberBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
  return numberBalance.toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 2 });
};
