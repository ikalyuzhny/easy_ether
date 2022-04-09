import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import walletAsyncActions from '@easyether/core/redux/wallet/wallet.actions';
import {
  getAccount,
  getBalance,
  getBalanceGettingError,
  getBalanceLoading,
  getIsTranslationSending,
  getTransactionGettingError,
  getTransactions,
  getTransactionsLoading,
} from '@easyether/core/redux/wallet/wallet.selectors';
import {TitleLogo} from '@easyether/feature/wallet_management/components/title-logo.component';
import {InfoRow} from '@easyether/feature/wallet_management/components/info-row.component';
import {TransactionsView} from '@easyether/feature/wallet_management/components/transactions-view.component';
import {
  ISendTransactionForm,
  SendTransactionView,
} from '@easyether/feature/wallet_management/components/send-transaction-form/send-transaction-view.component';

export const WalletManagementScreen: React.VFC = () => {
  const account = useSelector(getAccount);

  const transactions = useSelector(getTransactions);
  const isTransactionsLoading = useSelector(getTransactionsLoading);
  const transactionsError = useSelector(getTransactionGettingError);

  const balance = useSelector(getBalance);
  const isBalanceLoading = useSelector(getBalanceLoading);
  const balanceError = useSelector(getBalanceGettingError);

  const isTransactionSending = useSelector(getIsTranslationSending);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const [isRefreshingManually, setIsRefreshingManually] = useState(false);

  const onScreenInit = useCallback(() => {
    setIsRefreshingManually(true);

    Promise.all([
      dispatch(walletAsyncActions.getBalanceThunk()),
      dispatch(walletAsyncActions.getTransactionsThunk(10)),
    ]).then(() => {
      setIsRefreshingManually(false);
    });
  }, [dispatch]);

  useEffect(() => {
    onScreenInit();
  }, [onScreenInit]);

  const onTransactionSend = useCallback(
    (values: ISendTransactionForm) => {
      dispatch(walletAsyncActions.sendTransactionThunk(values));
    },
    [dispatch],
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={
                isRefreshingManually &&
                (isBalanceLoading || isTransactionsLoading)
              }
              onRefresh={onScreenInit}
            />
          }>
          <TitleLogo title={t('common.appName')} />
          <InfoRow
            style={styles.firstRow}
            copyToClipboard
            title={
              !account ? t('wallet.noAccountError') : t('wallet.accountTitle')
            }
            value={account ? account.address : undefined}
          />
          <InfoRow
            style={styles.infoRow}
            loading={isBalanceLoading}
            title={
              balanceError
                ? t('wallet.balanceGettingError')
                : t('wallet.balance.title')
            }
            value={balance ? t('wallet.balance.value', {balance}) : undefined}
          />
          <Text style={[styles.transactionsTitle, {color: colors.text}]}>
            {t('wallet.sendTransaction.title')}
          </Text>
          <SendTransactionView
            onTransactionSend={onTransactionSend}
            balance={balance}
            isLoading={!account || isBalanceLoading || isTransactionSending}
          />
          <Text style={[styles.transactionsTitle, {color: colors.text}]}>
            {t('wallet.transaction.title')}
          </Text>
          <TransactionsView
            transactions={transactions}
            transactionsLoading={isTransactionsLoading}
            transactionsError={transactionsError}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
  },
  infoRow: {
    marginTop: 16,
  },
  firstRow: {
    marginTop: 36,
  },
  transactionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});
