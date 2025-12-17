import type { ValueOf } from './utils';
import pools from '@/consts/supportedPools';

export type ETH_ADDRESS = `0x${string}`;

export type UNDERLYING_ADDRESSES = ValueOf<ValueOf<(typeof pools)>['ASSETS']>['UNDERLYING'];

export type A_TOKEN_ADDRESSES = ValueOf<ValueOf<(typeof pools)>['ASSETS']>['A_TOKEN'];
