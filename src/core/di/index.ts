import {Container} from 'inversify';
import axios, {AxiosInstance} from 'axios';
import Config from 'react-native-config';
import Web3 from 'web3';
import {IEthereumRepository} from '@easyether/core/repositories/types';
import EthereumRepository from '@easyether/core/repositories/ethereum.repository';

export const DI_TOKENS = {
  EtherscanAxios: Symbol('EtherscanAxios'),
  Web3Eth: Symbol('Web3Eth'),
  EthereumRepository: Symbol('EthereumRepository'),
};

const di = new Container();

export async function initDI() {
  //External
  di.bind<AxiosInstance>(DI_TOKENS.EtherscanAxios).toConstantValue(
    axios.create({
      baseURL: Config.ETHERSCAN_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
  di.bind<Web3>(DI_TOKENS.Web3Eth).toConstantValue(
    await new Web3(new Web3.providers.HttpProvider(Config.ETHEREUM_PROVIDER)),
  );

  //Repository
  di.bind<IEthereumRepository>(DI_TOKENS.EthereumRepository).toConstantValue(
    new EthereumRepository(
      di.get(DI_TOKENS.Web3Eth),
      di.get(DI_TOKENS.EtherscanAxios),
    ),
  );
}

export function destroyDI() {
  di.unbindAll();
}

export default di;
