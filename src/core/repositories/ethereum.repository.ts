import {IEthereumRepository} from '@easyether/core/repositories/types';
import {Account, TransactionConfig} from 'web3-core';
import Web3 from 'web3';
import {AxiosInstance} from 'axios';
import bip39 from 'react-native-bip39';
import Mnemonic from 'bitcore-mnemonic';
import {EtherscanGetTransactionsResponse} from '@easyether/core/models/etherscan-transaction.model';
import Config from 'react-native-config';

class EthereumRepository implements IEthereumRepository {
  constructor(private web3: Web3, private etherScanAxios: AxiosInstance) {}

  async getBalance(address: string): Promise<string> {
    const response = await this.web3.eth.getBalance(address);

    return this.web3.utils.fromWei(response, 'ether');
  }

  getCredentialsByPrivateKey(privateKey: string): Account {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }

  getCredentialsBySeedPhrase(seedPhrase: string): Account {
    if (!bip39.validateMnemonic(seedPhrase)) {
      throw new Error('Invalid seed phrase');
    }

    const mnemonic = new Mnemonic(seedPhrase);
    const derived = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0");
    const key = derived.privateKey.toBuffer().toString('hex');

    return this.getCredentialsByPrivateKey(bip39.mnemonicToSeedHex(key));
  }

  async getLastTransactions(
    address: string,
    limit: number,
  ): Promise<EtherscanGetTransactionsResponse> {
    const {ETHERSCAN_API_KEY} = Config;

    const {data} =
      await this.etherScanAxios.get<EtherscanGetTransactionsResponse>('api', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: limit,
          sort: 'desc',
          apikey: ETHERSCAN_API_KEY,
        },
      });

    return data;
  }

  async sendTransaction(
    account: Account,
    transaction: TransactionConfig,
  ): Promise<string> {
    const value = this.web3.utils.toWei(transaction.value as string, 'ether');

    const fixedTransaction = {
      ...transaction,
      value,
    };

    const gas = await this.web3.eth.estimateGas(fixedTransaction);
    const signedTransaction = await account.signTransaction({
      ...fixedTransaction,
      gas,
    });

    this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction!);

    return signedTransaction.transactionHash!;
  }
}

export default EthereumRepository;
