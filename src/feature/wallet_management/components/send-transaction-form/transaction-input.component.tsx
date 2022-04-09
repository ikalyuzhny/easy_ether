import React, {useCallback} from 'react';
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';
import {LightAppPalette} from '@easyether/core/config/theme';
import {useTheme} from '@react-navigation/native';

interface ITransactionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  type?: KeyboardTypeOptions;
}

export const TransactionInput: React.VFC<ITransactionInputProps> = ({
  value,
  onChange,
  error,
  label,
  type,
}) => {
  const {colors} = useTheme();
  const handleChange = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      onChange(event.nativeEvent.text);
    },
    [onChange],
  );

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, {color: colors.text}]}>{label}</Text>
      )}
      <TextInput
        keyboardType={type}
        style={[
          styles.input,
          {
            borderColor: error ? LightAppPalette.ERROR : colors.border,
          },
        ]}
        value={value}
        onChange={handleChange}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 2,
    borderRadius: 24,
    width: '100%',
    padding: 10,
    fontSize: 14,
  },
  errorText: {
    color: LightAppPalette.ERROR,
    position: 'absolute',
    bottom: 0,
    left: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 4,
  },
});
