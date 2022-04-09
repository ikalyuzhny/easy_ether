import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

export const TransactionSendButton: React.FC<TouchableOpacityProps> = ({
  children,
  ...props
}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
});
