import {ITransaction} from './transaction.interface';

export interface IAccountManagerInterface {
  getBalance(address: string): Promise<number>;

  getLastTransactions(address: string, limit: number): Promise<ITransaction[]>;
}
