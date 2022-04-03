import {Theme} from '@react-navigation/native';

interface IAppTheme {
  dark: Theme;
  light: Theme;
}

export enum LightAppPalette {
  PRIMARY = '#BFCC94',
  BACKGROUND = '#F0F4EF',
  CARD = '#FFFFFF',
  TEXT = '#0D1821',
  BORDER = '#BDCA91',
  SECONDARY = '#344966',
}

export enum DarkAppPalette {
  PRIMARY = '#BFCC94',
  BACKGROUND = '#0D1821',
  CARD = '#344966',
  TEXT = '#F0F4EF',
  BORDER = '#BDCA91',
  SECONDARY = '#344966',
}

const AppTheme: IAppTheme = {
  dark: {
    dark: true,
    colors: {
      primary: DarkAppPalette.PRIMARY,
      background: DarkAppPalette.BACKGROUND,
      card: DarkAppPalette.CARD,
      text: DarkAppPalette.TEXT,
      border: DarkAppPalette.BORDER,
      notification: DarkAppPalette.SECONDARY
    },
  },
  light: {
    dark: false,
    colors: {
      primary: LightAppPalette.PRIMARY,
      background: LightAppPalette.BACKGROUND,
      card: LightAppPalette.CARD,
      text: LightAppPalette.TEXT,
      border: LightAppPalette.BORDER,
      notification: LightAppPalette.SECONDARY
    },
  },
};

export default AppTheme;
