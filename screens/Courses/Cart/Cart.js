/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  VStack,
  HStack,
  Button,
  Heading,
  Image,
  Center,
  FormControl,
  Input,
  Modal,
  Box,
} from 'native-base';
import Navbar from '../../components/Navbar';
import {BaseURL} from '../../StaticData/Variables';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '../../Redux/Features/authSlice';
import { Checkout } from '../../Functions/API/Checkout';
import { GetCart } from '../../Functions/API/GetCart';
import {RAZORPAY_API_KEY, RAZORPAY_API_KEY_2} from '../../StaticData/Variables';
import RazorpayCheckout from 'react-native-razorpay';
import {PaymentVerification} from '../../Functions/API/PaymentVerification';

const {width, height} = Dimensions.get('window');

const Cart = ({navigation}) => {
  const dispatch = useDispatch();
  const [CartData, setCartData] = useState(null);
  const [cartA, setCartA] = useState();
  const [CartLen, setCartLen] = useState(0);
  const email = useSelector(state => state.Auth.Mail);
  const ProfileData = useSelector(state => state.Auth.ProfileData);
  const [profile, setProfile] = useState();
  const [CheckOutD, setCheckOutD] = useState();
  const [ShowSuccess, setShowSuccess] = useState(false);

  const AppBarContent = {
    title: 'Cart',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  useEffect(() => {
    GetPCart();
    if (ProfileData){
      setProfile(ProfileData);
    }
  }, [ProfileData]);


  const CheckoutRazorpay = (data) => {
    var options = {
      description: 'Purchase Completed',
      image: profile.profileImgPath,
      currency: data.currency,
      key: RAZORPAY_API_KEY,
      amount: data.amount,
      name: profile.firstName + "'s" + ' Order',
      order_id:data.id,
      prefill: {
        email: email,
        contact: profile.mobileNumber,
        name: profile.firstName,
      },
      theme: {color: '#364b5b'},
    };
    RazorpayCheckout.open(options).then((dd) => {
      VerifyPayment(dd.razorpay_order_id, dd.razorpay_payment_id, dd.razorpay_signature);
    }).catch((error) => {
      let des = error.error.description;
      alert(`Error: ${error.code} | ${des}`);
    });
  };

  const CheckoutServer = async() => {
    try {
      let CheckO = await Checkout(email);
    if ( CheckO.status === 200){
      setCheckOutD(CheckO.data);
      CheckoutRazorpay(CheckO.data);
    } else {
      alert("CheckoutServer error: " + CheckO.message);
    }
    } catch (error) {
      alert("CheckoutServer error: " + error.message);
    }
  };

  const VerifyPayment = async(oi, pi,sign) => {
    dispatch(setLoading(true));
    try {
      let CheckO = await PaymentVerification(email, oi, pi,sign);
    if ( CheckO.status === 200){
      setShowSuccess(true);
      setCartData(null);
      setCartLen(0);
      setCartA(null);
      dispatch(setLoading(false));
    } else {
      setShowSuccess(false);
      dispatch(setLoading(false));
    }
    } catch (error) {
      alert("VerifyPayment error: " + error.message);
      dispatch(setLoading(false));
    }
  };

  const RemoveFromCart = async (code, name) => {
    dispatch(setLoading(true));
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'DELETE',
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

      await fetch(BaseURL + 'api/v1/cart/' + code, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            GetPCart();
            dispatch(setLoading(false));
            alert(name + ' has been removed from cart!')
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          alert('CError: ' + error);
        });
    }
  };

  const CartCard = ({props}) => {
    console.log(props)
    const cName = props.courseName;
    const courseT = cName.length > 25 ? cName.slice(0,25) + '...' : cName;
    const currency = props.currency === 'INR' ? '₹' : '$';
    return (
      <View>
        <VStack style={styles.CourseCard} mt={3}>
          <HStack space={3}>
            <Center>
              <Image
                style={styles.cardImg}
                source={{uri: props.thumbNailImagePath}}
                alt="courseimg"
                resizeMode="cover"
              />
            </Center>
            <VStack style={styles.CardContent}>
              <View style={{flexDirection:"row", justifyContent:"space-between"}}>
              <Text
                noOfLines={2}
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#000000',
                  maxWidth: width / 2,
                }}>
                {courseT}
              </Text>
              {props.isLive
                ?
                <Text numberOfLines={2} style={{fontSize: 13, backgroundColor:"#EDAEC0", paddingHorizontal:5, paddingVertical:0, borderRadius:5, bottom:5, color: '#FFF',}} >
                  Live
                </Text>
                :
                <></>
              }
              </View>

              <HStack alignItems={'center'} justifyContent={'space-between'}>
                <HStack space={1}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      maxWidth: width / 4,
                    }}
                    color={'greyScale.800'}>
                    By
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      maxWidth: width / 2.5,
                    }}
                    color={'primary.100'}>
                    {props.instructorName}
                  </Text>
                </HStack>
                <View>
                  <Text
                    color={'greyScale.800'}
                    style={{fontSize: 10, fontWeight: 'bold'}}>
                    Fee
                  </Text>
                </View>
              </HStack>

              <HStack alignItems={'center'} justifyContent={'space-between'}>
        <HStack space={2} style={{alignItems: 'center'}}>
          { props.RatingCount ?
          <HStack space={1}>
              <HStack space={1}>
                {
              [...Array(props.RatingCount)].map((e, i) =>{
                  return (
                    <Image
                      key={i}
                      source={require('../../../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                  );
                }
              )
            }
            {
              [...Array(5 - props.RatingCount)].map((e, i) =>{
                  return (
                    <Image
                      key={i}
                      source={require('../../../assets/Home/unstar.png')}
                      alt="rating"
                      size="3"
                    />
                  );
                }
              )
            }
              </HStack>
          </HStack>
          :
            <HStack space={1}>
              <Image
                source={require('../../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
              <Image
                source={require('../../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
              <Image
                source={require('../../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
              <Image
                source={require('../../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
              <Image
                source={require('../../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
            </HStack>
          }

          <Text style={{fontSize: 11}}>
            {props.rating} ({props.ratingCount ? props.ratingCount : 0})
          </Text>
        </HStack>
                <View>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      color: '#000000',
                    }}>
                    {currency}{props.fee}
                  </Text>
                </View>
              </HStack>
            </VStack>
          </HStack>
          <Button
            _text={{color: '#F65656', fontSize: 12}}
            bg={'white'}
            _pressed={{backgroundColor: '#FFFFFF', opacity: 0.5}}
            onPress={() => {
              RemoveFromCart(props.courseCode, props.courseName);
            }}>
            Remove from Cart
          </Button>
        </VStack>
      </View>
    );
  };

  const GetPCart = async () => {
    dispatch(setLoading(true));
    try {
      if (email === '') {
        alert('Something is wrong, please login again');
      } else {
      let result = await GetCart(email);
        if (result.status === 200) {
          let cartD = result.data;
          let ObjData = Object.keys(cartD).length === 0;
          if (ObjData !== true) {
            if (cartD.items !== undefined) {
              let CartI = cartD.items;
              let cartLen = CartI.length;
              setCartLen(cartLen);
              setCartA(cartD);
              setCartData(cartD.items);
              dispatch(setLoading(false));
            }
          }
          dispatch(setLoading(false));
        } else if (result.status > 200) {
          dispatch(setLoading(false));
          alert('Error: ' + result.message);
        }
      }
    } catch (e) {
      dispatch(setLoading(false));
      alert('Error: ' + e.message);
    }
  };

  const RenderCart = () => {
    return CartData.map((data, index) => {
      return (
        <View key={index}>
          <CartCard props={data} />
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar props={AppBarContent} />

      <Modal isOpen={ShowSuccess} onClose={() => {
        setShowSuccess(false);
        }} size="lg">
          <Modal.Content maxWidth="900" Width="800">
            <Modal.CloseButton />
            <Modal.Body>
              <VStack space={3}>
                <Box safeArea flex={1} p={2} w="90%" mx="auto">
                  <VStack space={2} alignItems="center">
                    <Center>
                      <Image
                        source={require('../../../assets/success_tick02.png')}
                        alt="success"
                        style={{height:height / 6}}
                        resizeMode="contain"
                      />
                    </Center>
                    <Heading size="md" fontSize="md">
                      <Text>Payment Successful !</Text>
                    </Heading>

                    <Button
                      bg="#3e5160"
                      colorScheme="blueGray"
                      style={styles.pdone}
                      _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                      onPress={() => {
                        setShowSuccess(false);
                      }}
                      mt={3}>
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
        <Center>
          {CartData ? <RenderCart /> : null}
          {CartLen === 0 ? (
            <Text color="greyScale.800" style={{fontSize: 10}}>
              You don't have anything in the Cart :(
            </Text>
          ) : null}
        </Center>

        {cartA ? (
          <VStack m={5} space={2}>
            

            <FormControl mb={5}>
              <FormControl.Label
                _text={{
                  fontSize: 13,
                  color: 'greyScale.800',
                  fontWeight: 'bold',
                }}
                mb={1}>
                Have Promo Code ?
              </FormControl.Label>
              <Input
                variant="filled"
                width={'100%'}
                bg="#f8f8f8"
                placeholder="Enter your Promo Code"
                borderRadius={10}
                InputRightElement={
                  <Button
                    colorScheme={'primary'}
                    _text={{fontSize: 12}}
                    mr={2}
                    pl={7}
                    pr={7}>
                    Apply
                  </Button>
                }
              />
            </FormControl>

            <HStack justifyContent="space-between">
              <Text
                color={'greyScale.800'}
                style={{fontSize: 13, fontWeight: 'bold'}}>
                Sub Total
              </Text>
              <Text
                color={'primary.100'}
                style={{fontSize: 13, fontWeight: 'bold'}}>
                {cartA.currencyCode} {cartA.subTotal}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                color={'greyScale.800'}
                style={{fontSize: 13, fontWeight: 'bold'}}>
                Discount({cartA.discountPercentage}%)
              </Text>
              <Text
                color={'primary.100'}
                style={{fontSize: 13, fontWeight: 'bold'}}>
                {cartA.discountValue}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                color={'greyScale.800'}
                style={{fontSize: 13, fontWeight: 'bold'}}>
                Vat ({cartA.taxPercentage}%)
              </Text>
              <Text
                color={'primary.100'}
                style={{fontSize: 13, fontWeight: 'bold'}}>
                {cartA.taxValue}
              </Text>
            </HStack>

            <HStack justifyContent="space-between" mt={8}>
              <VStack>
                <Text
                  color={'greyScale.800'}
                  style={{fontSize: 12, fontWeight: 'bold'}}>
                  Total
                </Text>
                <Text
                  color={'primary.100'}
                  style={{fontSize: 16, fontWeight: 'bold'}}>
                  {cartA.currencyCode} {cartA.total}
                </Text>
              </VStack>
              <Button colorScheme={'primary'} onPress={()=> CheckoutServer()}>Checkout</Button>
            </HStack>
            
          </VStack>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginTop: 20,
  },
  CourseCard: {
    alignItems: 'center',
    maxHeight: height / 4,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 0.376085489988327,
    },
    shadowRadius: 22,
    shadowOpacity: 1,
    padding: 10,
  },
  cardImg: {
    height: height / 11,
    width: width / 3.5,
    borderRadius: 5,
  },
  CardContent: {
    minWidth: width / 1.7,
  },
});

export default Cart;
