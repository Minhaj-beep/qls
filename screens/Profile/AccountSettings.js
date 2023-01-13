import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Navbar from '../components/Navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {
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
  Container,
  Center,
  Spacer,
  IconButton,
  Modal,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseURL} from '../StaticData/Variables';
import {
  isNumeric,
  PassVal,
  EmailVal,
  OtpVal,
  MobileVal,
  TextVal,
} from '../Functions/Validations';
import {setLoggedIn, setLoading, setMail} from '../Redux/Features/authSlice';
import {DeactivateAccount} from '../Functions/API/DeactivateAccount';
import {GetStudentByEmail} from '../Functions/API/GetStudentByEmail';
import moment from 'moment';

const {width, height} = Dimensions.get('window');

const AccountSettings = ({navigation}) => {
  const OEmail = useSelector(state => state.Auth.Mail);
  // console.log(OEmail);
  const GUser = useSelector(state => state.Auth.GUser);
  const dispatch = useDispatch();

  const AppBarContent = {
    title: 'Account Settings',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };
  const ClearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      alert('Local storage error AppBarContent: ' + e);
    }
  };

  const [CEmail, setCEmail] = useState(OEmail);
  const [showCE, setShowCE] = useState(false);
  const [verifyEC, setVerifyEC] = useState(false);
  const [SuccessEC, setSuccessEC] = useState(false);
  const [ErrorEC, setErrorEC] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [SuccessCP, setSuccessCP] = useState(false);
  const [showDA, setShowDA] = useState(false);
  const [verifyDA, setVerifyDA] = useState(false);
  const [SuccessDA, setSuccessDA] = useState(false);
  const [NEmail, setNEmail] = useState('');
  const [VCECode, setVCECode] = useState('');
  const [ErrNEmail, setErrNEmail] = useState(false);
  const [ErrVCECode, setErrVCECode] = useState(false);
  const [CPass, setCPass] = useState('');
  const [NPass, setNPass] = useState('');
  const [CNPass, setCNPass] = useState('');
  const [ErrCPass, setErrCPass] = useState('');
  const [ErrNPass, setErrNPass] = useState('');
  const [ErrCNPass, setErrCNPass] = useState('');
  const [CPmatch, setCPmatch] = useState(false);
  const [VDACode, setVDACode] = useState('');
  const [ErrVDACode, setErrVDACode] = useState('');
  const [resend, setresend] = useState(true);
  const [VerifyAuth, setVerifyAuth] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [showNPass, setShowNPass] = useState(false);
  const [showCNPass, setShowCNPass] = useState(false);
  const [time, setTime] = useState(60);
  const timerRef = useRef(time);
  const [emailAbs, setemailAbs] = useState('');
  const [Deactivated, setDeactivated] = useState(false);
  const [RemaingDay, setRemaingDay] = useState();

  useEffect(()=>{
    CheckDeactivate();
  },[]);

  useEffect(()=> {MatchPassword()}, [NPass, CNPass])

  const CheckDeactivate = async() => {
    try {
      let response = await GetStudentByEmail(OEmail);
      if ( response.status === 200){
        let UserInfo = response.data;
        setDeactivated(UserInfo.deactivateReqRaised);
        let CompletionDate = moment(UserInfo.deactivateCompletionDate).format('DD MMM YYYY, hh:mm a');
        setRemaingDay(CompletionDate);
      } else {
        alert("Error CheckDeactivate: " + response.message);
        console.log("Error CheckDeactivate: " + response.message);
      }
    } catch (err) {
      alert("Error CheckDeactivate: " + err.message);
      console.log("Error CheckDeactivate: " + err.message);
    }
  };

  const emailAbstract = mail => {
    let email = mail;
    let email_sub = email.substring(0, 2);
    let email_abstract =
      email_sub + '***' + email.substring(email.length - 4, email.length);
    setemailAbs(email_abstract);
  };

  const MatchPassword = () => {
    if (CNPass === NPass) {
      setCPmatch(false);
    } else {
      setCPmatch(true);
    }
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

  const ChangeEmail = async () => {
    dispatch(setLoading(true));
    if (NEmail === '' || OEmail === '' || ErrNEmail !== false) {
      alert('Please enter the New email properly');
    } else {
      setresend(true);
      emailAbstract(NEmail);
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: OEmail,
          gmailusertype: 'STUDENT',
        },
        body: JSON.stringify({
          email: OEmail,
          newemail: NEmail,
        }),
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'changeStudentEmail', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setShowCE(false);
            setTime(60);
            timerRef.current = 60;
            setOTPTimer();
            setVerifyEC(true);
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error ChangeEmail: ' + result.message);
            console.log('Error ChangeEmail: ' + result);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error ChangeEmail: ' + error);
          alert('Error ChangeEmail: ' + error);
        });
    }
    dispatch(setLoading(false));
  };

  const VerifyCodeCE = async () => {
    dispatch(setLoading(true));
    if (VCECode === '') {
      alert('Please enter the OTP properly');
    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: OEmail,
          gmailusertype: 'STUDENT',
        },
        body: JSON.stringify({
          code: VCECode,
          oldEmail: OEmail,
          newEmail: NEmail,
        }),
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'changeStudentEmailVerifyCode', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setVerifyEC(false);
            setCEmail(NEmail);
            setSuccessEC(true);
            dispatch(setMail(NEmail));
            ClearLocalStorage();
            dispatch(setLoggedIn(false));
            dispatch(setLoading(false));
            console.log(result);
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error VerifyCodeCE: ' + result.message);
            console.log('Error VerifyCodeCE: ' + result);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error VerifyCodeCE: ' + error);
          alert('Error VerifyCodeCE: ' + error);
        });
    }
    dispatch(setLoading(false));
  };

  const ChangePassword = async () => {
    dispatch(setLoading(true));
    if (
      CPmatch === true ||
      ErrNPass === true ||
      ErrCNPass === true ||
      CPass === ''
    ) {
      alert('Please enter the details properly');
    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: CEmail,
          gmailusertype: 'STUDENT',
        },
        body: JSON.stringify({
          currentPassword: CPass,
          newPassword: NPass,
          confirmPassword: CNPass,
        }),
      };
      await fetch(BaseURL + 'resetStudentPassword', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setShowCP(false);
            setTime(60);
            timerRef.current = 60;
            setOTPTimer();
            setSuccessCP(true);
            dispatch(setLoading(false));
            console.log(result);
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error ChangePassword: ' + result.message);
            console.log('Error ChangePassword: ' + result);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error ChangePassword: ' + error);
          alert('Error ChangePassword: ' + error);
        });
    }
    dispatch(setLoading(false));
  };

  const DeleteAccount = async () => {
    dispatch(setLoading(true));
    if (CEmail === '') {
      alert('Something went wrong, please login again and try!');
    } else {
      setresend(true);
      emailAbstract(CEmail);
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: CEmail,
          gmailusertype: 'STUDENT',
        },
        body: JSON.stringify({
          email: CEmail,
        }),
      };
      await fetch(BaseURL + 'deleteStudent', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setShowDA(false);
            setTime(60);
            timerRef.current = 60;
            setOTPTimer();
            setVerifyDA(true);
            dispatch(setLoading(false));
            console.log(result);
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error DeleteAccount: ' + result.message);
            console.log('Error DeleteAccount: ' + result);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error DeleteAccount: ' +  error);
          //  alert('Error DA: ' + error);
        });
    }
    dispatch(setLoading(false));
  };

  const VerifyDelete = async () => {
    dispatch(setLoading(true));
    if (CEmail === '') {
      alert('Something went wrong, please login again and try!');
    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: CEmail,
          gmailusertype: 'STUDENT',
        },
        body: JSON.stringify({
          code: VDACode,
        }),
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'deleteStudentVerifyCode', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            ClearLocalStorage();
            setVerifyDA(false);
            setSuccessDA(true);
            dispatch(setLoading(false));
            console.log(result);
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error VerifyDelete: ' + result.message);
            console.log('Error VerifyDelete: ' + result);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error VerifyDelete: ' + error);
          alert('Error VerifyDelete: ' + error);
        });
    }
    dispatch(setLoading(false));
  };

  const DELAccount = async() => {
    try {
      let response = await DeactivateAccount(OEmail);
      if (response.status === 200) {
        let CurrentDate = moment();
        let Day = moment(CurrentDate).add(5, 'days');
        let Date = moment(Day).format('DD MMM YYYY');
        setRemaingDay(Date);
        setDeactivated(true);
        setShowDA(false);
        setSuccessDA(true);
      } else {
        setDeactivated(false);
        console.log('Error DELAccount:' + response.message);
        alert('Error DELAccount:' + response.message);
        setShowDA(false);
      }
    } catch (error) {
      console.log('Error deactivate DELAccount:' + error.message);
      alert('Error deactivate DELAccount:' + error.message);
      setShowDA(false);
    }
  };

  return (
    <ScrollView style={styles.topContainer}>
      <SafeAreaView>
        <Navbar props={AppBarContent} />

        <Modal isOpen={showCE} onClose={() => setShowCE(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                <Heading size="md">
                  <Text>Change Email</Text>
                </Heading>

                <FormControl style={{Width: width / 1}}>
                  <Input
                    variant="filled"
                    bg="#f3f3f3"
                    placeholder="Type New Email"
                    onChangeText={text => {
                      const Err = EmailVal(text);
                      console.log(Err);
                      if (Err === true) {
                        let email = text.toLowerCase();
                        setErrNEmail(false);
                        setNEmail(email);
                      } else {
                        setErrNEmail(true);
                        // console.log(ErrNEmail);
                      }
                    }}
                  />
                </FormControl>
                {ErrNEmail === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    {' '}
                    * Please enter your email properly
                  </Text>
                ) : null}
                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{paddingTop: 10, paddingBottom: 10}}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => ChangeEmail()}>
                  Change Email
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={verifyEC} onClose={() => setVerifyEC(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                <VStack>
                  <Text fontSize="md" style={{fontWeight: 'bold'}}>
                    Verify it's You
                  </Text>
                  <Text fontSize={13} color="#8C8C8C">
                    We sent a 6 Digit OTP
                  </Text>
                </VStack>
                <FormControl style={{Width: width / 1}}>
                  <Input
                    variant="filled"
                    bg="#f3f3f3"
                    placeholder="Enter 6 Digit OTP"
                    onChangeText={text => {
                      let Err = OtpVal(text);
                      if (Err !== true) {
                        setErrVCECode(true);
                      } else {
                        setErrVCECode(false);
                        setVCECode(text);
                      }
                    }}
                  />
                </FormControl>
                {ErrVCECode === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    {' '}
                    * Please enter the OTP properly.
                  </Text>
                ) : (
                  <Text style={{fontSize: 1}}> </Text>
                )}

                <HStack style={styles.otpcount} space={2}>
                  <View style={styles.count}>
                    <Text style={{fontSize: 12, color: '#3e5160'}}>
                      00 : {time}
                    </Text>
                  </View>
                  <View style={styles.resendbtn}>
                    <TouchableOpacity
                      onPress={() => {
                        setVerifyEC(false);
                        setVerifyAuth(false);
                        ChangeEmail();
                      }}
                      disabled={resend}>
                      <Text
                        style={
                          resend === true
                            ? styles.resendtext
                            : styles.resendtextActive
                        }
                        // style={[styles.Verifybtn, {opacity: resend ? 1 : 0.7}]}
                      >
                        Resend
                      </Text>
                    </TouchableOpacity>
                  </View>
                </HStack>

                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={[styles.Verifybtn, {opacity: resend ? 1 : 0.7}]}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => VerifyCodeCE()}
                  disabled={VerifyAuth}>
                  Verify
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={SuccessEC} onClose={() => setSuccessEC(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack
                safeArea
                flex={1}
                p={2}
                w="90%"
                mx="auto"
                space={5}
                justifyContent="center"
                alignItems="center">
                <Image
                  source={require('../../assets/success_tick.png')}
                  resizeMode="contain"
                  size="md"
                  alt="successful"
                />

                <Text fontWeight="bold" fontSize="17">
                  Verification Successfull
                </Text>

                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 40,
                    paddingRight: 40,
                  }}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => setSuccessEC(false)}>
                  Done
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={ErrorEC} onClose={() => setErrorEC(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack
                safeArea
                flex={1}
                p={2}
                w="100%"
                mx="auto"
                space={4}
                justifyContent="center"
                alignItems="center">
                <Image
                  source={require('../../assets/ErrorPNG.png')}
                  resizeMode="contain"
                  width={200}
                  height={200}
                  alt="successful"
                />

                <Text fontWeight="bold" fontSize="17">
                  An Error Occured! Try Again
                </Text>

                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 40,
                    paddingRight: 40,
                  }}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => {
                    setErrorEC(false);
                    setShowCE(true);
                  }}>
                  Try Again
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={showCP} onClose={() => setShowCP(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={1}>
                <Heading size="md" mb={4}>
                  <Text>Change Password</Text>
                </Heading>

                <FormControl style={{Width: width / 1}}>
                  <Input
                    variant="filled"
                    bg="#f3f3f3"
                    type={showCPass ? 'text' : 'password'}
                    placeholder="Current Password"
                    onChangeText={text => {
                      let Err = PassVal(text);
                      if (Err !== true) {
                        setErrCPass(true);
                      } else {
                        setErrCPass(false);
                        setCPass(text);
                      }
                    }}
                    InputRightElement={
                      <IconButton
                        icon={<Icon name={showCPass ? 'eye' : 'eye-off'} size={15}/>}
                        size={6}
                        mr="2"
                        color="muted.400"
                        onPress={() => setShowCPass(!showCPass)}
                      />
                    }
                  />
                </FormControl>
                {ErrCPass === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    {' '}
                    * Your Password must have 8-16 characters,small letters,
                    capital letter, number, and a special character @ # $ % ^ &
                    *
                  </Text>
                ) : (
                  <Text style={{fontSize: 1}}> </Text>
                )}
                <FormControl style={{Width: width / 1}}>
                  <Input
                    variant="filled"
                    bg="#f3f3f3"
                    type={showNPass ? 'text' : 'password'}
                    placeholder="New Password"
                    onChangeText={text => {
                      let Err = PassVal(text);
                      if (Err !== true) {
                        setErrNPass(true);
                        MatchPassword();
                        setNPass(text);
                      } else {
                        MatchPassword();
                        setErrNPass(false);
                        setNPass(text);
                      }
                    }}
                    InputRightElement={
                      <IconButton
                        icon={<Icon name={showNPass ? 'eye' : 'eye-off'} size={15}/>}
                        size={6}
                        mr="2"
                        color="muted.400"
                        onPress={() => setShowNPass(!showNPass)}
                      />
                    }
                  />
                </FormControl>
                {ErrNPass === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    {' '}
                    * Your Password must have 8-16 characters,small letters,
                    capital letter, number, and a special character @ # $ % ^ &
                    *
                  </Text>
                ) : (
                  <Text style={{fontSize: 1}}> </Text>
                )}
                <FormControl style={{Width: width / 1}}>
                  <Input
                    variant="filled"
                    bg="#f3f3f3"
                    type={showCNPass ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    onChangeText={text => {
                      let Err = PassVal(text);
                      if (Err !== true) {
                        setErrCNPass(true);
                        setCNPass(text);
                        MatchPassword();
                      } else {
                        setCNPass(text);
                        MatchPassword();
                        setErrCNPass(false);
                      }
                    }}
                    InputRightElement={
                      <IconButton
                        icon={<Icon name={showCNPass ? 'eye' : 'eye-off'} size={15}/>}
                        size={6}
                        mr="2"
                        color="muted.400"
                        onPress={() => setShowCNPass(!showCNPass)}
                      />
                    }
                  />
                </FormControl>
                {ErrCNPass === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    {' '}
                    * Your Password must have 8-16 characters,small letters,
                    capital letter, number, and a special character @ # $ % ^ &
                    *
                  </Text>
                ) : (
                  <Text style={{fontSize: 1}}> </Text>
                )}
                {CPmatch === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    *Passwords does not match
                  </Text>
                ) : (
                  <Text style={{fontSize: 1}}> </Text>
                )}
                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{paddingTop: 10, paddingBottom: 10}}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() =>
                    // setShowCP(false);
                    // setSuccessCP(true);
                    ChangePassword()
                  }>
                  Change Password
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={SuccessCP} onClose={() => setSuccessCP(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack
                safeArea
                flex={1}
                p={2}
                w="90%"
                mx="auto"
                space={5}
                justifyContent="center"
                alignItems="center">
                <Image
                  source={require('../../assets/success_tick.png')}
                  resizeMode="contain"
                  size="md"
                  alt="successful"
                />

                <Text fontWeight="bold" fontSize="17">
                  Verification Successfull
                </Text>

                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 40,
                    paddingRight: 40,
                  }}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => setSuccessCP(false)}>
                  Done
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={showDA} onClose={() => setShowDA(false)} size="lg">
          <Modal.Content maxWidth="1000" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack
                safeArea
                flex={1}
                p={2}
                w="90%"
                mx="auto"
                space={6}
                justifyContent="center"
                alignItems="center">
                <Image
                  source={require('../../assets/delete-user.png')}
                  resizeMode="contain"
                  size="md"
                  alt="successful"
                />

                <Text fontWeight="bold" fontSize="17">
                  Are you sure you want to delete this account?
                </Text>

                <HStack space={3} mb={2}>
                  <Button
                    bg="#ebebeb"
                    _text={{color: '#8C8C8C'}}
                    style={{paddingLeft: 40, paddingRight: 40}}
                    _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                    onPress={() => setShowDA(false)}>
                    Cancel
                  </Button>

                  <Button
                    bg="#3e5160"
                    colorScheme="blueGray"
                    // style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                    _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                    // onPress={() => DeleteAccount()}
                    onPress={()=> DELAccount()}
                    >
                    Yes, Deactivate Account
                  </Button>
                </HStack>
                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal isOpen={verifyDA} onClose={() => setVerifyDA(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                <VStack>
                  <Text fontSize="md" style={{fontWeight: 'bold'}}>
                    Verify it's You
                  </Text>
                  <Text fontSize={13} color="#8C8C8C">
                    We send 6 Digit OTP to {emailAbs}
                  </Text>
                </VStack>
                <FormControl style={{Width: width / 1}}>
                  <Input
                    variant="filled"
                    bg="#f3f3f3"
                    placeholder="Enter 6 Digit OTP"
                    onChangeText={text => {
                      let Err = isNumeric(text);
                      if (text.length < 6 || Err === false) {
                        setErrVDACode(true);
                      } else {
                        setErrVDACode(false);
                        setVDACode(text);
                      }
                    }}
                  />
                </FormControl>
                {ErrVDACode === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    {' '}
                    * Please enter the OTP properly.
                  </Text>
                ) : (
                  <Text style={{fontSize: 1}}> </Text>
                )}

                <HStack style={styles.otpcount} space={2}>
                  <View style={styles.count}>
                    <Text style={{fontSize: 12, color: '#3e5160'}}>
                      00 : {time}
                    </Text>
                  </View>
                  <Link style={styles.resendbtn}>
                    <TouchableOpacity
                      onPress={() => {
                        setVerifyDA(false);
                        DeleteAccount();
                        setVerifyAuth(false);
                      }}
                      disabled={resend}>
                      <Text
                        // style={styles.resendtext}
                        style={
                          resend === true
                            ? styles.resendtext
                            : styles.resendtextActive
                        }>
                        Resend
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </HStack>

                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={[styles.Verifybtn, {opacity: resend ? 1 : 0.7}]}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => VerifyDelete()}
                  disabled={VerifyAuth}>
                  Verify
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Modal
          isOpen={SuccessDA}
          onClose={() => {
            setSuccessDA(false);
            // dispatch(setLoggedIn(false));
          }}
          size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack
                safeArea
                flex={1}
                p={2}
                w="90%"
                mx="auto"
                space={6}
                justifyContent="center"
                alignItems="center">
                <Image
                  source={require('../../assets/delete-user.png')}
                  resizeMode="contain"
                  size="md"
                  alt="successful"
                />

                <Text fontWeight="bold" fontSize="17" width={width / 3.5}>
                  Account Successfully Deleted! If you wish to Re-activate, please raise a ticket in the Help & support!
                </Text>

                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 40,
                    paddingRight: 40,
                  }}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => {
                    // dispatch(setLoggedIn(false));
                    setSuccessDA(false);
                  }}>
                 Done
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <VStack pl={4} pr={4} pt={8}>
          <VStack space={10}>
            {GUser === false ? (
              <VStack space={10}>
                <HStack justifyContent="space-between" alignItems="center">
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    space={3}>
                    <Image
                      alt="EmailAddress"
                      source={require('../../assets/ACSettings/MailSettings.png')}
                      size={12}
                      resizeMode="contain"
                    />
                    <VStack>
                      <Text fontSize="md" style={{fontWeight: 'bold'}}>
                        Email Address
                      </Text>
                      <Text
                        fontWeight="500"
                        color="#8C8C8C"
                        style={{maxWidth: width / 2.5}}>
                        {OEmail}
                      </Text>
                    </VStack>
                  </HStack>

                  <Button
                    bg="#3e5160"
                    colorScheme="blueGray"
                    style={{width: width / 4}}
                    _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                    onPress={() => setShowCE(true)}>
                    Change
                  </Button>
                </HStack>

                <HStack justifyContent="space-between" alignItems="center">
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    space={3}>
                    <Image
                      alt="EmailAddress"
                      source={require('../../assets/ACSettings/PasswordSettings.png')}
                      size={12}
                      resizeMode="contain"
                    />
                    <VStack>
                      <Text fontSize="md" style={{fontWeight: 'bold'}}>
                        Password
                      </Text>
                      <Text
                        fontWeight="500"
                        color="#8C8C8C"
                        style={{maxWidth: width / 2.5}}>
                        ***********************
                      </Text>
                    </VStack>
                  </HStack>

                  <Button
                    bg="#3e5160"
                    colorScheme="blueGray"
                    style={{width: width / 4}}
                    _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                    onPress={() => setShowCP(true)}>
                    Change
                  </Button>
                </HStack>
              </VStack>
            ) : null}

            <HStack justifyContent="space-between" alignItems="center">
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={3}>
                <Image
                  alt="EmailAddress"
                  source={require('../../assets/ACSettings/AccountActivity.png')}
                  size={12}
                  resizeMode="contain"
                />
                <VStack>
                  <Text fontSize="md" style={{fontWeight: 'bold'}}>
                    Account Activity
                  </Text>
                  <Text
                    fontWeight="500"
                    color="#8C8C8C"
                    style={{maxWidth: width / 2.5}}>
                    Log in Alert
                  </Text>
                </VStack>
              </HStack>

              <Button
                bg="#3e5160"
                colorScheme="blueGray"
                style={{width: width / 4}}
                _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                onPress={() => navigation.navigate('AccountActivity')}>
                View
              </Button>
            </HStack>

            <HStack justifyContent="space-between" alignItems="center">
              <HStack
                justifyContent="space-between"
                space={3}>
                <Image
                  alt="EmailAddress"
                  source={require('../../assets/ACSettings/DeleteAccount.png')}
                  size={12}
                  resizeMode="contain"
                />
                <VStack>
                  <Text fontSize="md" style={{fontWeight: 'bold'}}>
                    Deactivate Account
                  </Text>
                  <Text
                    fontWeight="500"
                    color="#8C8C8C"
                    style={{maxWidth: width / 2.5}}>
                  {Deactivated ?  'your account Will be deactivated by ' + RemaingDay : 'Permanently.'}
                  </Text>
                </VStack>
              </HStack>

              <Button
                bg="#3e5160"
                colorScheme="blueGray"
                style={{width: width / 4}}
                _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                onPress={() => {
                  if (Deactivated !== true) {
                    setShowDA(true);
                  } else {
                    alert('Deactivation has already been requested!')
                  }
                  }}>
                Deactivate
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    top: 0,
    backgroundColor: '#f5f5f5',
    height: height,
    width: width,
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
  resendtextActive: {
    fontSize: 12,
    color: '#3e5160',
    fontWeight: 'bold',
  },
  Verifybtn: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default AccountSettings;
