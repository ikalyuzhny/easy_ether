
export interface ITransactionsManager {
  sendTransaction(transaction: any): Promise<any>;
}
