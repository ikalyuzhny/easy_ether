import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';

interface ITitleLogoProps {
  title: string;
}

export const TitleLogo: React.VFC<ITitleLogoProps> = ({title}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.primary}]}>
      <Text style={[styles.text, {color: colors.text}]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '60%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
