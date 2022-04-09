export interface EtherscanGetTransactionsResponse {
  status: string;
  message: string;
  result: EtherscanTransactionModel[];
}

export enum TransactionStatus {
  ERROR = 0,
  SUCCESSFUL = 1,
  PENDING = 2,
}

export interface EtherscanTransactionModel {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  status?: TransactionStatus;
}
