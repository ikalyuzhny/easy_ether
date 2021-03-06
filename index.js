/**
 * @format
 */

import 'react-native-reanimated';
import '@easyether/core/config/i18n.ts';
import './shim';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import App from '@easyether/App';
import {initDI} from '@easyether/core/di';

initDI();

AppRegistry.registerComponent(appName, () => App);
