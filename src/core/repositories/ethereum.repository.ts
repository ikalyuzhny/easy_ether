import {IEthereumRepository} from '@easyether/core/repositories/types';
import {Account, TransactionConfig} from 'web3-core';
import Web3 from 'web3';
import {AxiosInstance} from 'axios';
import bip39 from 'react-native-bip39';
import {EtherscanGetTransactionsResponse} from '@easyether/core/models/etherscan-transaction.model';

class EthereumRepository implements IEthereumRepository {
  constructor(
    private web3: Web3,
    private etherScanAxios: AxiosInstance,
    private emulatedTimeout: number = 0,
  ) {}

  private emulatedTimeoutPromise(): Promise<void> | void {
    if (this.emulatedTimeout) {
      return new Promise(resolve => setTimeout(resolve, this.emulatedTimeout));
    }
  }

  async getBalance(address: string): Promise<string> {
    const response = await this.web3.eth.getBalance(address);

    await this.emulatedTimeoutPromise();

    return this.web3.utils.fromWei(response, 'ether');
  }

  getCredentialsByPrivateKey(privateKey: string): Account {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey, true);
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
  ): Promise<EtherscanGetTransactionsResponse> {
    const {data} =
      await this.etherScanAxios.get<EtherscanGetTransactionsResponse>('api', {
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
      });

    await this.emulatedTimeoutPromise();

    return data;
  }

  async sendTransaction(
    account: Account,
    transaction: TransactionConfig,
  ): Promise<void> {
    await account.signTransaction(transaction);
    await this.emulatedTimeoutPromise();
  }
}

export default EthereumRepository;
