import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import walletSlice from '@easyether/core/redux/wallet/wallet.slice';
import walletAsyncActions from '@easyether/core/redux/wallet/wallet.actions';
import {RootState} from '@easyether/core/redux/store';

export const WalletManagementScreen: React.VFC = () => {
  const wallet = useSelector((state: RootState) => state.wallet);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(walletSlice.actions.getBalance());
    dispatch(walletAsyncActions.getTransactionsThunk(10));
  }, [dispatch]);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={[styles.title, {color: colors.text}]}>
          {t('common.appName')}
        </Text>
        <View style={styles.balanceRow}>
          <Text>
            {t('wallet.balance')}: {wallet.balance}
          </Text>
        </View>
        <View>
          {wallet.transactions.map(transaction => (
            <View key={transaction.hash}>
              <Text>{transaction.hash}</Text>
              <Text>{transaction.from}</Text>
              <Text>{transaction.to}</Text>
              <Text>{transaction.value}</Text>
            </View>
          ))}
        </View>
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});
