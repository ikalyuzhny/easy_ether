import {EtherscanTransactionModel} from '@easyether/core/models/etherscan-transaction.model';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import di, {DI_TOKENS} from '@easyether/core/di';
import {IEthereumRepository} from '@easyether/core/repositories/types';
import bip39 from 'react-native-bip39';
import {t} from 'i18next';
import walletAsyncActions from '@easyether/core/redux/wallet/wallet.actions';

export interface IWalletSlice {
  accountKey?: string;

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
      if (bip39.validateMnemonic(action.payload)) {
        state.accountKey = bip39.mnemonicToSeedHex(action.payload);
      } else {
        state.accountKey = action.payload;
      }
    },
    getBalance: state => {
      if (!state.accountKey) {
        return;
      }

      const ethereumRepository = di.get<IEthereumRepository>(
        DI_TOKENS.EthereumRepository,
      );

      const account = ethereumRepository.getCredentialsByPrivateKey(
        state.accountKey,
      );

      if (!account) {
        state.balanceError = t('wallet.error.noAccount');
      }

      ethereumRepository
        .getBalance(account!.address)
        .then(balance => {
          state.balance = balance;
        })
        .catch(e => {
          state.balanceError = (e as Error).message;
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
