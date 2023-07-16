import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import AppBar from "../components/Navbar"
const {width, height} = Dimensions.get('window')
import Messages from '../MNTab/Messages/Messages'

const MyMessages = ({navigation}) => {
  const AppBarContent = {
    title: 'Messages',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  return (
    <View style={styles.container}>
      <AppBar props={AppBarContent} />
      <Messages />
    </View>
  )
}

export default MyMessages

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    height: height,
    width: width,
    flex: 1,
  },
})