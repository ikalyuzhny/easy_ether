import {EtherscanTransactionModel} from '@easyether/core/models/etherscan-transaction.model';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import bip39 from 'react-native-bip39';
import walletAsyncActions from '@easyether/core/redux/wallet/wallet.actions';

export interface IWalletSlice {
  accountKey?: string;

  isTransactionsLoading: boolean;
  transactions: EtherscanTransactionModel[];
  transactionsError?: string;

  isBalanceLoading: boolean;
  balance?: string;
  balanceError?: string;
}

const initialState: IWalletSlice = {
  isTransactionsLoading: true,
  transactions: [],
  isBalanceLoading: true,
};

const walletSlice = createSlice({
  name: 'wallet-slice',
  initialState,
  reducers: {
    setAccountKey: (state, action: PayloadAction<string>) => {
      if (bip39.validateMnemonic(action.payload)) {
        state.accountKey = bip39.mnemonicToSeedHex(action.payload);
      } else {
        state.accountKey = action.payload;
      }
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

    builder.addCase(walletAsyncActions.getBalanceThunk.pending, state => {
      state.balanceError = undefined;
      state.isBalanceLoading = true;
    });
    builder.addCase(
      walletAsyncActions.getBalanceThunk.fulfilled,
      (state, action) => {
        state.balance = action.payload;
      },
    );
    builder.addCase(
      walletAsyncActions.getBalanceThunk.rejected,
      (state, action) => {
        state.balanceError = action.payload as string;
      },
    );
  },
});

export default walletSlice;
