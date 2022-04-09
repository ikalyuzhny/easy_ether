import React, {useMemo} from 'react';
import {
  EtherscanTransactionModel,
  TransactionStatus,
} from '@easyether/core/models/etherscan-transaction.model';
import {StyleSheet, View} from 'react-native';
import {InfoRow} from '@easyether/feature/wallet_management/components/info-row.component';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import di, {DI_TOKENS} from '@easyether/core/di';
import Web3 from 'web3';
import {LightAppPalette} from '@easyether/core/config/theme';

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

  const statusColor = useMemo<string>(() => {
    switch (transaction.status) {
      case TransactionStatus.SUCCESSFUL:
        return LightAppPalette.PRIMARY;
      case TransactionStatus.PENDING:
        return LightAppPalette.PENDING;
      default:
        return LightAppPalette.ERROR;
    }
  }, [transaction.status]);

  return (
    <View style={[styles.container]}>
      <View style={[styles.block, {backgroundColor: colors.card}]}>
        <View
          style={[styles.statusIndicator, {backgroundColor: statusColor}]}
        />
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
          value={di
            .get<Web3>(DI_TOKENS.Web3Eth)
            .utils.fromWei(transaction.value, 'ether')}
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
  statusIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    height: 20,
    width: 20,
    borderRadius: 10,
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
