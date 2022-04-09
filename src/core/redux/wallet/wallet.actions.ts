import {createAsyncThunk} from '@reduxjs/toolkit';
import di, {DI_TOKENS} from '@easyether/core/di';
import {IEthereumRepository} from '@easyether/core/repositories/types';
import {t} from 'i18next';
import {RootState} from '@easyether/core/redux/store';
import {ISendTransactionForm} from '@easyether/feature/wallet_management/components/send-transaction-form/send-transaction-view.component';
import Web3 from 'web3';
import {TransactionStatus} from '@easyether/core/models/etherscan-transaction.model';

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
        return response.result.map(tx => ({
          ...tx,
          status:
            tx.txreceipt_status === '1'
              ? TransactionStatus.SUCCESSFUL
              : TransactionStatus.ERROR,
        }));
      }

      throw new Error(response.message);
    } catch (error) {
      console.log(error);
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

const sendTransactionThunk = createAsyncThunk(
  'wallet/sendTransaction',
  async (payload: ISendTransactionForm, thunkAPI) => {
    const {
      wallet: {accountKey},
    } = thunkAPI.getState() as RootState;

    if (!accountKey) {
      return thunkAPI.rejectWithValue(t('wallet.noAccountError'));
    }

    const ethereumRepository = di.get<IEthereumRepository>(
      DI_TOKENS.EthereumRepository,
    );
    const web3 = di.get<Web3>(DI_TOKENS.Web3Eth);

    const account = ethereumRepository.getCredentialsByPrivateKey(accountKey);

    try {
      const transactionHash = await ethereumRepository.sendTransaction(
        account,
        {
          from: account.address,
          to: payload.to,
          value: payload.amount,
        },
      );

      thunkAPI.dispatch(getBalanceThunk());

      return {
        hash: transactionHash,
        from: account.address,
        to: payload.to,
        value: web3.utils.toWei(payload.amount, 'ether'),
        status: TransactionStatus.PENDING,
      };
    } catch (e) {
      console.error('Error while sending tx: ', e);
      return thunkAPI.rejectWithValue(t('wallet.unknownError'));
    }
  },
);

const walletAsyncActions = {
  getTransactionsThunk,
  getBalanceThunk,
  sendTransactionThunk,
};

export default walletAsyncActions;
