import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationRoutes} from './navigation.routes';
import {ReadWalletScreen} from '@easyether/feature/read_wallet/read-wallet.screen';
import {WalletManagementScreen} from '@easyether/feature/wallet_management/wallet-management.screen';

export type AppStackParamList = {
  [NavigationRoutes.READ_WALLET_SCREEN]: undefined;
  [NavigationRoutes.WALLET_MANAGEMENT_SCREEN]: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator: React.VFC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={NavigationRoutes.READ_WALLET_SCREEN}>
      <Stack.Screen
        name={NavigationRoutes.READ_WALLET_SCREEN}
        component={ReadWalletScreen}
      />
      <Stack.Screen
        name={NavigationRoutes.WALLET_MANAGEMENT_SCREEN}
        component={WalletManagementScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
