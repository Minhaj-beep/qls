import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity,} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import { Center, Text, Box, VStack, HStack, Input, FormControl, Divider, Button, Link, Heading, Image, Modal, IconButton,} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { PassVal, EmailVal, OtpVal, MobileVal, TextVal,} from '../Functions/Validations';
import {BaseURL} from '../StaticData/Variables';
import {useDispatch, useSelector} from 'react-redux';
import { setMail, setProfileData, setJWT, setLoggedIn, setGUser, setUserData, setLoading, setUser_ID, setTempName, setIsLoggedInWithMobile,} from '../Redux/Features/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes,} from '@react-native-google-signin/google-signin'
import { GetAccountDetailsbyMobileNum } from '../Functions/API/GetAccountDetailsbyMobileNum';
import PhoneInput from 'react-native-phone-number-input'
import { LoginWithMobileNum } from '../Functions/API/LoginWithMobileNum';
import PushNotification from 'react-native-push-notification';

const {width, height} = Dimensions.get('window');

GoogleSignin.configure({
  webClientId:
    '855618612359-gvf660jb4h9q42d0umjnpmj4va9s3moa.apps.googleusercontent.com',
});

const Login = ({navigation}) => {
  const [PShow, setPShow] = useState(false);
  const dispatch = useDispatch();

  const [GoogleSubmit, setGoogleSubmit] = useState(false);

  const GSignOut = async () => {
    try {
      await GoogleSignin.signOut()
        .then(() => console.log('Google logged out'))
        .catch(error => {
          console.log('Error:' + error);
        });

      // auth().signOut()
      // .then(()=>console.log('Google logged out'))
      // .catch(error => { console.log('Error:' + error); });
    } catch (error) {
      console.log('Error:' + error);
    }
  };

  async function onGoogleButtonPress() {
    setGoogleSubmit(true);
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    await GoogleSignin.signIn()
      .then(res => {
        // console.log(result);
        let {idToken} = res;
        console.log(res);
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        auth()
          .signInWithCredential(googleCredential)
          .then(result => {
            // console.log(result.additionalUserInfo);
            let UserInfo = result.additionalUserInfo.profile;
            console.log(UserInfo.email);
            HandleGoogleUser(UserInfo.email, UserInfo.name);
            // GSignOut();
          })
          .catch(error => {
            console.log('Error: ' + error.message);
          });
      })
      .catch(error => {
        console.log('CError: ' + error.message);
      });
    setGoogleSubmit(false);
  }

  const HandleGoogleUser = async (Gmail, GfullName) => {
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
      await fetch(BaseURL + 'login', requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result, 'Result to handle google user')
          if (result.status === 200) {
            EUSavelocal('Email', JSON.stringify(Gmail));
            EUSavelocal('GUser', JSON.stringify(true));
            EUSavelocal('User_ID', JSON.stringify(result.data.userId));
            EUSavelocal('TempName', JSON.stringify(result.data.name));
            dispatch(setUser_ID(result.data.userId));
            dispatch(setTempName(result.data.name));
            dispatch(setGUser(true));
            dispatch(setMail(Gmail));
            dispatch(setLoggedIn(true));
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setGUser(false));
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

  const [Email, setEmail] = useState();
  const [Pass, setPass] = useState();
  const [ForgotVOtp, setForgotVOtp] = useState();

  const [NewPassword, setNewPassword] = useState();
  const [CNewPassword, setCNewPassword] = useState();
  const [ForgotEmail, setForgotEmail] = useState('');

  const [LShow, setLShow] = useState(false);
  const [RPShow, setRPShow] = useState(false);
  const [RCPShow, setRCPShow] = useState(false);

  const [ErrEmail, setErrEmail] = useState(false);
  const [ErrVFMail, setErrVFMail] = useState(false);
  const [ErrPassword, setErrPassword] = useState(false);
  const [ErrOTP, setErrOTP] = useState(false);
  const [ErrRPass, setErrRPass] = useState(false);
  const [ErrRNP, setErrRNP] = useState(false);
  const [ErrRCNP, setErrRCNP] = useState(false);

  const [resend, setresend] = useState(true);
  const [emailAbs, setemailAbs] = useState('');

  const [time, setTime] = useState(60);
  const timerRef = useRef(time);
  const forgotMailRef = useRef();

  const [showForgot, setForgot] = useState(false);
  const [forgetEmailErr, setForgetEmailErr] = useState(false);
  const [showVerifyf, setVerifyf] = useState(false);
  const [showRpass, setRpass] = useState(false);
  const [showRs, setRs] = useState(false);

  const [loginWithNum, setLoginWithNum] = useState(false)
  const [loginWithNumOtp, setLoginWithNumOtp] = useState(false)
  const [phNo, setPhNo] = useState('')
  const [otp, setOtp] = useState('')
  const [countryCode, setCountryCode] = useState('IN')
  const [callingCode, setCallingCode] = useState(null)
  const [verificationId, setVerificationId] = useState('')
  const [selectMobileAccount, setSelectMobileAccount] = useState(false)
  // const [mobileAccount, setMobileAccount] = useState({})
  const [mobileAccounts, setMobileAccounts] = useState([])
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (parseInt(seconds) === 0) {
      setresend(false)
      return;
    }

    if(seconds > 0){
      setresend(true)
    }
    let intervalId
    // console.log(String(seconds).length)

    if(String(parseInt(seconds)).length < 2 || parseInt(seconds)-1 === 9){
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => '0' + (parseInt(prevSeconds) - 1));
      }, 1000);
    } else {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    

    return () => clearInterval(intervalId);
  }, [seconds]);

  useEffect(()=>{
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
  
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },
  
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  },[])

  const loginWithMobileNum = async(mobileAccount) => {
    try {
      let response = await LoginWithMobileNum(mobileAccount.mobileNumber, mobileAccount.userType, mobileAccount.accountId, mobileAccount.email);
      if (response.status === 200) {
        console.log(Object.keys(response.data).length, response, 'responds loginWithMobileNum')
        dispatch(setGUser(false));
        dispatch(setJWT(response.data.JWT));
        dispatch(setMail(response.data.Email));
        dispatch(setUser_ID(response.data.userId));
        dispatch(setIsLoggedInWithMobile(true))
        EUSavelocal('IsLoggedInWithMobile', JSON.stringify(true));
        EUSavelocal('User_ID', JSON.stringify(response.data.userId));
        EUSavelocal('Email', JSON.stringify(response.data.Email));
        EUSavelocal('Name', JSON.stringify(response.data.Name));
        EUSavelocal('JWT', JSON.stringify(response.data.JWT))
        dispatch(setLoggedIn(true))
        setSelectMobileAccount(false)
      } else {
        console.log('Error loginWithMobileNum 1:' + response.message);
      }
    } catch (error) {
      console.log('Error loginWithMobileNum 2:' + error.message);
    }
  }

  const phoneNoSubmit = () => {
    // console.log(phNo, countryCode, callingCode)
    if(countryCode === 'IN'){
      if (phNo.length === 10) {
        var v = parseFloat(phNo)
        if(Number.isInteger(v)){
          getAccountDetailsbyMobileNum(v)
        } else {
          alert('Please insert only numbers.')
        }
      } else {
        alert('Please enter 10 digit mobile no.')
      }
    } else {
      alert('Currently only Indian users are allowed!')
    }
  }

  const getAccountDetailsbyMobileNum = async (num) => {
    num = '+91' + num
    console.log(num, 'num')
    try {
      let response = await GetAccountDetailsbyMobileNum(num);
      if (response.status === 200) {
        console.log(Object.keys(response.data).length, response, 'responds getAccountDetailsbyMobileNum')
        if(Object.keys(response.data).length > 0) {
          // Account exit, sending OTP to mobile no
          sendOtp(num)
          setSeconds(60)
          setLoginWithNumOtp(true)
          setMobileAccounts(response.data)
        } else {
          alert("Please register with this number and try re-login")
        }
        setLoginWithNum(false)
      } else {
        console.log('Error getAccountDetailsbyMobileNum1:' + response.message);
      }
    } catch (error) {
      console.log('Error getAccountDetailsbyMobileNum2:' + error.message);
    }
  }

  const sendOtp = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setVerificationId(confirmation.verificationId);
    } catch (error) {
      console.log('Error sending OTP:', error);
      // Alert.alert('Error', 'Could not send OTP. Please try again later.');
    }
  };

  const verifyOtp = async () => {
    console.log(otp)
    let result = {}
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        otp
      );
      result = await auth().signInWithCredential(credential);
      console.log(result)
    } catch (error) {
      console.log('Error verifying OTP:', error);
    }
    if(Object.keys(result).length > 0 && result.user){
      setLoginWithNumOtp(false)
      setSelectMobileAccount(true)
    } else {
      alert('Please insert the OTP correctly and try again!')
    }
    // ChangePhoneNumber()
  };

  function isNumeric(val) {
    return /^-?\d+$/.test(val);
  }

  const emailAbstract = mail => {
    let email = mail;
    let email_sub = email.substring(0, 3);
    let email_abstract =
      email_sub + '***' + email.substring(email.length - 4, email.length);
    setemailAbs(email_abstract);
  };

  const setOTPTimer = () => {
    const timerId = setInterval(() => {
      timerRef.current = timerRef.current - 1;
      if (timerRef.current < 0) {
        clearInterval(timerId);
        setresend(false);
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

  const CheckRPassword = pass => {
    if (NewPassword === pass) {
      return true;
    } else {
      return false;
    }
  };

  const handleForgot = async () => {
    if(ForgotEmail === ''){
      forgotMailRef.current.focus()
      setForgetEmailErr(true)
    } else {
      dispatch(setLoading(true));
      if (ErrVFMail === true) {
        dispatch(setLoading(false));
        alert('Please enter your email properly');
      } else {
        const requestOptions = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: ForgotEmail,
            userType: 'STUDENT',
          }),
        };
        await fetch(BaseURL + 'forgotverificationemail', requestOptions)
          .then(response => response.json())
          .then(result => {
            dispatch(setLoading(false));
            if (result.status === 200) {
              emailAbstract(ForgotEmail);
              setForgot(false);
              setVerifyf(true);
              setTime(60);
              timerRef.current = 60;
              setOTPTimer();
            } else if (result.status > 200) {
              alert("handleForgot: " + result.message);
            }
            console.log(result);
          })
          .catch(error => {
            console.log('Error handleForgot:', error);
            dispatch(setLoading(false));
            alert('Error handleForgot:' + error);
          });
      }
    }
  };

  const handleLogin = async () => {
    dispatch(setLoading(true));
    if (ErrEmail !== true && ErrPassword !== true) {
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: Email,
          password: Pass,
          userType: 'STUDENT',
          isGmail: false,
        }),
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'login', requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result, '______________________Loggedin with credentials______________');
          dispatch(setLoading(false));
          if (result.status === 200) {
            dispatch(setGUser(false));
            dispatch(setJWT(result.data.JWT));
            dispatch(setMail(result.data.Email));
            dispatch(setUser_ID(result.data.userId));

            // getProfile(result.data.Email)
            // getCourseCodes(result.data.JWT)

            EUSavelocal('Email', JSON.stringify(result.data.Email));
            EUSavelocal('JWT', JSON.stringify(result.data.JWT));
            EUSavelocal('User_ID', JSON.stringify(result.data.userId));

            dispatch(setLoggedIn(true));
          } else if (result.status > 200) {
            alert('Error: ' + result.message);
            console.log(result.message);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:', error);
          alert('Error: ' + error);
        });
    } else {
      dispatch(setLoading(false));
      alert('Please enter email and password properly');
    }
  };
  const EUSavelocal = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log(key + ':' + value + ' saved successfully');
    } catch (e) {
      alert('Local storage failed:' + e);
    }
  };

  const handleOtpVerify = async () => {
    dispatch(setLoading(true));
    if (ErrOTP === true) {
      dispatch(setLoading(false));
      alert('Please enter otp properly');
    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: ForgotEmail,
          code: ForgotVOtp,
          userType: 'STUDENT',
        }),
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'forgotPasswordVerifyCode', requestOptions)
        .then(response => response.json())
        .then(result => {
          dispatch(setLoading(false));
          if (result.status === 200) {
            setVerifyf(false);
            setRpass(true);
          } else if (result.status > 200) {
            console.log(result.message);
            alert('Error:' + result.message);
          }
          console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:', error);
        });
    }
  };

  const handleResetPassword = async () => {
    dispatch(setLoading(true));
    if (NewPassword !== CNewPassword) {
      dispatch(setLoading(false));
      alert('Please enter password properly');
    } else if (ErrRPass === true) {
      dispatch(setLoading(false));
      alert('Password does not match, Please enter passwords properly');
    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: ForgotEmail,
          newPassword: NewPassword,
          confirmPassword: CNewPassword,
          userType: 'STUDENT',
        }),
      };
      await fetch(BaseURL + 'resetpassword', requestOptions)
        .then(response => response.json())
        .then(result => {
          dispatch(setLoading(false));
          if (result.status === 200) {
            setRpass(false);
            setRs(true);
          } else if (result.status > 200) {
            console.log(result.message);
            alert('ResponseError:' + result.message);
          }
          // console.log(result)
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:', error);
          alert('Error:', error);
          throw new Error('error');
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Modal isOpen={loginWithNumOtp} onClose={() => setLoginWithNumOtp(false)} size="lg">
        <Modal.Content maxWidth="600">
            <Modal.CloseButton />
            <Modal.Body>
              <VStack space={3}>
                <Box safeArea flex={1} p={2} w="90%" mx="auto">
                  <VStack space={2}>
                    <Heading size="lg" fontSize="lg">
                      <Text>Verify Mobile Number</Text>
                    </Heading>
                    <Text fontSize={13} color="#8C8C8C">
                      We sent a 6 Digit OTP to +91{phNo}
                    </Text>

                    <FormControl style={styles.vinput}>
                      <Input 
                      variant="filled" 
                      width={"100%"}
                      justifyContent={"flex-end"}
                      bg="#f3f3f3"
                      mt={0.5}
                      // value={MobileNo} 
                      // ref={mobileNumberRef}
                      placeholder="Enter the OTP"
                      onChangeText={text => {
                        let ValOtpNum = OtpVal(text);
                        if (ValOtpNum === false) {
                          setErrOTP(true);
                        } else {
                          setErrOTP(false);
                          setOtp(text);
                        }
                      }}
                      borderRadius={5}
                      keyboardType="numeric" 
                      p={2}
                      style={{justifyContent:"flex-end"}}
                      />
                    </FormControl>
                    {ErrOTP === true ? (
                      <Text style={{color: '#FF0000', fontSize: 9}}>
                        {' '}
                        * Please enter the OTP properly
                      </Text>
                    ) : null}

                    <HStack style={styles.otpcount} alignItems={'center'} space={2} mt={2}>
                      <View style={styles.count}>
                        <Text style={{fontSize: 12, color: '#3e5160'}}>
                          00 : {seconds}
                        </Text>
                      </View>
                      <Button bg={'transparent'} _pressed={{bg: "transparent"}} isDisabled={resend} padding={0} onPress={()=>{
                        setSeconds(60)
                        sendOtp('+91' + phNo)
                      }}>
                        <Text disabled={resend} color={'primary.50'} style={styles.resendtext}>Resend</Text>
                      </Button>
                    </HStack>

                    <TouchableOpacity>
                      <Button
                        bg="#3e5160"
                        colorScheme="blueGray"
                        style={styles.cbutton}
                        _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                        onPress={() => verifyOtp()}>
                        Submit
                      </Button>
                    </TouchableOpacity>
                  </VStack>
                </Box>
              </VStack>
            </Modal.Body>
          </Modal.Content>
      </Modal>

        <Modal isOpen={loginWithNum} onClose={() => setLoginWithNum(false)} size="lg">
        <Modal.Content maxWidth="600">
            <Modal.CloseButton />
            <Modal.Body>
              <VStack space={3}>
                <Box safeArea flex={1} p={2} w="90%" mx="auto">
                  <VStack space={2}>
                    <Heading size="lg" fontSize="lg">
                      <Text>Mobile Number</Text>
                    </Heading>

                    <FormControl style={styles.vinput}>
                    <View>
                      <PhoneInput
                        defaultCode={`${countryCode}`}
                        layout="first"
                        textContainerStyle={{height:50, backgroundColor:"#f3f3f3",}}
                        codeTextStyle={{flex:1, height:"150%", alignSelf:"flex-start", backgroundColor:"#f3f3f3"}}
                        containerStyle={{width:"100%", backgroundColor:"#f3f3f3", color:"black", height:50, }}
                        onChangeCountry={(country)=>{
                          setCountryCode(country.cca2)
                          if(Object.keys(country.callingCode).length > 0){
                            setCallingCode(country.callingCode[0])
                          } else {
                            setCallingCode(null)
                          }
                        }}
                      />
                      <View style={{width:"100%", height:"100%", flexDirection:"row", position:"absolute"}}>
                        <View style={{width:"40%", height:'100%',  marginLeft:'60%'}}>
                          <Input 
                          variant="filled" 
                          width={"100%"}
                          justifyContent={"flex-end"}
                          bg="#f3f3f3"
                          mt={0.5}
                          // value={MobileNo} 
                          // ref={mobileNumberRef}
                          placeholder="Enter Mobile No."
                          onChangeText={text => {
                            setPhNo(text.trim())
                          }}
                          borderRadius={5}
                          keyboardType="numeric" 
                          p={2}
                          style={{justifyContent:"flex-end",height:"100%"}}
                          />
                        </View>
                      </View>
                    </View>
                    </FormControl>
                    {ErrVFMail === true ? (
                      <Text style={{color: '#FF0000', fontSize: 9}}>
                        {' '}
                        * Please enter your email properly
                      </Text>
                    ) : null}

                    <TouchableOpacity>
                      <Button
                        bg="#3e5160"
                        colorScheme="blueGray"
                        style={styles.cbutton}
                        _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                        onPress={() => phoneNoSubmit()}>
                        Submit
                      </Button>
                    </TouchableOpacity>
                  </VStack>
                </Box>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={selectMobileAccount} onClose={() => setSelectMobileAccount(false)} size="lg">
        <Modal.Content maxWidth="600">
            <Modal.CloseButton />
            <Modal.Body>
              <VStack space={3}>
                <Box safeArea flex={1} p={2} w="90%" mx="auto">
                  <VStack space={2}>
                    <Heading size="lg" fontSize="lg">
                      <Text>Mobile number login</Text>
                    </Heading>
                    <Text>Choose your account</Text>
                    {
                      mobileAccounts.map((data, index)=> {
                        return (
                          <TouchableOpacity onPress={()=>{
                            loginWithMobileNum(data)
                            // setSelectMobileAccount(false)
                          }} key={index} style={{backgroundColor:"#f3f3f3"}}>
                            <HStack alignItems="center" space={1}>
                              <IconButton icon={ <EvilIcons name={'user'} size={30} mr="2" color="#000"/> }/>
                              <VStack>
                                <Text style={{color:'#364b5b',fontWeight:'bold',fontSize:11}}>{data.email}</Text>
                                <Text style={{color:'#364b5b',fontWeight:'bold',fontSize:11}}>{data.mobileNumber}</Text>
                              </VStack>
                            </HStack>
                            <Divider/>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </VStack>
                </Box>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={showRs} onClose={() => setRs(false)} size="lg">
          <Modal.Content maxWidth="900" Width="800">
            <Modal.CloseButton />
            <Modal.Body>
              <VStack space={3}>
                <Box safeArea flex={1} p={2} w="90%" mx="auto">
                  <VStack space={2} alignItems="center">
                    <Center>
                      <Image
                        source={require('../../assets/success_tick.png')}
                        alt="success"
                        style={{height: 80, width: 80}}
                      />
                    </Center>
                    <Heading size="lg" fontSize="lg">
                      <Text>Password Reset Successful</Text>
                    </Heading>

                    <Button
                      bg="#3e5160"
                      colorScheme="blueGray"
                      style={styles.pdone}
                      _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                      onPress={() => setRs(false)}
                      mt={3}>
                      Done
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={showRpass} onClose={() => setRpass(false)} size="lg">
          <Modal.Content maxWidth="900" Width="800">
            <Modal.CloseButton />
            <Modal.Body>
              <VStack space={3}>
                <Box safeArea flex={1} p={2} w="90%" mx="auto">
                  <VStack space={1}>
                    <Heading size="lg" fontSize="lg" mb={3}>
                      <Text>Create New Password</Text>
                    </Heading>

                    <FormControl style={styles.vinput} mb={2}>
                      <Input
                        variant="filled"
                        bg="#f3f3f3"
                        placeholder="New Password"
                        type={RPShow ? 'text' : 'password'}
                        onChangeText={text => {
                          let ValText = PassVal(text);
                          if (ValText === true) {
                            setErrRNP(false);
                            if (ErrRPass === false) {
                              setNewPassword(text);
                            }
                          } else {
                            setErrRNP(true);
                          }
                        }}
                        InputRightElement={
                          <IconButton
                            icon={
                              <Icon
                                name={RPShow ? 'eye' : 'eye-off'}
                                size={20}
                                color="#000"
                              />
                            }
                            onPress={() => setRPShow(!RPShow)}
                          />
                        }
                      />
                    </FormControl>
                    {ErrRNP === true ? (
                      <Text style={{color: '#FF0000', fontSize: 9}}>
                        {' '}
                        * Your Password must have 8-16 characters,small letters,
                        capital letter, number, and a special character @ # $ %
                        ^ & *
                      </Text>
                    ) : null}
                    <FormControl style={styles.vinput} mb={3}>
                      <Input
                        variant="filled"
                        bg="#f3f3f3"
                        placeholder="Confirm New Password"
                        type={RCPShow ? 'text' : 'password'}
                        onChangeText={text => {
                          let ValText = PassVal(text);
                          if (ValText === true) {
                            setErrRCNP(false);
                            let Match = CheckRPassword(text);
                            console.log(Match);
                            if (Match === true) {
                              setErrRPass(false);
                              setCNewPassword(text);
                            } else {
                              setErrRPass(true);
                            }
                          } else {
                            setErrRCNP(true);
                          }
                        }}
                        InputRightElement={
                          <IconButton
                            icon={
                              <Icon
                                name={RCPShow ? 'eye' : 'eye-off'}
                                size={20}
                                mr="2"
                                color="#000"
                              />
                            }
                            onPress={() => setRCPShow(!RCPShow)}
                          />
                        }
                      />
                    </FormControl>
                    {ErrRCNP === true ? (
                      <Text style={{color: '#FF0000', fontSize: 9}}>
                        {' '}
                        * Your Password must have 8-16 characters,small letters,
                        capital letter, number, and a special character @ # $ %
                        ^ & *
                      </Text>
                    ) : null}

                    {ErrRPass === true ? (
                      <Text style={{color: '#FF0000', fontSize: 9}}>
                        {' '}
                        * Password doesn't match, please enter the password
                        properly.
                      </Text>
                    ) : null}

                    <Button
                      bg="#3e5160"
                      colorScheme="blueGray"
                      style={styles.cbutton}
                      _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                      onPress={() => handleResetPassword()}>
                      Create New Password
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={showForgot} onClose={() => setForgot(false)} size="lg">
          <Modal.Content maxWidth="600">
            <Modal.CloseButton />
            <Modal.Body>
              <VStack space={3}>
                <Box safeArea flex={1} p={2} w="90%" mx="auto">
                  <VStack space={2}>
                    <Heading size="lg" fontSize="lg">
                      <Text>Forgot Password</Text>
                    </Heading>

                    <FormControl style={styles.vinput}>
                      <Input
                        ref={forgotMailRef}
                        variant="filled"
                        bg="#f3f3f3"
                        placeholder="Type your Email"
                        onChangeText={text => {
                          setForgetEmailErr(false)
                          console.log(text);
                          let EVal = EmailVal(text);
                          if (EVal === true) {
                            setForgotEmail(text);
                            setErrVFMail(false);
                          } else {
                            setErrVFMail(true);
                            setForgotEmail(text);
                          }
                        }}
                      />
                    </FormControl>
                    {forgetEmailErr ? <Text style={{color: '#FF0000', fontSize: 9}}>* This feild is require!</Text> : null}
                    {ErrVFMail === true ? (
                      <Text style={{color: '#FF0000', fontSize: 9}}>
                        {' '}
                        * Please enter your email properly
                      </Text>
                    ) : null}

                    <TouchableOpacity>
                      <Button
                        bg="#3e5160"
                        colorScheme="blueGray"
                        style={styles.cbutton}
                        _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                        onPress={() => handleForgot()}>
                        Submit
                      </Button>
                    </TouchableOpacity>
                  </VStack>
                </Box>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={showVerifyf} onClose={() => setVerifyf(false)} size="lg">
          <Modal.Content maxWidth="600">
            <Modal.CloseButton />
            {/* <Modal.Header>Verificaton</Modal.Header> */}
            <Modal.Body>
              <VStack space={3}>
                <Box safeArea flex={1} p={2} w="90%" mx="auto">
                  <VStack space={2}>
                    <Heading size="lg" fontSize="lg">
                      <Text>Verify its You </Text>
                    </Heading>
                    <Heading
                      size="xs"
                      _text={{color: 'coolGray.600'}}
                      fontWeight="100"
                      fontSize="12"
                      ml={1}>
                      <Text
                        color="#000"
                        style={{fontSize: 11, fontWeight: '600'}}>
                        We sent 6 Digit OTP to {emailAbs}
                      </Text>
                    </Heading>
                    <FormControl style={styles.vinput}>
                      <Input
                        autoComplete="off"
                        textContentType="none"
                        variant="filled"
                        bg="#f3f3f3"
                        placeholder="Enter 6 Digit OTP"
                        onChangeText={text => {
                          let ValOtpNum = OtpVal(text);
                          if (ValOtpNum === false) {
                            setErrOTP(true);
                          } else {
                            setErrOTP(false);
                            setForgotVOtp(text);
                          }
                        }}
                      />
                    </FormControl>
                    {ErrOTP === true ? (
                      <Text style={{color: '#FF0000', fontSize: 9}}>
                        {' '}
                        * Please enter the OTP properly.
                      </Text>
                    ) : null}
                    <HStack style={styles.otpcount} space={2}>
                      <View style={styles.count}>
                        <Text style={{fontSize: 12, color: '#3e5160'}}>
                          00 : {time}
                        </Text>
                      </View>
                      <Link style={styles.resendbtn}>
                        <TouchableOpacity
                          onPress={() => {
                            setVerifyf(false);
                            handleForgot();
                          }}
                          disabled={resend}>
                          <Text style={styles.resendtext}>Resend</Text>
                        </TouchableOpacity>
                      </Link>
                    </HStack>
                    <TouchableOpacity>
                      <Button
                        bg="#3e5160"
                        style={styles.cbutton}
                        _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                        onPress={() => handleOtpVerify()}>
                        Verify
                      </Button>
                    </TouchableOpacity>
                  </VStack>
                </Box>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Center w="100%">
          <Box safeArea p="2" w="90%" maxW="350" py="10">
            <Heading
              size="md"
              color="coolGray.800"
              _dark={{color: 'warmGray.50'}}
              fontWeight="semibold">
              Welcome Back
            </Heading>
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'muted.700',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  Email
                </FormControl.Label>
                <Input
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Enter your email"
                  onChangeText={text => {
                    let EVal = EmailVal(text);
                    if (EVal === true) {
                      setEmail(text);
                      setErrEmail(false);
                    } else {
                      setEmail(text);
                      setErrEmail(true);
                    }
                  }}
                />
              </FormControl>
              {ErrEmail === true ? (
                <Text style={{color: '#FF0000', fontSize: 9}}>
                  {' '}
                  * Please enter your email properly
                </Text>
              ) : null}
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'muted.700',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  Password
                </FormControl.Label>
                <Input
                  onChangeText={text => {
                    let PVal = PassVal(text);
                    if (PVal === true) {
                      setPass(text);
                      setErrPassword(false);
                    } else {
                      setPass(text);
                      setErrPassword(true);
                    }
                  }}
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
                />
              </FormControl>
              {ErrPassword === true ? (
                <Text style={{color: '#FF0000', fontSize: 9}}>
                  {' '}
                  * Your Password must have 8-16 characters,small letters,
                  capital letter, number, and a special character @ # $ % ^ & *
                </Text>
              ) : null}

              <TouchableOpacity>
                <Link
                  onPress={() => setForgot(true)}
                  alignSelf="flex-end"
                  mb={3}>
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </Link>
              </TouchableOpacity>

              <VStack space={1}>
                <Button
                  mt="2"
                  colorScheme="primary"
                  onPress={() => handleLogin()}>
                  Login
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
                    onPress={() => onGoogleButtonPress()}>
                    <HStack
                      space={2}
                      justifyContent="center"
                      alignItems="center">
                      <Image
                        source={require('../../assets/Social/google-logo.png')}
                        style={styles.googleimg}
                        alt="Google Logo"
                      />
                      <Text style={styles.googletext} mt={1}>
                        Log In with Google
                      </Text>
                    </HStack>
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Button bg="white.100" disabled={GoogleSubmit} mb={4} onPress={() => setLoginWithNum(true)}
                    _pressed={{ bg: 'white.100', _text: { color: '#ffffff', }, }} style={styles.google} >
                    <HStack space={2} justifyContent="center" alignItems="center">
                      <Image source={require('../../assets/ACSettings/ChangeNumber.png')} style={styles.googleimg} alt="Mobile Logo"/>
                      <Text style={styles.googletext} mt={1}>Log In with Mobile</Text>
                    </HStack>
                  </Button>
                </TouchableOpacity>
              </VStack>
              <VStack alignItems="center" mt={5} space={2}>
                <Text fontSize="sm" style={styles.doac}>
                  Don't Have an Account ?
                </Text>
                <TouchableOpacity>
                  <Button
                    _text={{
                      color: '#3e5160',
                      bold: true,
                      fontSize: '17',
                    }}
                    bg="#fcfcfc"
                    _pressed={{bg: '#3c5060', _text: {color: '#fcfcfc'}}}
                    onPress={() => navigation.navigate('CreateAccount')}
                    // variant="ghost"
                  >
                    Create Account
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

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfcfc',
    height: height,
    width: width,
  },
  google: {
    borderColor: '#3e5160',
    color: '#3e5160',
    borderWidth: 1,
    borderRadius: 7,
  },
  googleimg: {
    width: 25,
    height: 25,
  },
  googletext: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  forgot: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3e5160',
  },
  vinput: {
    maxWidth: width / 1,
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
