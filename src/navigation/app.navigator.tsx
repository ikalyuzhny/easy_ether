import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationRoutes} from './navigation.routes';
import {View} from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator: React.VFC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NavigationRoutes.READ_WALLET_SCREEN}
        component={View}
      />
      <Stack.Screen
        name={NavigationRoutes.WALLET_MANAGEMENT_SCREEN}
        component={View}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
