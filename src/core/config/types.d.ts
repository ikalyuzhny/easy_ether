declare module 'react-native-bip39' {
  declare function mnemonicToSeedHex(mnemonic: string): string;
  declare function validateMnemonic(mnemonic: string): boolean;
}
