import React, {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';

import AppTheme from '@easyether/core/config/theme';
import AppNavigator from '@easyether/navigation/app.navigator';
import {store} from '@easyether/core/redux/store';

const App: React.VFC = () => {
  const scheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer theme={AppTheme[scheme ?? 'light']}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
