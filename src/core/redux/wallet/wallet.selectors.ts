import {RootState} from '@easyether/core/redux/store';
import di, {DI_TOKENS} from '@easyether/core/di';
import {IEthereumRepository} from '@easyether/core/repositories/types';

export const getAccountKey = (state: RootState) => state.wallet.accountKey;
export const getAccount = (state: RootState) => {
  const accountKey = state.wallet.accountKey;
  if (!accountKey) {
    return;
  }

  const ethereumRepository = di.get<IEthereumRepository>(
    DI_TOKENS.EthereumRepository,
  );

  return ethereumRepository.getCredentialsByPrivateKey(accountKey);
};

export const getTransactionGettingError = (state: RootState) =>
  state.wallet.transactionsError;
export const getTransactionsLoading = (state: RootState) =>
  state.wallet.isTransactionsLoading;
export const getTransactions = (state: RootState) => state.wallet.transactions;

export const getBalance = (state: RootState) => state.wallet.balance;
export const getBalanceGettingError = (state: RootState) =>
  state.wallet.balanceError;
export const getBalanceLoading = (state: RootState) =>
  state.wallet.isBalanceLoading;

export const getIsTranslationSending = (state: RootState) =>
  state.wallet.isTransactionSending;
