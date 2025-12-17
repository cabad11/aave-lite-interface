import tokenList from '@bgd-labs/aave-address-book/tokenlist';
import type { SUPPORTED_SYMBOLS } from '@/types/symbols';

const getTokenData = (token: { symbol: SUPPORTED_SYMBOLS }) => {
  const tokenData = tokenList.tokens.find(listToken => listToken.symbol === token.symbol)!;
  return {
    name: tokenData.name,
    logoURI: tokenData.logoURI,
  };
};
export default getTokenData;
