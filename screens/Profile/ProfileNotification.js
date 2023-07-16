import { View } from 'react-native';
import React from 'react';
import AppBar from '../components/Navbar';
import MainNotification from './NotificationComponents/MainNotification';

const ProfileNotification = ({navigation}) => {
  
  const AppBarContent = {
    title: 'Notification',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }
  return (
    <View style={{flex:1}}>
      <AppBar props={AppBarContent}/>
      <MainNotification />
    </View>
  )
}

export default ProfileNotification