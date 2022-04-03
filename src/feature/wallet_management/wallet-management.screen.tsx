import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {RNCamera} from 'react-native-camera';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import ClipRect from '@remobile/react-native-clip-rect';

export const WalletManagementScreen: React.VFC = () => {
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      {isFocused && (
        <RNCamera
          style={StyleSheet.absoluteFill}
          captureAudio={false}
          onBarCodeRead={() => {}}
        />
      )}
      <View
        style={[StyleSheet.absoluteFill, {backgroundColor: colors.primary}]}
      />
      <ClipRect style={styles.clipBlock} />
      <SafeAreaView style={styles.infoBlock}>
        <Text style={[styles.title, {color: colors.text}]}>
          {t('common.appName')}
        </Text>
      </SafeAreaView>
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
