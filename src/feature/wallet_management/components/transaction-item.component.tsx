import React from 'react';
import {EtherscanTransactionModel} from '@easyether/core/models/etherscan-transaction.model';
import {StyleSheet, View} from 'react-native';
import {InfoRow} from '@easyether/feature/wallet_management/components/info-row.component';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';

interface ITransactionItemProps {
  transaction: EtherscanTransactionModel;
  index: number;
  isLast?: boolean;
}

export const TransactionItem: React.VFC<ITransactionItemProps> = ({
  transaction,
  index,
  isLast,
}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <View style={[styles.container]}>
      <View style={[styles.block, {backgroundColor: colors.card}]}>
        <InfoRow value={t('wallet.transaction.index', {index: index + 1})} />
        <InfoRow
          style={styles.firstRow}
          small
          secondary
          copyToClipboard
          title={t('wallet.transaction.hash')}
          value={transaction.hash}
        />
        <InfoRow
          style={styles.row}
          small
          secondary
          copyToClipboard
          title={t('wallet.transaction.from')}
          value={transaction.from}
        />
        <InfoRow
          style={styles.row}
          small
          secondary
          copyToClipboard
          title={t('wallet.transaction.to')}
          value={transaction.to}
        />
        <InfoRow
          style={styles.row}
          small
          secondary
          title={t('wallet.transaction.value')}
          value={transaction.value}
        />
      </View>
      {!isLast && (
        <View style={[styles.chainer, {backgroundColor: colors.card}]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  block: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
  },
  index: {
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 15,
    fontSize: 16,
  },
  row: {
    marginTop: 8,
  },
  firstRow: {
    marginTop: 20,
  },
  chainer: {
    width: 5,
    height: 30,
  },
});
