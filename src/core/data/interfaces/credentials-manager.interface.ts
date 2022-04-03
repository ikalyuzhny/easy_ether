export interface ICredentialsManagerInterface {
  getCredentialsFromPrivateKey(privateKey: string): Promise<any>;

  getCredentialsFromSeedPhrase(seedPhrase: string): Promise<any>;
}
