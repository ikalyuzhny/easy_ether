import {EtherscanTransactionModel} from '@easyether/core/models/etherscan-transaction.model';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import bip39 from 'react-native-bip39';
import walletAsyncActions from '@easyether/core/redux/wallet/wallet.actions';

/**
 * I decided to create only one slice just to save time
 * In the other case - it's better to split the slice onto three parts
 */
export interface IWalletSlice {
  accountKey?: string;

  isTransactionsLoading: boolean;
  transactions: EtherscanTransactionModel[];
  transactionsError?: string;

  isBalanceLoading: boolean;
  balance?: string;
  balanceError?: string;

  isTransactionSending: boolean;
}

const initialState: IWalletSlice = {
  isTransactionsLoading: true,
  transactions: [],
  isBalanceLoading: true,
  isTransactionSending: false,
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
        state.isTransactionsLoading = false;
      },
    );
    builder.addCase(
      walletAsyncActions.getTransactionsThunk.rejected,
      (state, action) => {
        state.transactionsError = action.payload as string;
        state.isTransactionsLoading = false;
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
        state.isBalanceLoading = false;
      },
    );
    builder.addCase(
      walletAsyncActions.getBalanceThunk.rejected,
      (state, action) => {
        state.balanceError = action.payload as string;
        state.isBalanceLoading = false;
      },
    );

    builder.addCase(walletAsyncActions.sendTransactionThunk.pending, state => {
      state.isTransactionSending = true;
    });
    builder.addCase(
      walletAsyncActions.sendTransactionThunk.fulfilled,
      (state, action) => {
        state.isTransactionSending = false;

        if (state.transactions.length === 10) {
          state.transactions.pop();
        }
        state.transactions = [
          action.payload as EtherscanTransactionModel,
          ...state.transactions,
        ];
      },
    );
    builder.addCase(walletAsyncActions.sendTransactionThunk.rejected, state => {
      state.isTransactionSending = false;
    });
  },
});

export default walletSlice;
