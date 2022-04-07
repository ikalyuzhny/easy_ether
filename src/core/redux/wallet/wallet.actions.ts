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
      return thunkAPI.rejectWithValue(t('wallet.error.noAccount'));
    }

    const ethereumRepository = di.get<IEthereumRepository>(
      DI_TOKENS.EthereumRepository,
    );

    const account = ethereumRepository.getCredentialsByPrivateKey(accountKey);

    try {
      return ethereumRepository.getLastTransactions(account.address, limit);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e instanceof Error ? e.message : t('wallet.error.unknown'),
      );
    }
  },
);

const walletAsyncActions = {
  getTransactionsThunk,
};

export default walletAsyncActions;
