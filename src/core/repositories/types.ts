import {Account, TransactionConfig} from 'web3-core';
import {EtherscanGetTransactionsResponse} from '@easyether/core/models/etherscan-transaction.model';

export interface IEthereumRepository {
  getCredentialsByPrivateKey(privateKey: string): Account;
  getCredentialsBySeedPhrase(seedPhrase: string): Account;

  getBalance(address: string): Promise<string>;
  getLastTransactions(
    address: string,
    limit: number,
  ): Promise<EtherscanGetTransactionsResponse>;

  sendTransaction(
    account: Account,
    transaction: TransactionConfig,
  ): Promise<void>;
}
