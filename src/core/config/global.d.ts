declare module '@remobile/react-native-clip-rect' {
  import React from 'react';
  import {StyleProp, ViewStyle} from 'react-native';

  declare interface ClipRectProps {
    style: StyleProp<ViewStyle>;
  }

  const ClipRect: React.FC<ClipRectProps>;

  export = ClipRect;
}
