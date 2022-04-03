import React, {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import AppTheme from '@easyether/core/config/theme';
import AppNavigator from '@easyether/navigation/app.navigator';

const App: React.VFC = () => {
  const scheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer theme={AppTheme[scheme ?? 'light']}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
