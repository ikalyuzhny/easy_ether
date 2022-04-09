jest.mock('react-native-randombytes', () => ({
  randomBytes: jest.fn(l => {
    let uint8 = new Uint8Array(l);
    uint8 = uint8.map(() => Math.floor(Math.random() * 90) + 10);
    return uint8;
  }),
}));

jest.mock('react-native-config', () => ({
  ETHERSCAN_API_KEY: 'ETHERSCAN_API_KEY',
}));
