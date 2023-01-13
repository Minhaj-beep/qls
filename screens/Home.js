/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Heading,
  Image,
  FlatList,
} from 'native-base';
// import HCarousel from './components/HCarousel';
import Chip from './components/Home/Chip';
import Navbar from './components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {
  setProfileImg,
  setMail,
  setProfileData,
  setJWT,
  setLoggedIn,
  setGUser,
  setLoading,
  setNavigation,
} from './Redux/Features/authSlice';
import {BaseURL} from './StaticData/Variables';
import {
  setSearchT,
  setLiveCourses,
  setFeaturedCourses,
  setPopularCourses,
  setSearchA,
  setSearchData,
} from './Redux/Features/CourseSlice';


import GetCategories from './Functions/API/GetCategories';
import RenderCarousel from './components/Home/RenderCarousel';
import {GetLCourses} from './Functions/API/GetLiveCourses';
// import {phone} from 'phone';

const {width, height} = Dimensions.get('window');

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const [LCourses, setLCourses] = useState();
  const [PCourses, setPCourses] = useState();
  const [FCourses, setFCourses] = useState();
  const [catogeries, setcatogeries] = useState();

  useEffect(() => {
    CheckLogin();
    // console.log(phone('+916382154544'));
  }, []);

  const Permissions = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]).then(res => {
        console.log(res);
        // GetDevices();
      });
    } catch (e) {
      console.log('Error:' + e.message);
    }
  };

  const GCategories = async email => {
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
      };
      // console.log(requestOptions);
      await fetch(BaseURL + 'getAllCategory', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setcatogeries(result.data);
          } else if (result.status > 200) {
            alert('GCategories' + result.message);
            console.log('GCategories' + result.message);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('GCategories' + error);
          alert('GCategories' + error);
        });
    }
  };

  const CheckLogin = async () => {
    dispatch(setLoading(true));
    await AsyncStorage.getItem('Email')
      .then(email => {
        if (email) {
          let mail = JSON.parse(email);
          GetProfileD(mail);
          GetFeaturedCourses(mail);
          dispatch(setLoading(false));
          dispatch(setLoggedIn(true));
        } else {
          dispatch(setLoading(false));
          dispatch(setLoggedIn(false));
          alert('Something went wrong with the local storage!');
        }
      })
      .catch(error => {
        console.log(error);
        alert('Error CheckLogin : ' + error);
      });
  };

  const GetProfileD = async email => {
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
      };
      await fetch(BaseURL + 'getStudentByEmail?email=' + email, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            // console.log(result.data.profileImgPath);
            dispatch(setProfileData(result.data));
            if (result.data.profileImgPath != null) {
              console.log('Profile image retrieved');
              dispatch(setProfileImg(true));
            } else {
              console.log('No profile image');
              dispatch(setProfileImg(false));
            }
            dispatch(setLoading(false));
            Permissions();
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('GetProfileD error : ' + result.message);
            console.log('GetProfileD error : ' + result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('GetProfileD error : ' + error);
          alert('GetProfileD error : ' + error);
        });
    }
  };

  const AppBarContent = {
    title: 'Home',
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  const GetFeaturedCourses = async EMail => {
    if (EMail === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: EMail,
        },
      };
      await fetch(BaseURL + 'searchCourse?newCourse=true', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            // console.log(result.data);
            dispatch(setFeaturedCourses(result.data));
            setFCourses(result.data);
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error GetFeaturedCourses: ' + result.message);
            console.log('Error GetFeaturedCourses: ' + result.message);
          }
          // console.log(result);
          GetPopularCourses(EMail);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error GetFeaturedCourses: ' + error);
          alert('Error GetFeaturedCourses: ' + error);
        });
    }
  };

  const GetPopularCourses = async email => {
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
      };
      await fetch(BaseURL + 'searchCourse?popularCourse=true', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            // console.log(result.data);
            dispatch(setPopularCourses(result.data));
            setPCourses(result.data);
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error GetPopularCourses: ' + result.message);
            console.log('Error GetPopularCourses: ' + result.message);
          }
          // console.log(result);
          GetLiveCourses(email);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error GetPopularCourses: ' + error);
          alert('Error GetPopularCourses: ' + error);
        });
    }
  };

  const GetLiveCourses = async email => {
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      try {
        const result = await GetLCourses(email);
        // console.log(result);
        if (result.status === 200) {
          dispatch(setLiveCourses(result.data));
          setLCourses(result.data);
          // console.log(result.data.length);
          dispatch(setLoading(false));
        } else if (result.status > 200) {
          dispatch(setLoading(false));
          alert('Error GetLiveCourses: ' + result.message);
          console.log('Error GetLiveCourses: ' + result.message);
        }
        GCategories(email);
      } catch (e) {
        dispatch(setLoading(false));
        console.log('Error GetLiveCourses: ' + e.message);
        alert('Error GetLiveCourses: ' +e.message);
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Navbar props={AppBarContent} />
      <ScrollView
        contentContainerStyle={styles.TopContainer}
        nestedScrollEnabled={true}>
        {/* Top Banner */}
        <Container style={styles.topbanner} bg="white.100" mt="4">
          <HStack style={styles.tophstack}>
            <VStack p={2}>
              <Heading style={styles.tbtitle} size="lg">
                Learn From Anywhere
              </Heading>
              <Text style={styles.tbtext}>
                Skill is your real asset. Make Skill for Better Future
              </Text>
            </VStack>
            <View style={styles.tbimage}>
              <Image
                source={require('../assets/Home/TBman.png')}
                alt="topbanner-image"
              />
            </View>
          </HStack>
        </Container>

        <VStack mt={4} mb={5}>
          {FCourses ? (
            <RenderCarousel
              data={FCourses}
              title={'Featured Courses'}
              nav={navigation}
              type={'Featured'}
            />
          ) : null}
          {PCourses ? (
            <RenderCarousel
              data={PCourses}
              title={'Popular Courses'}
              nav={navigation}
              type={'Popular'}
            />
          ) : null}
          {LCourses ? (
            <RenderCarousel
              data={LCourses}
              title={'Live Courses'}
              nav={navigation}
              type={'Live'}
            />
          ) : null}

          <VStack
            bg={'secondary.50'}
            p={5}
            borderRadius={20}
            justifyContent={'center'}
            alignItems={'center'}
            ml={4}
            mr={4}>
            <Heading color={'#000'} style={{fontSize: 14}}>
              Attend Assessments
            </Heading>
            <Text
              alignItems={'center'}
              style={{fontSize: 10, textAlign: 'center'}}
              color={'greyScale.800'}>
              “Lorem Ipsum has been the industry's standard dummy text ever
              since the 1500s, when an unknown printer took a galley.
            </Text>
            <Button
              colorScheme={'primary'}
              borderRadius={8}
              mt={4}
              _text={{fontSize: 9, paddingLeft: 10, paddingRight: 10}}>
              Explore All
            </Button>
          </VStack>
        </VStack>

        {/* <Text
          style={{color: '#000000', fontSize: 16, fontWeight: 'bold'}}
          ml={2}
          mb={4}>
          Categories
        </Text> */}
        {/* <Chip props={Flist} /> */}

        <VStack ml={4} mr={4} mt={5} mb={5} space={2}>
          {/* <HCarousel props="Recent Views"/> */}

          <VStack space={2} justifyContent={'center'} alignItems={'center'}>
            <Heading color={'primary.100'} style={{fontSize: 18}}>
              Become A Teacher Today
            </Heading>
            <Button color={'primary'} _text={{fontSize: 14}} pl={4} pr={4}>
              Become an Instructor
            </Button>
            <Text onPress={()=>navigation.navigate("LiveClass")}>Live class</Text>
            
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    height: height,
    width: width,
    flex: 1,
    // margin:15,
  },
  TopContainer: {
    flexGrow: 1,
    // flexShrink: 1,
    // flexBasis: 1,
    paddingBottom: 70,
  },
  topbanner: {
    width: width / 0.3,
    height: height / 5,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 0.376085489988327,
    },
    shadowRadius: 21.951963424682617,
    shadowOpacity: 1,
    alignSelf: 'center',
  },
  tophstack: {
    width: width / 0.1,
  },
  tbtitle: {
    width: width / 2.1,
    fontSize: 25,
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#000000',
    paddingBottom: 10,
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 10,
  },
  tbtext: {
    width: width / 2.2,
    fontSize: 11,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#8C8C8C',
    paddingLeft: 15,
  },
  tbimage: {
    width: width / 3.8,
    height: height / 5.5,
    marginTop: 15,
  },
});
