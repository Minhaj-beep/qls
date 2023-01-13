import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  VStack,
  HStack,
  Container,
  Center,
  ZStack,
  Box,
  Text,
} from 'native-base';
import Navbar from '../components/Navbar';
import DashImg from '../components/Profile/DashImg';
import ProfileSettings from '../components/Profile/ProfileSettings';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setLoading, setLoggedIn} from '../Redux/Features/authSlice';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const ProfileDash = ({navigation}) => {
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const dispatch = useDispatch();

  const AppBarContent = {
    title: 'Profile',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  const ClearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      alert('Local storage error: ' + e);
    }
  };

  const GSignOut = async () => {
    try {
      await GoogleSignin.signOut()
        .then(() => console.log('Google logged out'))
        .catch(error => {
          console.log('Error:' + error);
        });

      auth()
        .signOut()
        .then(() => console.log('Google logged out'))
        .catch(error => {
          console.log('Error:' + error);
        });
    } catch (error) {
      console.log('Error:' + error);
    }
  };

  const LogOut = () => {
    dispatch(setLoading(true));
    dispatch(setLoggedIn(false));
    ClearLocalStorage();
    GSignOut();
    dispatch(setLoading(false));
  };
  return (
    <SafeAreaView style={styles.container}>
      <Navbar props={AppBarContent} />
      <ScrollView
        contentContainerStyle={styles.TopContainer}
        nestedScrollEnabled={true}>
        <Center style={{marginRight: 70}}>
          <DashImg />
        </Center>
        <Center mt={4} mr={2}>
          <Text style={{fontWeight: 'bold', fontSize: 25}} pt={2}>
            {ProfileD.firstName} {ProfileD.middleName} {ProfileD.lastName}
          </Text>
          <Text style={{fontSize: 13, color: '#364b5b', fontWeight: 'bold'}}>
            {ProfileD.email}
          </Text>
        </Center>
        <VStack pt={4} pl={3} pr={3}>
          <ProfileSettings navigation={navigation} />
          <Button
            colorScheme={'primary'}
            _text={{fontSize: 16}}
            m={5}
            borderRadius={6}
            onPress={() => LogOut()}>
            Logout
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDash;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    height: height,
    width: width,
    flex: 1,
  },
  TopContainer: {
    flexGrow: 1,
    paddingBottom: 70,
  },
});
