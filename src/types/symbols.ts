import type { KeysOfUnion, ValueOf } from './utils';
import pools from '@/consts/supportedPools';

export type SUPPORTED_SYMBOLS = KeysOfUnion<ValueOf<(typeof pools)>['ASSETS']>;
