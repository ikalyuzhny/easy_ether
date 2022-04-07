import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationRoutes} from './navigation.routes';
import {ReadWalletScreen} from '@easyether/feature/read_wallet/read-wallet.screen';
import {WalletManagementScreen} from '@easyether/feature/wallet_management/wallet-management.screen';

const Stack = createNativeStackNavigator();

const AppNavigator: React.VFC = () => {
    useEffect(() => {
        console.log('NAVIGATOR MOUNTED');
    }, []);
  return (
    <Stack.Navigator initialRouteName={NavigationRoutes.READ_WALLET_SCREEN}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
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
