import EthereumRepository from '@easyether/core/repositories/ethereum.repository';
import bip39 from 'react-native-bip39';

jest.mock('react-native-bip39', () => ({
  validateMnemonic: jest.fn(),
  mnemonicToSeedHex: jest.fn(),
}));

jest.mock('bitcore-mnemonic', () =>
  jest.fn(() => ({
    toHDPrivateKey: jest.fn(() => ({
      derive: jest.fn(() => ({
        privateKey: {
          toBuffer: jest.fn(() => ({
            toString: jest.fn(() => '0x123'),
          })),
        },
      })),
    })),
  })),
);

/**
 * Test file for EthereumRepository
 */
describe('EthereumRepository', () => {
  const web3Mock = {
    eth: {
      getBalance: jest.fn(),
      sendSignedTransaction: jest.fn(),
      estimateGas: jest.fn(),
      accounts: {
        privateKeyToAccount: jest.fn(),
      },
    },
    utils: {
      fromWei: jest.fn(v => v),
      toWei: jest.fn(v => v),
    },
  };

  const axiosMock = {
    get: jest.fn(),
  };

  const account = {
    address: '0x123',
    privateKey: '0x123',
    signTransaction: jest.fn(),
  };

  let repository: EthereumRepository;

  beforeEach(() => {
    repository = new EthereumRepository(web3Mock as any, axiosMock as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return balance', async () => {
    const balance = '15';
    web3Mock.eth.getBalance.mockResolvedValue(balance);

    const result = await repository.getBalance('0x123');

    expect(result).toEqual('15');
    expect(web3Mock.eth.getBalance).toHaveBeenCalledWith('0x123');
    expect(web3Mock.utils.fromWei).toHaveBeenCalledWith(balance, 'ether');
  });

  it('should return account from private key', async () => {
    web3Mock.eth.accounts.privateKeyToAccount.mockResolvedValue(account);

    const result = await repository.getCredentialsByPrivateKey('0x123');

    expect(result).toEqual(account);
    expect(web3Mock.eth.accounts.privateKeyToAccount).toHaveBeenCalledWith(
      '0x123',
    );
  });

  it('should return account from seed phrase', async () => {
    web3Mock.eth.accounts.privateKeyToAccount.mockResolvedValue(account);
    (bip39.validateMnemonic as jest.Mock).mockResolvedValue(true);
    (bip39.mnemonicToSeedHex as jest.Mock).mockResolvedValue('0x123');

    const result = await repository.getCredentialsBySeedPhrase('seed phrase');

    expect(result).toEqual(account);
  });

  it('should return last transactions', async () => {
    const transactions = [
      {
        hash: '0x123',
        from: '0x123',
        to: '0x123',
        value: '0x123',
        gas: '0x123',
        gasPrice: '0x123',
        nonce: '0x123',
        input: '0x123',
        blockNumber: '0x123',
        blockHash: '0x123',
        timestamp: '0x123',
        transactionIndex: '0x123',
      },
    ];
    axiosMock.get.mockResolvedValue({data: transactions});

    const result = await repository.getLastTransactions('0x123', 10);

    expect(result).toEqual(transactions);
    expect(axiosMock.get).toHaveBeenCalledWith('api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: '0x123',
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: 'desc',
        apikey: 'ETHERSCAN_API_KEY',
      },
    });
  });

  it('should send transaction', async () => {
    const transactionConfig = {
      to: '0x124',
      value: '15',
    };

    web3Mock.eth.estimateGas.mockResolvedValue('15');
    account.signTransaction.mockResolvedValue({
      rawTransaction: '0x123',
      transactionHash: '0x123',
    });

    const result = await repository.sendTransaction(
      account as any,
      transactionConfig,
    );

    expect(result).toEqual('0x123');
    expect(web3Mock.eth.estimateGas).toHaveBeenCalledWith(transactionConfig);
    expect(account.signTransaction).toHaveBeenCalledWith({
      ...transactionConfig,
      gas: '15',
    });
    expect(web3Mock.eth.sendSignedTransaction).toHaveBeenCalledWith('0x123');
  });
});
