import {createAsyncThunk} from '@reduxjs/toolkit';
import di, {DI_TOKENS} from '@easyether/core/di';
import {IEthereumRepository} from '@easyether/core/repositories/types';
import {t} from 'i18next';
import {RootState} from '@easyether/core/redux/store';

const getTransactionsThunk = createAsyncThunk(
  'wallet/getTransaction',
  async (limit: number = 10, thunkAPI) => {
    const {
      wallet: {accountKey},
    } = thunkAPI.getState() as RootState;

    if (!accountKey) {
      return thunkAPI.rejectWithValue(t('wallet.noAccountError'));
    }

    const ethereumRepository = di.get<IEthereumRepository>(
      DI_TOKENS.EthereumRepository,
    );

    const account = ethereumRepository.getCredentialsByPrivateKey(accountKey);

    try {
      const response = await ethereumRepository.getLastTransactions(
        account.address,
        limit,
      );

      if (response.status === '1') {
        return response.result;
      }

      throw new Error(response.message);
    } catch (e) {
      return thunkAPI.rejectWithValue(t('wallet.unknownError'));
    }
  },
);

const getBalanceThunk = createAsyncThunk(
  'wallet/getBalance',
  async (_, thunkAPI) => {
    const {
      wallet: {accountKey},
    } = thunkAPI.getState() as RootState;

    if (!accountKey) {
      return thunkAPI.rejectWithValue(t('wallet.noAccountError'));
    }

    const ethereumRepository = di.get<IEthereumRepository>(
      DI_TOKENS.EthereumRepository,
    );

    const account = ethereumRepository.getCredentialsByPrivateKey(accountKey);

    try {
      return await ethereumRepository.getBalance(account.address);
    } catch (e) {
      return thunkAPI.rejectWithValue(t('wallet.unknownError'));
    }
  },
);

const walletAsyncActions = {
  getTransactionsThunk,
  getBalanceThunk,
};

export default walletAsyncActions;
