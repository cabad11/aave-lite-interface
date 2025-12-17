import { config as wagmiConfig } from '@/consts/wagmiConfig';
import type { UseChainIdReturnType } from 'wagmi';

export type SUPPORTED_CHAINS = UseChainIdReturnType<typeof wagmiConfig>;
