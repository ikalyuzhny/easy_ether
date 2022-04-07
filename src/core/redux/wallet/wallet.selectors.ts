import {RootState} from '@easyether/core/redux/store';

export const getAccountKey = (state: RootState) => state.wallet.accountKey;

export const getTransactionGettingError = (state: RootState) =>
  state.wallet.transactionsError;
export const getTransactions = (state: RootState) => state.wallet.transactions;

export const getBalance = (state: RootState) => state.wallet.balance;
export const getBalanceGettingError = (state: RootState) =>
  state.wallet.balanceError;
