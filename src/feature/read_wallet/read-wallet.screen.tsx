import React, {useCallback} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Barcode, BarcodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import 'react-native-reanimated';
import {runOnJS} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';

import walletSlice from '@easyether/core/redux/wallet/wallet.slice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationRoutes} from '@easyether/navigation/navigation.routes';

export const ReadWalletScreen: React.VFC<NativeStackScreenProps<{}>> = ({
  navigation,
}) => {
  const devices = useCameraDevices();
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const onQRCodeDetected = useCallback(
    (qrCode: Barcode) => {
      dispatch(walletSlice.actions.getAccount(qrCode.content.data as string));
      navigation.navigate({
        key: NavigationRoutes.WALLET_MANAGEMENT_SCREEN,
      });
    },
    [dispatch, navigation],
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
          isActive={isFocused}
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
