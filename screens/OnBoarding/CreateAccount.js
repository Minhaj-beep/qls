/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {
  Center,
  Text,
  Box,
  VStack,
  HStack,
  Input,
  FormControl,
  Button,
  Link,
  Heading,
  Image,
  Modal,
  IconButton,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import {
  PassVal,
  EmailVal,
  OtpVal,
  MobileVal,
  TextVal,
} from '../Functions/Validations';
import {BaseURL} from '../StaticData/Variables';
import {FetchPost} from '../Functions/API/Fetch';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setProfileImg,
  setMail,
  setProfileData,
  setJWT,
  setLoggedIn,
  setGUser,
  setLoading,
} from '../Redux/Features/authSlice';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {phone} from 'phone';
import PushNotification from 'react-native-push-notification';

const {width, height} = Dimensions.get('window');

const CreateAccount = ({navigation}) => {
  const dispatch = useDispatch();

  GoogleSignin.configure({
    webClientId:
      '855618612359-gvf660jb4h9q42d0umjnpmj4va9s3moa.apps.googleusercontent.com',
  });

  const [PShow, setPShow] = useState(false);
  const [GoogleSubmit, setGoogleSubmit] = useState(false);

  const [FullName, setFullName] = useState('');
  const [MiddleName, setMiddleName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [CaOtp, setCaOtp] = useState();
  const [MobileNo, setMobileNo] = useState('');

  const [emailAbs, setemailAbs] = useState('');

  const [ErrEmail, setErrEmail] = useState(false);
  const [ErrPassword, setErrPassword] = useState(false);
  const [ErrFullName, setErrFullName] = useState(false);
  const [ErrLastName, setErrLastName] = useState(false);
  const [ErrOtp, setErrOtp] = useState(false);
  const [ErrMobile, setErrMobile] = useState(false);

  const [showVmodal, setVmodal] = useState(false);
  const [resend, setresend] = useState(true);
  const [countrycode, setCountryCode] = useState('IN');

  const [PhoneCountrycode, setPhoneCountrycode] = useState('IN');
  const [FormattedPhone, setFormattedPhone] = useState();

  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const mobileNumberRef = useRef()
  const passwordRef = useRef()
  const emailRef = useRef()

  const [time, setTime] = useState(60);
  const timerRef = useRef(time);

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

  async function onGoogleButtonPress() {
    setGoogleSubmit(true);
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    await GoogleSignin.signIn()
      .then(res => {
        let {idToken} = res;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        auth()
          .signInWithCredential(googleCredential)
          .then(result => {
            // console.log(result.additionalUserInfo);
            let UserInfo = result.additionalUserInfo.profile;
            console.log(UserInfo.email);
            HandleGoogleUser(UserInfo.email, UserInfo.name);
          })
          .catch(error => {
            console.log('Error: ' + error.message);
          });
      })
      .catch(error => {
        console.log('Error: ' + error.message);
      });
    setGoogleSubmit(false);
  }

  const HandleGoogleUser = async (Gmail, GfullName) => {
    dispatch(setLoading(true));
    if (Gmail === '' || GfullName === '') {
      alert('Something went wrong, please try again');
      dispatch(setLoading(false));
    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: Gmail,
          userType: 'STUDENT',
          isGmail: true,
          fullName: GfullName,
        }),
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'gmailRegister', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            dispatch(setLoading(false));
            alert('Account creation successful!');
            GSignOut();
            navigation.navigate('Login');
            console.log(result);
          } else if (result.status > 200) {
            alert('Error: ' + result.message);
            dispatch(setLoading(false));
          }
        })
        .catch(error => {
          console.log('Error:' + error);
          alert('Error:' + error);
          dispatch(setLoading(false));
        });
    }
  };

  const phoneInput = useRef(null);

  useEffect(() => {
    CheckLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hadnleNotification = () => {
    PushNotification.localNotification({
      channelId:"test-channel",
      title:"You have recived a local notification",
      message:"Hooray! blaa blaa blaa blaa blaa bla  bla bla balaaaaa!"
    })
    console.log('Done: test-channel')
  }

  async function CheckLogin() {
    dispatch(setLoading(true));
    await AsyncStorage.getItem('Email')
      .then(email => {
        if (email) {
          let mail = JSON.parse(email);
          dispatch(setMail(mail));
          dispatch(setLoading(false));
          dispatch(setLoggedIn(true));
        } else {
          dispatch(setLoading(false));
          dispatch(setLoggedIn(false));
        }
      })
      .catch(error => {
        console.log(error);
        alert('Error:' + error);
      });
  }

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
            console.log(result.data);
            dispatch(setProfileData(result.data));
            if (result.data.profileImgPath != null) {
              console.log('Profile image retrieved');
              dispatch(setProfileImg(true));
            } else {
              console.log('No profile image');
              dispatch(setProfileImg(false));
            }
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  const emailAbstract = () => {
    let email = Email;
    let email_sub = email.substring(0, 2);
    let email_abstract =
      email_sub + '***' + email.substring(email.length - 4, email.length);
    setemailAbs(email_abstract);
  };

  const submit = async () => {
    emailAbstract();
    let body = {
      firstName: FullName,
      middleName: MiddleName,
      lastName: LastName,
      email: Email,
      password: Password,
      mobileNumber: '+91' + MobileNo,
      userType: 'STUDENT',
    };
    dispatch(setLoading(true));
    if (
      ErrEmail !== true && Email !== '' &&
      ErrPassword !== true && Password !== '' &&
      ErrFullName !== true && FullName !== '' &&
      ErrMobile !== true && MobileNo !== '' &&
      ErrLastName !== true && LastName !== ''
    ) {

      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // 'gmailUserType':'INSTRUCTOR',
          // 'token':Email
        },
        body: JSON.stringify(body),
      };
      await fetch(BaseURL + 'register', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('requestOptionsssssssssssssssssssssssssssss');
        dispatch(setLoading(false));
          if (result.status === 200) {
            setVmodal(true);
            setTime(60);
            timerRef.current = 60;
            setOTPTimer();
          } else if (result.status !== 200) {
            setVmodal(false);
            alert('Error:' + result.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          dispatch(setLoading(false));
          alert(' API Error:', error);
        });
    } else {
      if (FullName === ''){
        firstNameRef.current.focus()
        setErrFullName(true)
        console.log('.current.focus()1')
      } else if (LastName === '') {
        lastNameRef.current.focus()
        setErrLastName(true)
        console.log('.current.focus()2')
      } else if (Email ==='' || ErrEmail ) {
        emailRef.current.focus()
        setErrEmail(true)
        console.log('.current.focus()3')
      }
       else if (ErrMobile || MobileNo === '' || MobileNo === null) {
          mobileNumberRef.current.focus()
          setErrMobile(true)
          console.log('.current.focus()4')
        } 
        else if (Password === '' || ErrPassword ) {
          passwordRef.current.focus()
          setErrPassword(true)
          console.log('.current.focus()5')
      } else {
        alert('Please enter the details properly!!!!');
      }
      dispatch(setLoading(false));
      // alert('Please enter the details properly!');
    }
    dispatch(setLoading(false));
  };

  const VerifyOtp = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: Email,
        code: CaOtp,
        userType: 'STUDENT',
      }),
    };
    dispatch(setLoading(true));
    await fetch(BaseURL + 'registerVerifyCode', requestOptions)
      .then(response => response.json())
      .then(result => {
        dispatch(setLoading(false));
        if (result.status === 200) {
          setVmodal(false);
          navigation.navigate('Login');
          alert('Account creation successful!');
        } else if (result.status > 200) {
          alert('Failed:' + result.status + ', ' + result.message);
          console.log(result.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        dispatch(setLoading(false));
        alert(' API Error:', error);
      });
  };

  const setOTPTimer = () => {
    const timerId = setInterval(() => {
      timerRef.current = timerRef.current - 1;
      if (timerRef.current < 0) {
        setresend(false);
        clearInterval(timerId);
      } else {
        let TT = timerRef.current;
        let lenT = String(TT).length;
        if (lenT < 2) {
          setTime('0' + TT);
        } else {
          setTime(TT);
        }
      }
    }, 1000);
    return () => {
      setresend(false);
      clearInterval(timerId);
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal isOpen={showVmodal} onClose={() => setVmodal(false)} size="lg">
        <Modal.Content maxWidth="600">
          <Modal.CloseButton />
          <Modal.Body>
            <VStack space={3}>
              <Box safeArea flex={1} p={2} w="90%" mx="auto">
                <VStack space={2}>
                  <Heading size="lg" fontSize="lg">
                    <Text>Verification</Text>
                  </Heading>
                  <Heading
                    size="xs"
                    _text={{color: 'coolGray.600'}}
                    fontWeight="100"
                    fontSize="12"
                    ml={1}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        maxWidth: width / 1.5,
                      }}>
                      We sent 6 Digit OTP to {emailAbs}
                    </Text>
                  </Heading>
                  <FormControl style={styles.vinput}>
                    <Input
                      variant="filled"
                      bg="#f3f3f3"
                      type="number"
                      autoComplete="off"
                      textContentType="none"
                      placeholder="Enter 6 Digit OTP"
                      onChangeText={text => {
                        let OVal = OtpVal(text);
                        if (OVal === true) {
                          setCaOtp(text);
                          setErrOtp(false);
                        } else {
                          setCaOtp(text);
                          setErrOtp(true);
                        }
                      }}
                    />
                  </FormControl>
                  {ErrOtp === true ? (
                    <Text style={{color: '#FF0000', fontSize: 9}}>
                      {' '}
                      * Please enter the OTP properly
                    </Text>
                  ) : null}
                  <HStack style={styles.otpcount} space={2} mt={2}>
                    <View style={styles.count}>
                      <Text style={{fontSize: 12, color: '#3e5160'}}>
                        00 : {time}
                      </Text>
                    </View>
                    <Link style={styles.resendbtn}>
                      <TouchableOpacity
                        onPress={() => {
                          setVmodal(false);
                          submit();
                          // test()
                        }}
                        disabled={resend}>
                        <Text style={styles.resendtext}>Resend</Text>
                      </TouchableOpacity>
                    </Link>
                  </HStack>
                  <Button
                    bg="#3e5160"
                    colorScheme="blueGray"
                    style={styles.cbutton}
                    onPress={() => VerifyOtp()}>
                    Verify
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <ScrollView>
        <Center w="100%">
          <Box safeArea p="2" w="90%" maxW="350" py="8">
            <TouchableOpacity onPress={()=>hadnleNotification()}>
            <Heading
              size="md"
              color="coolGray.800"
              _dark={{
                color: 'warmGray.50',
              }}
              fontWeight="semibold">
              Create New Account
            </Heading>
            </TouchableOpacity>
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'muted.700',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  First Name
                  <Text style={{fontSize: 14, color: 'red'}}>
                    {` *`}
                  </Text>
                </FormControl.Label>
                <Input
                  ref={firstNameRef}
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Enter First Name"
                  onChangeText={text => {
                    // setErrFullName(false)
                    let ValT = TextVal(text);
                    if (ValT === true) {
                      setErrFullName(false);
                      setFullName(text);
                    } else if (ValT !== true) {
                      setErrFullName(true);
                      setFullName(text);
                    }
                  }}
                />
              </FormControl>
              {ErrFullName === true ? (
                <Text style={{color: '#FF0000', fontSize: 9}}>
                  * Please enter your First Name
                </Text>
              ) : null}
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'muted.700',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  Middle Name
                  <Text style={{fontSize: 10, color: '#8C8C8C'}}>
                    (Optional)
                  </Text>
                </FormControl.Label>
                <Input
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Enter Middle Name"
                  onChangeText={text => setMiddleName(text)}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'muted.700',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  Last Name 
                  <Text style={{fontSize: 14, color: 'red'}}>
                    {` *`}
                  </Text>
                </FormControl.Label>
                <Input
                  ref={lastNameRef}
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Enter Last Name"
                  onChangeText={text => {
                    let ValT = TextVal(text);
                    if (ValT === true) {
                      setErrLastName(false);
                      setLastName(text);
                    } else if (ValT !== true) {
                      setErrLastName(true);
                      setLastName(text);
                    }
                  }}
                />
              </FormControl>
              {ErrLastName === true ? (
                <Text style={{color: '#FF0000', fontSize: 9}}>
                  * Please enter your Last Name
                </Text>
              ) : null}
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'muted.700',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  Email
                  <Text style={{fontSize: 14, color: 'red'}}>
                    {` *`}
                  </Text>
                </FormControl.Label>
                <Input
                  ref={emailRef}
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Enter your email"
                  onChangeText={text => {
                    let ValT = EmailVal(text);
                    if (ValT === true) {
                      setErrEmail(false);
                      setEmail(text);
                    } else if (ValT !== true) {
                      setErrEmail(true);
                      setEmail(text);
                    }
                  }}
                />
              </FormControl>
              {ErrEmail === true ? (
                <Text style={{color: '#FF0000', fontSize: 9}}>
                  * Please enter your email properly
                </Text>
              ) : null}

              <View>
                <Text color="muted.700" fontSize="sm" fontWeight="600" mb={1}>
                  Mobile no.
                  <Text style={{fontSize: 14, color: 'red'}}>
                    {` *`}
                  </Text>
                </Text>
                <View>
                <PhoneInput
                  ref={phoneInput}
                  defaultCode="IN"
                  layout="first"
                  onChangeCountry={(res)=>setCountryCode(res.cca2)}
                  containerStyle={{width:"100%", backgroundColor:"#f3f3f3", color:"black", height:50, }}
                  codeTextStyle={{height:"150%",}}
                  textContainerStyle={{height:50, backgroundColor:"#f3f3f3",}}
                />
                <View style={{width:"100%",  flexDirection:"row", position:"absolute"}}>
                  <View style={{width:"55%",  marginLeft:'45%'}}>
                  <Input 
                    variant="filled" 
                    width={"100%"}
                    justifyContent={"flex-end"}
                    bg="#f3f3f3"
                    mt={0.5}
                    ref={mobileNumberRef}
                    value={MobileNo}
                    placeholder="Enter Mobile No."
                    onChangeText={text => {
                      let ValT = MobileVal(text);
                      if (ValT === true) {
                        setErrMobile(false);
                        setMobileNo(text);
                      } else if (ValT !== true) {
                        setErrMobile(true);
                        setMobileNo(text);
                      }
                    }}
                    borderRadius={5}
                    keyboardType="numeric" 
                    p={2}
                    style={{justifyContent:"flex-end"}}
                  />
                  </View>
                </View>
                </View>

                {ErrMobile === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    * Please enter your Mobile no. properly
                  </Text>
                ) : null}
              </View>

              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'muted.700',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  Password
                  <Text style={{fontSize: 14, color: 'red'}}>
                    {` *`}
                  </Text>
                </FormControl.Label>
                <Input
                  ref={passwordRef}
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Enter your password"
                  type={PShow ? 'text' : 'password'}
                  InputRightElement={
                    <Icon
                      name={PShow ? 'eye' : 'eye-off'}
                      size={20}
                      onPress={() => setPShow(!PShow)}
                      // backgroundColor="rgba(54, 75, 91, 0.001)"
                      style={{padding: 10}}
                      color="#364b5b"
                    />
                  }
                  onChangeText={text => {
                    let ValT = PassVal(text);
                    if (ValT === true) {
                      setErrPassword(false);
                      setPassword(text);
                    } else if (ValT !== true) {
                      setErrPassword(true);
                      setPassword(text);
                    }
                  }}
                />
              </FormControl>
              {ErrPassword === true ? (
                <Text style={{color: '#FF0000', fontSize: 9}}>
                  * Your Password must have 8-16 characters,small letters,
                  capital letter, number, and a special character @ # $ % ^ & *
                </Text>
              ) : null}
              <VStack>
                <Button mt="2" colorScheme="primary" onPress={() => submit()}>
                  Create Account
                </Button>
                <TouchableOpacity>
                  <Button
                    bg="white.100"
                    disabled={GoogleSubmit}
                    _pressed={{
                      bg: 'white.100',
                      _text: {
                        color: '#ffffff',
                      },
                    }}
                    style={styles.google}
                    mt={2}
                    mb={4}
                    onPress={() => onGoogleButtonPress()}>
                    <HStack space={2} justifyContent="center">
                      <Image
                        source={require('../../assets/Social/google-logo.png')}
                        style={styles.googleimg}
                        alt="Google Logo"
                      />
                      <Text style={styles.googletext} mt={1}>
                        Sign up with Google
                      </Text>
                    </HStack>
                  </Button>
                </TouchableOpacity>
              </VStack>

              <VStack alignItems="center" mt={4} space={3} mb={4}>
                <Text fontSize="sm" color="muted.700" fontWeight={400}>
                  Already have an account?
                </Text>
                <TouchableOpacity>
                  <Button
                    colorScheme="blueGray"
                    _text={{
                      color: '#3e5160',
                      bold: true,
                      fontSize: '15',
                    }}
                    _pressed={{bg: '#3c5060', _text: {color: '#fcfcfc'}}}
                    bg="#fcfcfc"
                    onPress={() => navigation.navigate('Login')}
                    // variant="ghost"
                  >
                    Log In
                  </Button>
                </TouchableOpacity>
              </VStack>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfcfc',
    height: height,
    width: width,
  },
  PhoneInput: {
    borderRadius: 7,
    backgroundColor: '#f3f3f3',
    height: height / 15,
    justifyContent:'center',
    // paddingBottom:5,
  },
  google: {
    borderColor: '#3e5160',
    color: '#3e5160',
    borderWidth: 1,
    borderRadius: 7,
  },
  googleimg: {
    width: 30,
    height: 30,
  },
  googletext: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  otpcount: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  count: {
    alignSelf: 'flex-end',
  },
  resendbtn: {
    alignSelf: 'flex-end',
  },
  resendtext: {
    fontSize: 12,
    color: '#bdbdbd',
    fontWeight: 'bold',
  },
});
