import React from 'react';
import {StyleSheet, View} from 'react-native';
import Hokm from './Hokm'; // Make sure to provide the correct path to your Hokm component

export default function App() {
  return (
    <View style={styles.container}>
      <Hokm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
