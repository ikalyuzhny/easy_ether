import React from 'react';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {TransactionInput} from '@easyether/feature/wallet_management/components/send-transaction-form/transaction-input.component';
import {TransactionSendButton} from '@easyether/feature/wallet_management/components/send-transaction-form/transaction-send-button.component';
import {useTheme} from '@react-navigation/native';

export interface ISendTransactionForm {
  to: string;
  amount: string;
}

interface ISendTransactionView {
  onTransactionSend: (transaction: ISendTransactionForm) => void;
  isLoading?: boolean;
  balance?: string;
}

export const SendTransactionView: React.VFC<ISendTransactionView> = ({
  onTransactionSend,
  isLoading,
  balance,
}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {values, errors, handleChange, handleSubmit, resetForm} =
    useFormik<ISendTransactionForm>({
      onSubmit: transaction => {
        onTransactionSend({
          ...transaction,
          amount: transaction.amount.replace(',', '.'),
        });
        resetForm();
      },
      initialValues: {
        to: '',
        amount: '0',
      },
      validateOnChange: true,
      validate: ({to, amount}) => {
        const newErrors: Partial<ISendTransactionForm> = {};
        const parsedAmount = amount.replace(',', '.');

        if (to === '') {
          newErrors.to = t('common.required');
        }
        if (amount === '0') {
          newErrors.amount = t('common.required');
        }

        //Ethereum address validation
        if (to && to.length > 0 && !/^0x[0-9a-fA-F]{40}$/.test(to)) {
          newErrors.to = t('common.invalidAddress');
        }

        //Test float number validation
        if (!/^[0-9]*\.?[0-9]*$/.test(parsedAmount)) {
          newErrors.amount = t('common.invalidAmount');
        }

        if (parseFloat(parsedAmount) > parseFloat(balance!)) {
          newErrors.amount = t('common.invalidAmount');
        }

        return newErrors;
      },
    });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  return (
    <View style={styles.formContainer}>
      <TransactionInput
        label={t('wallet.sendTransaction.to')}
        value={values.to}
        error={errors.to}
        onChange={handleChange('to')}
      />
      <TransactionInput
        label={t('wallet.sendTransaction.amount')}
        value={values.amount}
        error={errors.amount}
        onChange={handleChange('amount')}
        type="numeric"
      />
      <TransactionSendButton onPress={handleSubmit}>
        <Text>{t('wallet.sendTransaction.send')}</Text>
      </TransactionSendButton>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
