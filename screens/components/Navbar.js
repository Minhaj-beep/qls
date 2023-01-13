import React, {useState, useEffect} from 'react';
import {IconButton, Text, VStack, HStack, Image, Badge} from 'native-base';
import {
  View,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { GetCart } from '../Functions/API/GetCart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const AppBar = ({props}) => {
  const AppBarData = JSON.parse(JSON.stringify(props));
  const Profile = useSelector(state => state.Auth.ProfileData);
  const Img = Profile.profileImgPath;
  const ProfileI = useSelector(state => state.Auth.ProfileImg);
  const [ProfileImg, setProfileImg] = useState(false);
  //  const ProfileImg = false;
  //   const NotiCount = useSelector(state => state.login.NCount);
  const navigation = props.navigation;
  const [NCount, setNCount] = useState(0);

  // const dispatch = useDispatch()
  // console.log(String(NotiCount).length);

    useEffect(() => {
      const timer = setInterval(()=>{
        GetMail();
      },5000);
      return () => clearInterval(timer);
    },[]);

  useEffect(() => {
    setProfileImg(ProfileI);
  }, [ProfileI]);

  const GetCartCount = async(mail) => {
    try {
      let response = await GetCart(mail);
      // console.log(response);
      if (response.status === 200 || response.status !== 502 && response.status !== 503) {
        let data = response.data;
        let ObjData = Object.keys(data).length === 0;
        if ( ObjData !== true){
          let Citems = data.items;
          if (Citems.length !== 0){
            // console.log(Citems.length); // This the error
            setNCount(Citems.length); 
          }
        }
      }
    } catch (error) {
      // console.log("GetCartCount error: " + error.message);
      // alert("GetCartCount error 2: " + error.message);
    }
  };
  const GetMail = async() => {
    await AsyncStorage.getItem('Email')
      .then(email => {
        if (email) {
          let mail = JSON.parse(email);
          GetCartCount(mail);
        } else {
          alert('Something went wrong with the local storage!');
        }
      })
      .catch(error => {
        console.log(error);
        alert('Error:' + error);
      });
  };

  return (
    <SafeAreaView>
      <VStack>
        <HStack style={styles.container} ml={2} mr={2} mt={1}>
          <HStack style={{flex: 1, alignItems: 'center'}}>
            {AppBarData.ArrowVisibility ? (
              <IconButton
                onPress={() => navigation.goBack()}
                style={styles.backbtn}
                icon={<Icon name="arrow-back" color="#3e5160" size={20} />}
              />
            ) : null}
            <Text style={styles.title} color="#000000">
              {AppBarData.title}
            </Text>
          </HStack>

          <HStack alignItems={'center'} >
            <VStack marginRight={1}>
              {NCount ? (
                <Badge // bg="red.400"
                  bg="primary.100"
                  rounded="full"
                  mb={-5}
                  zIndex={1}
                  variant="solid"
                  alignSelf="flex-end"
                  _text={{
                    fontSize: 7,
                  }}>
                  {NCount}
                </Badge>
              ) : null}
              <IconButton
                mx={{
                  base: 'auto',
                  md: 0,
                }}
                style={{marginBottom:-5}}
                icon={<Icon name={'cart-outline'} color="#3e5160" size={20} />}
                onPress={() => navigation.navigate('Cart')}
              />
            </VStack>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileDash')}>
              {ProfileImg === true ? (
                <Image
                  source={{uri: Img}}
                  rounded={100}
                  width={35}
                  height={35}
                  alt="profile"
                />
              ) : (
                // <Image
                //   source={require('../../assets/personIcon.png')}
                //   rounded={100}
                //   width={35}
                //   height={35}
                //   alt="profile"
                //   />
                <Image
                  source={require('../../assets/personIcon.png')}
                  rounded={100}
                  width={35}
                  height={35}
                  alt="profile"
                />
              )}
            </TouchableOpacity>
          </HStack>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  backbtn: {
    fontWeight: 'bold',
  },
  acbtn: {
    borderRadius: 35,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default AppBar;
