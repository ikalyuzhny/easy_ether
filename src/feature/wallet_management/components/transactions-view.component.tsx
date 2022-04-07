import React, {useCallback} from 'react';
import {EtherscanTransactionModel} from '@easyether/core/models/etherscan-transaction.model';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {TransactionItem} from '@easyether/feature/wallet_management/components/transaction-item.component';

interface ITransactionsViewProps {
  transactions: EtherscanTransactionModel[];
  transactionsLoading?: boolean;
  transactionsError?: string;
}

export const TransactionsView: React.VFC<ITransactionsViewProps> = ({
  transactions,
  transactionsError,
  transactionsLoading = false,
}) => {
  const {colors} = useTheme();

  const keyExtractor = useCallback(
    (item: EtherscanTransactionModel) => item.hash,
    [],
  );

  if (transactionsLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (transactionsError) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          {backgroundColor: colors.card},
        ]}>
        <Text style={{color: colors.text}}>{transactionsError}</Text>
      </View>
    );
  }

  /**
   * Flatlist isn't used because we show only last 10 transactions (small list)
   * and because the component is inside a scrollview
   */
  return (
    <View style={styles.container}>
      {transactions.map((transaction, index) => (
        <TransactionItem
          transaction={transaction}
          index={index}
          key={keyExtractor(transaction)}
          isLast={index === transactions.length - 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    marginTop: 10,
  },
});
