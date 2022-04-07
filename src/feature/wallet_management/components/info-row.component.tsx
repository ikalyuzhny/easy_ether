import React, {useCallback} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';

interface IInfoRow {
  title?: string;
  value?: string;
  loading?: boolean;

  copyToClipboard?: boolean;
  small?: boolean;
  secondary?: boolean;

  style?: StyleProp<ViewStyle>;
}

export const InfoRow: React.VFC<IInfoRow> = ({
  title,
  value,
  copyToClipboard,
  small = false,
  loading = false,
  secondary = false,
  style,
}) => {
  const {colors} = useTheme();

  const onRowPress = useCallback(() => {
    value && Clipboard.setString(value);
  }, [value]);

  const content = loading ? (
    <View style={[styles.indicator, small && styles.smallHeight]}>
      <ActivityIndicator size="small" color={colors.text} />
    </View>
  ) : (
    <>
      {title && (
        <View
          style={[
            styles.textWrapper,
            styles.titleWrapper,
            {
              borderColor: colors.border,
            },
            small && styles.smallHeight,
          ]}>
          <Text
            style={[
              styles.textBase,
              {color: colors.text},
              small && styles.smallTextBase,
            ]}>
            {title}
          </Text>
        </View>
      )}
      {value && (
        <View
          style={[
            styles.textWrapper,
            {
              backgroundColor: secondary ? colors.background : colors.primary,
            },
            small && styles.smallHeight,
          ]}>
          <Text
            numberOfLines={1}
            style={[
              styles.textBase,
              styles.valueText,
              {
                color: colors.text,
                textDecorationLine: copyToClipboard ? 'underline' : 'none',
              },
              small && styles.smallTextBase,
            ]}>
            {value}
          </Text>
        </View>
      )}
    </>
  );

  if (copyToClipboard) {
    return (
      <TouchableOpacity
        style={[styles.rowContainer, small && styles.smallHeight, style]}
        onPress={onRowPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.rowContainer, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  smallHeight: {
    height: 32,
  },
  rowContainer: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textWrapper: {
    height: 48,
    borderRadius: 24,

    paddingHorizontal: 12,
    maxWidth: '70%',
    marginHorizontal: 12,
  },
  titleWrapper: {
    borderWidth: 1,
  },
  textBase: {
    lineHeight: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  smallTextBase: {
    lineHeight: 32,
  },
  valueText: {
    fontWeight: 'bold',
  },
  indicator: {
    flex: 1,
    height: 48,
    alignItems: 'center',
  },
});
