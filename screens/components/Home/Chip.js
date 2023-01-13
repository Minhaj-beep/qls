import {StyleSheet, Dimensions, View, ScrollView} from 'react-native';
import React from 'react';
import {
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Heading,
  Image,
} from 'native-base';

const {width, height} = Dimensions.get('window');

const Chip = ({props}) => {
  return (
    <ScrollView style={styles.chip} horizontal={true}>
      <View style={styles.chip1}>
        {props.map((item, index) => {
          return (
            <View style={{padding: 5}} key={index}>
              <Text p={2} bg={'white.100'} borderRadius={6}>
                {item.title}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chip: {
    width: width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F0E1EB',
    paddingBottom: 10,
    paddingTop: 10,
  },
  chip1: {
    width: width * 1.3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
