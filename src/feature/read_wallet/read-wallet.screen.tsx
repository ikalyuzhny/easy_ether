import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Barcode, BarcodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import {runOnJS} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';

import walletSlice from '@easyether/core/redux/wallet/wallet.slice';
import {NavigationRoutes} from '@easyether/navigation/navigation.routes';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '@easyether/navigation/app.navigator';
import {getAccountKey} from '@easyether/core/redux/wallet/wallet.selectors';
import di, {DI_TOKENS} from '@easyether/core/di';
import {IEthereumRepository} from '@easyether/core/repositories/types';

export const ReadWalletScreen: React.VFC<
  NativeStackScreenProps<AppStackParamList>
> = ({navigation}) => {
  const devices = useCameraDevices();
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const accountKey = useSelector(getAccountKey);

  const [isCodeScanning, setIsCodeScanning] = useState<boolean>(false);

  const onErrorDismissed = useCallback(() => {
    setIsCodeScanning(false);
  }, []);

  useEffect(() => {
    if (!accountKey) {
      return;
    }

    const ethereumRepository = di.get<IEthereumRepository>(
      DI_TOKENS.EthereumRepository,
    );

    try {
      ethereumRepository.getCredentialsByPrivateKey(accountKey);
      navigation.navigate(NavigationRoutes.WALLET_MANAGEMENT_SCREEN);
    } catch (e) {
      Alert.alert(
        e instanceof Error ? e.message : t('error'),
        undefined,
        [
          {
            text: 'OK',
            onPress: onErrorDismissed,
          },
        ],
        {
          onDismiss: onErrorDismissed,
        },
      );
    }
  }, [accountKey, navigation, onErrorDismissed, t]);

  const onQRCodeDetected = useCallback(
    (qrCode: Barcode) => {
      if (isCodeScanning) {
        return;
      }

      setIsCodeScanning(true);
      dispatch(walletSlice.actions.getAccount(qrCode.content.data as string));
    },
    [dispatch, isCodeScanning],
  );

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const qrCodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
      if (qrCodes.length > 0) {
        runOnJS(onQRCodeDetected)(qrCodes[0]);
      }
    },
    [onQRCodeDetected],
  );

  return (
    <View style={styles.container}>
      {devices.back ? (
        <Camera
          device={devices.back}
          style={StyleSheet.absoluteFill}
          isActive={isFocused && !isCodeScanning}
          frameProcessor={frameProcessor}
        />
      ) : (
        <ActivityIndicator />
      )}
      <View
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: colors.primary, opacity: 0.2},
        ]}>
        <SafeAreaView style={styles.infoBlock}>
          <Text style={[styles.title, {color: colors.text}]}>
            {t('common.appName')}
          </Text>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoBlock: {
    flex: 1,
    marginTop: 100,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
  clipBlock: {
    width: 200,
    height: 200,
    borderRadius: 25,
    color: 'rgba(0, 0, 0, 0.5)',
  },
});
