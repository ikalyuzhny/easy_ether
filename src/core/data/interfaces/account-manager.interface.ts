import {ITransaction} from '@easyether/core/data/models/transaction.model';

export interface IAccountManagerInterface {
  getBalance(address: string): Promise<number>;

  getLastTransactions(address: string, limit: number): Promise<ITransaction[]>;
}
