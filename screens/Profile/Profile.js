import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Heading,
  Image,
  Select,
  TextArea,
  Input,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  FormControl,
  IconButton,
  Modal,
} from 'native-base';
import Navbar from '../components/Navbar';
import {TextVal, MobileVal} from '../Functions/Validations';
import Icon from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import {useDispatch, useSelector} from 'react-redux';
import {BaseURL} from '../StaticData/Variables';
import {
  setProfileImg,
  setMail,
  setProfileData,
  setJWT,
  setLoggedIn,
  setGUser,
  setLoading,
} from '../Redux/Features/authSlice';
import {phone} from 'phone';

const {width, height} = Dimensions.get('window');

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const Email = useSelector(state => state.Auth.Mail);
  const phoneInput = useRef(null);
  const PHno = ProfileD.mobileNumber;
  const Mnum = PHno ? PHno.slice(2) : 0;
  const AppBarContent = {
    title: 'Profile',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };
  const [FirstName, setFirstName] = useState('');
  const [MiddleName, setMiddleName] = useState('');
  const [LastName, setLastName] = useState('');
  const [About, setAbout] = useState('');
  const [Language, setLanguage] = useState('');
  const [MobileNo, setMobileNo] = useState(Mnum);
  const [FormattedPhone, setFormattedPhone] = useState(ProfileD.mobileNumber);
  const [facebook, setfacebook] = useState('');
  const [instagram, setinstagram] = useState('');
  const [linkedin, setlinkedin] = useState('');
  const [twitter, settwitter] = useState('');
  const [ErrFirstName, setErrFirstName] = useState(false);
  const [ErrLastName, setErrLastName] = useState(false);
  const [ErrAbout, setErrAbout] = useState(false);
  const [ErrMobileNo, setErrMobileNo] = useState(false);
  const [showSaved, setSaved] = useState(false);
  const [load, setLoad] = useState(true)
  // const [PhoneCountrycode, setPhoneCountrycode] = useState('IN');
  const [countryCode, setCountryCode] = useState('')
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const mobileNumberRef = useRef()
  const aboutStudentRef = useRef()
  const languageRef = useRef()

  useEffect(()=>{console.log(About)},[])

  const GetProfileD = async () => {
    dispatch(setLoading(true));
    if (Email === '') {
      dispatch(setLoading(false));
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
            token: Email,
          },
        };
        await fetch(BaseURL + 'getStudentByEmail?email=' + Email, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            dispatch(setProfileData(result.data));
            updateProfileData(result.data);
            console.log('___________________________________', Email)
            console.log("Thsi the entire data: ", result.data);
            // let DD = result.data;
            // let Mnum = DD.mobileNumber;
            // let PHno = Mnum.slice(3);
            // setMobileNo(PHno);
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error GetProfileD: 1 ' + result.message);
            console.log('Error GetProfileD: 1 ' + result);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error GetProfileD: 2 ' + error);
          alert('Error GetProfileD: 2 ' + error);
        });
    }
  };

  const updateProfileData = PData => {
    // console.log("This is the about :", PData.aboutStudent);
    // console.log("This is the about :", PData);
    setFirstName(PData.firstName);
    setLastName(PData.lastName);
    setMiddleName(PData.middleName);
    setAbout(PData.aboutYou);
    setfacebook(PData.facebook);
    setinstagram(PData.instagram);
    setlinkedin(PData.linkedin);
    settwitter(PData.twitter);
    setMobileNo(PData.mobileNumber);
    if(PData.hasOwnProperty('mobileNumber') && PData.mobileNumber.match(/\W/)){
      const splitted = PData.mobileNumber.split("+")
      setMobileNo(splitted[1])
      setCountryCode(splitted[0])
    } else {
      setMobileNo(PData.mobileNumber) 
    }
    // setLanguage()
    setLoad(false)
  };

  const updateProfile = async () => {
    console.log('saving changes');
    if (
      ErrAbout === true ||
      About === '' ||
      ErrFirstName === true ||
      ErrLastName === true ||
      MobileNo === '' ||
      FirstName === '' ||
      LastName === '' ||
      ErrMobileNo === true
    ) {
      console.log(MobileNo)
      // alert('Please fill the details properly!');
      if(ErrFirstName || FirstName ===''){
        firstNameRef.current.focus()
      } else if (ErrLastName || LastName === ''){
        lastNameRef.current.focus()
      } else if (MobileNo === ''){
        mobileNumberRef.current.focus()
      } else if (ErrAbout || About === '') {
        aboutStudentRef.current.focus()
      } else if (Language === ''){
        languageRef.current.focus()
      }
    } else {
      console.log(About)
      const requestOptions = {
        method: 'POST',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':Jwt_Token,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'INSTRUCTOR',
          token: ProfileD.email,
        },
        body: JSON.stringify({
          firstName: FirstName,
          middleName: MiddleName,
          lastName: LastName,
          aboutStudent: About,
          facebook: facebook,
          instagram: instagram,
          linkedin: linkedin,
          twitter: twitter,
          mobileNumber: countryCode + '+' + MobileNo,
          language: Language,
        }),
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'createStudent', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setSaved(true);
            console.log(result.data);
          } else if (result.status > 200) {
            alert('Error updateProfile: ' + result.message);
            console.log('Error updateProfile: ' + result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          console.log('Error updateProfile:' + error);
          alert('Error updateProfile: ' + error);
        });
    }
  };

  useEffect(() => {
    GetProfileD();
    // console.log(ProfileD);
    // updateProfileData(ProfileD)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [0]);

  return (
    <View style={styles.container}>
      <Navbar props={AppBarContent} />
      {load ? 
        <></>
        :
      <>
      <Modal isOpen={showSaved} onClose={() =>{
        GetProfileD();
        setSaved(false);
        }} size="lg">
        <Modal.Content maxWidth="900" maxheight="300" borderRadius={20}>
          <Modal.CloseButton />
          <Modal.Body>
            <VStack>
              <Box safeArea w="100%" mx="auto">
                <VStack space={2} flex={1} alignItems="center">
                  <Image
                    resizeMode="contain"
                    source={require('../../assets/success_tick02.png')}
                    alt="Success"
                    style={{height: 150, width: 150}}
                  />
                  <Heading size="lg" fontSize="lg">
                    <Text>Change Saved</Text>
                  </Heading>
                  <Button
                    bg="#3e5160"
                    colorScheme="blueGray"
                    style={styles.cbutton}
                    _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                    onPress={() => {
                      // getProfile(email)
                      GetProfileD();
                      setSaved(false);
                    }}>
                    Done
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.TopContainer}
        nestedScrollEnabled={true}>
        <VStack p={5} space={3}>
          <FormControl isRequired>
            <FormControl.Label
              _text={{
                color: '#000',
                fontSize: 'sm',
                fontWeight: 600,
              }}
              mb={3}>
              First Name
            </FormControl.Label>
            <Input
              variant="filled"
              bg="#f3f3f3"
              ref={firstNameRef}
              placeholder="Enter First Name"
              borderRadius={7}
              onChangeText={text => {
                let ValT = TextVal(text);
                if (ValT === true) {
                  setErrFirstName(false);
                  setFirstName(text);
                } else {
                  setErrFirstName(true);
                  setFirstName(text);
                }
              }}
              value={FirstName}
            />
          </FormControl>
          {ErrFirstName === true ? (
            <Text style={{color: '#FF0000', fontSize: 9}}>
              {' '}
              * Please enter your First Name
            </Text>
          ) : null}
          <FormControl>
            <FormControl.Label
              _text={{
                color: '#000',
                fontSize: 'sm',
                fontWeight: 600,
              }}
              mb={3}>
              Middle Name  <Text style={{fontSize: 10, color: '#8C8C8C'}}>(Optional)</Text>
            </FormControl.Label>
            <Input
              variant="filled"
              bg="#f3f3f3"
              placeholder="Enter Middle Name"
              borderRadius={7}
              onChangeText={text => {
                let ValT = TextVal(text);
                if (ValT === true) {
                  setMiddleName(text);
                } else {
                  setMiddleName(text);
                }
              }}
              value={MiddleName}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label
              _text={{
                color: '#000',
                fontSize: 'sm',
                fontWeight: 600,
              }}
              mb={3}>
              Last Name
            </FormControl.Label>
            <Input
              variant="filled"
              bg="#f3f3f3"
              ref={lastNameRef}
              placeholder="Enter Last Name"
              borderRadius={7}
              onChangeText={text => {
                let ValT = TextVal(text);
                if (ValT === true) {
                  setLastName(text);
                  setErrLastName(false);
                } else {
                  setLastName(text);
                  setErrLastName(true);
                }
              }}
              value={LastName}
            />
          </FormControl>
          {ErrLastName === true ? (
            <Text style={{color: '#FF0000', fontSize: 9}}>
              {' '}
              * Please enter your Last Name
            </Text>
          ) : null}
          <FormControl isRequired>
          <FormControl.Label
              _text={{
                color: '#000',
                fontSize: 'sm',
                fontWeight: 600,
              }}
              mb={3}>
              Mobile no.
            </FormControl.Label>
            {/* <Text color="muted.700" fontSize="sm" fontWeight="600" mb={1}>
              Mobile no.
            </Text> */}
            <View>
              {console.log('country code : ', countryCode)}
            <PhoneInput
              defaultCode={`${countryCode}`}
              layout="first"
              textContainerStyle={{height:50, backgroundColor:"#f3f3f3",}}
              codeTextStyle={width > 700 ? {width:100, textAlign:"center", marginLeft:-40, paddingTop:12, height:50, fontSize:20} : {height:"150%", paddingTop:3}}
              containerStyle={{width:"100%", backgroundColor:"#f3f3f3", color:"black", height:50, }}
              onChangeCountry={(country)=>setCountryCode(country.cca2)}
            />
            <View style={{width:"100%", marginLeft:-6,  flexDirection:"row", position:"absolute"}}>
                <View style={width > 700 ? {width:"70%",  marginLeft:'30%'} : {width:"60%",  marginLeft:'40%'}}>

                <Input 
                variant="filled" 
                width={"100%"}
                height={'12'}
                justifyContent={"flex-end"}
                bg="#f3f3f3"
                mt={0.5}
                value={MobileNo.slice(-10)} 
                ref={mobileNumberRef}
                placeholder="Enter Mobile No."
                onChangeText={text => {
                  let ValT = MobileVal(text);
                  if (ValT === true) {
                    setErrMobileNo(false);
                    setMobileNo(text);
                  } else if (ValT !== true) {
                    setErrMobileNo(true);
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

            {ErrMobileNo === true ? (
              <Text style={{color: '#FF0000', fontSize: 9}}>
                {' '}
                * Please enter your Mobile no. properly
              </Text>
            ) : null}
          </View>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label
              _text={{
                color: '#000',
                fontSize: 'sm',
                fontWeight: 600,
              }}
              mb={3}>
              About
            </FormControl.Label>
            <TextArea
              variant={'filled'}
              ref={aboutStudentRef}
              bg="#f3f3f3"
              value={About}
              placeholder={`${About}`}
              borderRadius={7}
              onChangeText={text => {
                let ValT = TextVal(text);
                if (ValT === true) {
                  setAbout(text);
                  setErrAbout(false);
                } else {
                  setErrAbout(true);
                  setAbout(text);
                }
              }}
              minH={100}
            />
          </FormControl>
          {ErrAbout === true ? (
            <Text style={{color: '#FF0000', fontSize: 9}} mt={2}>
              {' '}
              * Please enter about properly
            </Text>
          ) : null}

          {/* <FormControl mt={4} isRequired>
            <FormControl.Label
              _text={{
                color: '#000',
                fontSize: 'sm',
                fontWeight: 600,
              }}
              mb={3}>
              Language
            </FormControl.Label>
            <Select
              variant="filled"
              ref={languageRef}
              bg="#f3f3f3"
              borderColor="#f3f3f3"
              accessibilityLabel="Language"
              placeholder="Language"
              onValueChange={itemValue => setLanguage(itemValue)}
              selectedValue={Language}
              _selectedItem={{
                endIcon: <Icon size={5} />,
              }}
              mt="1">
              <Select.Item label="Tamil" value="Tamil" />
              <Select.Item label="English" value="English" />
            </Select>
          </FormControl> */}

          <View style={{marginTop:15}}>
            <Text
              style={{
                color: '#000000',
                fontSize: 14,
                fontWeight: 'bold',
                marginTop: 5,
              }}>
              Social Link{' '}
              <Text style={{fontSize: 10, color: '#8C8C8C'}}>(Optional)</Text>
            </Text>
            <HStack space={4} mt={2}>
              <Image
                source={require('../../assets/Social/facebook.png')}
                alt="facebook"
                style={styles.socialImg}
              />
              <FormControl>
                <Input
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Facebook Link"
                  value={facebook}
                  onChangeText={text => setfacebook(text)}
                  borderRadius={5}
                  w="85%"
                />
              </FormControl>
            </HStack>
            <HStack space={4} mt={2}>
              <Image
                source={require('../../assets/Social/instagram.png')}
                alt="facebook"
                style={styles.socialImg}
              />
              <FormControl>
                <Input
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Instagram Link"
                  onChangeText={text => setinstagram(text)}
                  borderRadius={5}
                  value={instagram}
                  w="85%"
                />
              </FormControl>
            </HStack>

            <HStack space={4} mt={2}>
              <Image
                source={require('../../assets/Social/linkedin.png')}
                alt="facebook"
                style={styles.socialImg}
              />
              <FormControl>
                <Input
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="linkedin Link"
                  onChangeText={text => setlinkedin(text)}
                  borderRadius={5}
                  value={linkedin}
                  w="85%"
                />
              </FormControl>
            </HStack>
            <HStack space={4} mt={2}>
              <Image
                source={require('../../assets/Social/Twitter.png')}
                alt="facebook"
                style={styles.socialImg}
              />
              <FormControl>
                <Input
                  variant="filled"
                  bg="#f3f3f3"
                  placeholder="Twitter Link"
                  onChangeText={text => settwitter(text)}
                  borderRadius={5}
                  value={twitter}
                  w="85%"
                />
              </FormControl>
            </HStack>
          </View>
          <TouchableOpacity>
            <Button
              bg="primary.100"
              m={5}
              onPress={() => {
                updateProfile();
              }}>
              Save Changes
            </Button>
          </TouchableOpacity>
        </VStack>
      </ScrollView>
      </>
    }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFC',
    height: height,
    width: width,
    flex: 1,
  },
  TopContainer: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  socialImg: {
    width: 30,
    height: 30,
  },
  PhoneInput: {
    borderRadius: 7,
    backgroundColor: '#f3f3f3',
    height: height / 15,
    justifyContent:'center',
  },
});

export default Profile;
