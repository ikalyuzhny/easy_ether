import {IEthereumRepository} from '@easyether/core/repositories/types';
import {Account, TransactionConfig} from 'web3-core';
import {Eth} from 'web3-eth';
import {AxiosInstance} from 'axios';
import bip39 from 'react-native-bip39';
import {EtherscanTransactionModel} from '@easyether/core/models/etherscan-transaction.model';

class EthereumRepository implements IEthereumRepository {
  constructor(private eth: Eth, private etherScanAxios: AxiosInstance) {}

  getBalance(address: string): Promise<string> {
    return this.eth.getBalance(address);
  }

  getCredentialsByPrivateKey(privateKey: string): Account {
    return this.eth.accounts.privateKeyToAccount(privateKey);
  }

  getCredentialsBySeedPhrase(seedPhrase: string): Account {
    if (!bip39.validateMnemonic(seedPhrase)) {
      throw new Error('Invalid seed phrase');
    }

    return this.getCredentialsByPrivateKey(bip39.mnemonicToSeedHex(seedPhrase));
  }

  async getLastTransactions(
    address: string,
    limit: number,
  ): Promise<EtherscanTransactionModel[]> {
    const response = await this.etherScanAxios.get<EtherscanTransactionModel[]>(
      'api',
      {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 9999999,
          sort: 'desc',
          page: 1,
          offset: limit,
        },
      },
    );

    return response.data;
  }

  async sendTransaction(
    account: Account,
    transaction: TransactionConfig,
  ): Promise<void> {
    await account.signTransaction(transaction);
  }
}

export default EthereumRepository;
