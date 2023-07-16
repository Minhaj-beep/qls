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
  Image,
  Modal,
  Text,
} from 'native-base';
import Navbar from '../components/Navbar';
import DashImg from '../components/Profile/DashImg';
import ProfileSettings from '../components/Profile/ProfileSettings';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setLoading, setLoggedIn, setGUser, setIsLoggedInBefore} from '../Redux/Features/authSlice';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { BaseURL } from '../StaticData/Variables';

const {width, height} = Dimensions.get('window');

const ProfileDash = ({navigation}) => {
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const JWT = useSelector(state => state.Auth.JWT);
  const email = ProfileD.email
  console.log('Console.log() : ', JWT)
  const dispatch = useDispatch();
  const [SuccessLogout, setSuccessLogout] = useState(false)

  const AppBarContent = {
    title: 'Profile',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  const logOutFromCurrentDevice = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': JWT,
        type: 'text',
      },
      body: JSON.stringify({
        email: email,
        userType: 'STUDENT',
      }),
    };

    await fetch(BaseURL + 'logout', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('Has the user logged out ??????? ', result)
    })
  }

  const ClearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('isLoggedInBefore', 'true')
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
    dispatch(setGUser(false));
    dispatch(setLoggedIn(false));
    dispatch(setIsLoggedInBefore(true));
    logOutFromCurrentDevice()
    ClearLocalStorage();
    GSignOut();
    dispatch(setLoading(false));
  };
  return (
    <SafeAreaView style={styles.container}>
        <Modal isOpen={SuccessLogout} onClose={() => setSuccessLogout(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}
                <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5} justifyContent="center" alignItems="center">
                  <Image
                  source={require('../../assets/ACSettings/AccountActivity.png')}
                  resizeMode="contain"
                  size="md"
                  alt="successful"
                  />
                  <Text fontWeight="bold" style={{color:"#000"}} fontSize="17">Do you want to logout your account?</Text> 
                  <Button 
                    bg="#3e5160"
                    colorScheme="blueGray"
                    style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                    _pressed={{bg: "#fcfcfc",
                      _text:{color: "#3e5160"}
                      }}
                      onPress={()=>
                        LogOut()
                      }
                      >
                  Confirm
                </Button>
                
                {/* </VStack> */}
              </VStack>
            </Modal.Body>
        </Modal.Content>
      </Modal>
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
            onPress={() => setSuccessLogout(true) }>
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
