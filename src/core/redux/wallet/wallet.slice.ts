import {Account} from 'web3-core';
import {EtherscanTransactionModel} from '@easyether/core/models/etherscan-transaction.model';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import di, {DI_TOKENS} from '@easyether/core/di';
import {IEthereumRepository} from '@easyether/core/repositories/types';
import bip39 from 'react-native-bip39';
import {t} from 'i18next';
import walletAsyncActions from '@easyether/core/redux/wallet/wallet.actions';

export interface IWalletSlice {
  account?: Account;

  isTransactionsLoading: boolean;
  transactions: EtherscanTransactionModel[];
  transactionsError?: string;

  balance?: string;
  balanceError?: string;
}

const initialState: IWalletSlice = {
  isTransactionsLoading: true,
  transactions: [],
};

const walletSlice = createSlice({
  name: 'wallet-slice',
  initialState,
  reducers: {
    getAccount: (state, action: PayloadAction<string>) => {
      const ethereumRepository = di.get<IEthereumRepository>(
        DI_TOKENS.EthereumRepository,
      );

      if (bip39.validateMnemonic(action.payload)) {
        state.account = ethereumRepository.getCredentialsBySeedPhrase(
          action.payload,
        );
      } else {
        state.account = ethereumRepository.getCredentialsByPrivateKey(
          action.payload,
        );
      }
    },
    getBalance: state => {
      const account = state.account;

      if (!account) {
        state.balanceError = t('wallet.error.noAccount');
      }

      const ethereumRepository = di.get<IEthereumRepository>(
        DI_TOKENS.EthereumRepository,
      );

      ethereumRepository.getBalance(account!.address).then(balance => {
        state.balance = balance;
      });
    },
  },
  extraReducers: builder => {
    builder.addCase(walletAsyncActions.getTransactionsThunk.pending, state => {
      state.isTransactionsLoading = true;
    });
    builder.addCase(
      walletAsyncActions.getTransactionsThunk.fulfilled,
      (state, action) => {
        state.transactions = action.payload;
      },
    );
    builder.addCase(
      walletAsyncActions.getTransactionsThunk.rejected,
      (state, action) => {
        state.transactionsError = action.payload as string;
      },
    );
  },
});

export default walletSlice;
