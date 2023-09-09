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
import { CountryRegionData } from '../../BuyNow/Countries';
import { Dropdown } from 'react-native-element-dropdown'
import {RAZORPAY_API_KEY, RAZORPAY_API_KEY_2} from '../../StaticData/Variables';
import RazorpayCheckout from 'react-native-razorpay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PaymentVerification} from '../../Functions/API/PaymentVerification';
import { GetDiscountCodesForCartItems } from '../../Functions/API/GetDiscountCodesForCartItems';
import { ApplyPromoCode } from '../../Functions/API/ApplyPromoCode';
import { AirbnbRating } from 'react-native-ratings';
import Invoice from '../../BuyNow/Invoice';

const {width, height} = Dimensions.get('window');

const Cart = ({navigation}) => {
  const dispatch = useDispatch();
  const [CartData, setCartData] = useState(null);
  const [cartA, setCartA] = useState({});
  const [CartLen, setCartLen] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [country, setCountry] = useState(null)
  const [countries, setCountries] = useState(null)
  const [address1, setAddress1] = useState(null)
  const [address2, setAddress2] = useState(null)
  const [address1Err, setAddress1Err] = useState(false)
  const [address2Err, setAddress2Err] = useState(false)
  const [region, setRegion] = useState(null)
  const [regions, setRegions] = useState(null)
  const [countryError, setCountryError] = useState(null)
  const [regionError, setRegionError] = useState(null)
  const [coupon, setCoupon] = useState(null)
  const [couponList, setCouponList] = useState([])
  const countryRef = useRef()
  const address2Ref = useRef()
  const address1Ref = useRef()
  const regionRef = useRef()
  const email = useSelector(state => state.Auth.Mail);
  const ProfileData = useSelector(state => state.Auth.ProfileData);
  const [profile, setProfile] = useState(ProfileData);
  const [CheckOutD, setCheckOutD] = useState(null);
  const [ShowSuccess, setShowSuccess] = useState(false);
  const [showSuccessPurchase, setShowSuccessPurchase] = useState(false);
  const [orderId, setOrderId] = useState('')

  const AppBarContent = {
    title: 'Cart',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  // // Applying coupon code autometically once selected or changed
  // useEffect(()=>{
  //   if(coupon !== null){
  //     applyPromoCode()
  //   }
  // },[coupon])

  // Refreshing component when in foucs while navigating
  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      GetPCart()
      getDiscountCodesForCartItems()
      getCountries()
    });
    return unsubscribe;
  },[navigation])

  // useEffect(() => {
  //   GetPCart();
  //   if (ProfileData){
  //     setProfile(ProfileData);
  //   }
  // }, [ProfileData]);

  const applyPromoCode = async () => {
    try {
      const result = await ApplyPromoCode(email, coupon)
      if(result.status === 200) {
        console.log(result)
        GetPCart()
      } else {
        console.log('applyPromoCode error 1 :', result)
      }
    } catch (e) {
      console.log('applyPromoCode error 2 :', e)
    }
  }

  const getDiscountCodesForCartItems = async() => {
    try {
      const result = await GetDiscountCodesForCartItems(email)
      if(result.status === 200) {
        console.log('_______getDiscountCodesForCartItems_________', result.data)
        let coupons = []
        result.data.map((i)=> {
          let obj = {
              label: i.couponName,
              value: i.couponName
          }
          coupons = [ ...coupons, obj]
          setCouponList(coupons)
        })
      } else {
        console.log('==GetDiscountCodesForCartItems==1 ', result)
      }
    } catch (e) {
      GetDiscountCodesForCartItems()
      console.log('==GetDiscountCodesForCartItems==2 ', e)
    }
  }

  const getCountries = () => {
    let countries = []
    CountryRegionData.map((i)=>{
        let obj = {
            label: i[0],
            value: i[0]
        }
        // console.log(i[0])
        countries = [ ...countries, obj]
    })
    setCountries(countries)
}

const getRegions = (c) => {
    let regions = []
    CountryRegionData.map((i)=>{
        if(i[0] === c){
            let arr = i[2].split('|')
            arr.map((r)=>{
                let reg = r.split('~')
                console.log(reg[0])
                let obj = {
                    label: reg[0],
                    value: reg[0]
                }
                regions = [ ...regions, obj]
            })
            // console.log(arr[0])
        }
    })
    setRegions(regions)
}


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
      console.log('Razor pay payment data: ', dd)
      setOrderId(dd.razorpay_order_id)
      VerifyPayment(dd.razorpay_order_id, dd.razorpay_payment_id, dd.razorpay_signature);
    }).catch((error) => {
      // GetPCart()
      setCartLen(0)
      let des = error.error.description;
      console.log(`Error CheckoutRazorpay : ${error.code} | ${des}`);
    });
  };

  const CheckoutServer = async() => {
    if(country === null || country === ''){
      setCountryError('Please select a country!')
    } else if (region === null || region === '') {
      setRegionError('Please select a region!')
    } else if (address1 === null || address1 === ''){
      console.log(address1)
      setAddress1Err(true)
      address1Ref.current.focus()
    } else if (address2 === null || address2 === '') {
      console.log(address2)
      setAddress2Err(true)
      setCartA({})
      setCartLen(0)
      address2Ref.current.focus()
    } else {
      try {
        let CheckO = await Checkout(email);
        setCartData(null)
        if ( CheckO.status === 200){
          console.log(CheckO)
          CheckoutRazorpay(CheckO.data);
        } else {
          GetPCart()
          GetDiscountCodesForCartItems()
          
          console.log("CheckoutServer error 1: " + CheckO.message);
          console.log('Cart data : ', CartData)
        }
      } catch (error) {
        GetPCart()
        GetDiscountCodesForCartItems()
        console.log("CheckoutServer error 2: " + error.message);
      }
    }
  };

  const checkoutNow = async () => {
    try {
      let CheckO = await Checkout(email);
      if ( CheckO.status === 200){
        CheckoutRazorpay(CheckO.data);
      } else {
        GetPCart()
        console.log("CheckoutServer error 1: " + CheckO.message);
        console.log('Cart data : ', CartData)
      }
    } catch (error) {
      GetPCart()
      console.log("CheckoutServer error 2: " + error.message);
    }
  }

  const VerifyPayment = async(oi, pi,sign) => {
    dispatch(setLoading(true));
    try {
      let CheckO = await PaymentVerification(email, oi, pi,sign);
        if ( CheckO.status === 200){
          setShowSuccess(true);
          setCartData(null);
          setCartLen(0);
          dispatch(setLoading(false));
          setShowSuccessPurchase(true)
          console.log(CheckO, 'This is check O')
          ////////////////////////////////////////////////////////////////////////////////////////////////
        } else {
          GetPCart()
          console.log('VerifyPayment error')
          setShowSuccess(false);
          dispatch(setLoading(false));
        }
    } catch (error) {
      GetPCart()
      alert("VerifyPayment error: " + error.message);
      dispatch(setLoading(false));
    }
  };

  const RemoveFromCart = async (code, name, type) => {
    // console.log(code , 'and ', name)
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

      if(type === 'course') {
        await fetch(BaseURL + 'api/v1/cart/clearCartByCoursecode?courseCode=' + code, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('Helooooooooooooooooooooooooooooooooooooooooooooooooo')
            if (result.status === 200) {
              getDiscountCodesForCartItems()
              GetPCart();
              dispatch(setLoading(false));
              alert(name + ' has been removed from cart!')
            } else if (result.status > 200) {
              dispatch(setLoading(false));
              console.log(result.message);
            }
          })
          .catch(error => {
            dispatch(setLoading(false));
            console.log('CError: ' + error);  // From here SyntaxError: JSON Parse error: Unexpected token: < occuring
          });
      } else {
        await fetch(BaseURL + 'api/v1/cart/clearCartByCoursecode?assessmentCode=' + code, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('Helooooooooooooooooooooooooooooooooooooooooooooooooo')
            if (result.status === 200) {
              GetPCart();
              dispatch(setLoading(false));
              alert(name + ' has been removed from cart!')
            } else if (result.status > 200) {
              dispatch(setLoading(false));
              console.log(result.message);
            }
          })
          .catch(error => {
            dispatch(setLoading(false));
            console.log('CError: ' + error);  // From here SyntaxError: JSON Parse error: Unexpected token: < occuring
          });
      }
    }
  };

  const CartCard = ({props}) => {
    console.log('props: ', props)
    const cName = props.courseName ? props.courseName : props.assessmentTitle
    const courseT = cName.length > 25 ? cName.slice(0,25) + '...' : cName;
    const currency = props.currency === 'INR' ? '₹' : '$';
    return (
      <View style={{width:width*0.95}}>
        <VStack style={styles.CourseCard} mt={3}>
          <HStack space={3}>
            <Center>
              {
                props.thumbNailImagePath ?
                <Image
                  style={styles.cardImg}
                  source={{uri: props.thumbNailImagePath}}
                  alt="courseimg"
                  resizeMode="cover"
                />
                : 
                <View style={{width:width / 3.5, alignItems:"center"}}>
                  <Ionicons name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 40,}} size={40} />
                </View>
              }
            </Center>
            <VStack style={styles.CardContent}>
              <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
              <Text
                noOfLines={2}
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#000000',
                  maxWidth: width*0.44,
                }}>
                {courseT}
              </Text>
              {props.isLive
                ?
                  <Text pr={2} pl={2} borderRadius={20} style={{fontSize:10, paddingHorizontal:5, paddingVertical:1, borderRadius:10, backgroundColor:'#F65656', color:'#FFF'}}>Live Courses</Text>
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
              
            <HStack space={1}>
            <AirbnbRating
              count={5}
              isDisabled={true}
              showRating={false}
              defaultRating={`${props.rating}`}
              size={10}
              // selectedColor={colors[2]}
              value={`${props.rating}`}
              // style={{marginHorizontal:4}}
              // ratingContainerStyle={{ marginHorizontal:10, marginTop:20, }}
              // starContainerStyle={{paddingVertical:10,}}     
              // onFinishRating={ratingCompleted}
            />
            </HStack>
          

          {
            props.ratingCount !== 0 && props.hasOwnProperty('rating') ?
            <Text style={{fontSize: 11}}>{props.rating.toFixed(1)} ({props.ratingCount})</Text>
            :
            <Text style={{fontSize: 11}}>0(0)</Text>
          }

          <Image alt="graduate icon" source={require('../../../assets/Home/graduate_student.png')} size="3"/>
          <Text style={{fontSize: 11}}>{props.learnersCount} Learners</Text>
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
              props.courseCode ? RemoveFromCart(props.courseCode, props.courseName, 'course') : RemoveFromCart(props.assessmentCode, props.assessmentTitle, 'assessment')
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
          console.log('Get vat and all => ', cartD)
          setCoupon(cartD.couponName)
          let ObjData = Object.keys(cartD).length === 0;
          if (ObjData !== true) {
            if (cartD.items !== undefined) {
              let CartI = cartD.items;
              let cartLen = CartI.length;
              setCartLen(cartLen);
              setCartA(cartD);
              console.log('Cart AAAAAAAAAAAAAAAAAAAA: ', cartD)
              setCartData(cartD.items);
              dispatch(setLoading(false));
            }
          }
          dispatch(setLoading(false));
        } else if (result.status > 200) {
          dispatch(setLoading(false));
          console.log('Error: GetPCart 1' + result.message);
        }
      }
    } catch (e) {
      dispatch(setLoading(false));
      GetPCart()
      console.log('Error: GetPCart 2 ' + e.message);
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
    <View style={styles.container}>
      <Navbar props={AppBarContent} />

      {/* Modal to show successfull purchase */}
      <Modal isOpen={showSuccessPurchase}>
        <Modal.Content maxWidth="700px">
          <Modal.Body>
            <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5} justifyContent="center" alignItems="center">
              <Image source={require('../../../assets/success_tick02.png')} resizeMode="contain" size="150" alt="successful" />
              <Text fontWeight="bold" color={'black'} fontSize="17">Payment Successfully Done</Text> 
              <HStack space={1}>
              <Invoice props={cartA} orderId={orderId} />
              <Button 
                bg={'primary.900'}
                colorScheme="blueGray"
                style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                _pressed={{bg: "#fcfcfc",
                  _text:{color: "#3e5160"}
                  }}
                  onPress={()=>{
                    // setIsEmptyComponet(true)
                    setShowSuccessPurchase(false)
                    setCartA({});
                    cartA.items.some(item => 'courseName' in item) ? navigation.navigate('Courses') : navigation.navigate('MyAssessments')
                    // course.courseCode ? navigation.navigate('Courses') : navigation.navigate('MyAssessments')
                  }}
                  >
                Done
              </Button>
              </HStack>
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

        {Object.keys(cartA).length > 0 && CartLen !== 0 ? (
          <VStack m={5} space={2}>

            <Text style={{fontSize: 17, color:'#000', marginTop:10, fontWeight: 'bold',}}>Billing Address</Text>
            <View style={{marginTop:10, marginBottom:0}}>
             {
                countries !== null ?
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor:"#364b5b" }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={{color:"#364b5b"}}
                    data={countries}
                    ref={countryRef}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select country'}
                    searchPlaceholder="Search..."
                    value={country}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setCountry(item.value);
                        setRegion(null);
                        getRegions(item.value)
                        setCountryError(null)
                        setIsFocus(false);
                    }}
                />
                : <></>
             }
             {countryError !== null ? <Text style={{marginLeft:5, fontSize: 13, fontWeight: 'bold', color:"red"}}>{countryError}</Text> : <></>}
            </View>
            <View style={{marginTop:0, marginBottom:2}}>
            {
                regions !== null ?
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor:"#364b5b" }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={{color:"#364b5b"}}
                    data={regions}
                    ref={regionRef}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select region'}
                    searchPlaceholder="Search..."
                    value={region}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setRegion(item.value);
                        setRegionError(null)
                        setIsFocus(false);
                    }}
                />
                : <></>
             }
             {regionError !== null ? <Text style={{marginLeft:5, fontSize: 13, fontWeight: 'bold', color:"red"}}>{regionError}</Text> : <></>}
            </View>
            <View>
                <Input 
                    placeholder="Address line 1"
                    ref={address1Ref}
                    onChangeText={(text)=>{
                      setAddress1Err(false)
                      console.log(text.trim())
                      setAddress1(text.trim())
                    }}
                />
            </View>
            {address1Err ? <Text style={{marginLeft:5, fontSize: 13, fontWeight: 'bold', color:"red"}}>Please fill the address line-1</Text> : null}
            <View style={{marginVertical:2}}>
                <Input 
                    placeholder="Address line 2"
                    ref={address2Ref}
                    onChangeText={(text)=>{
                      setAddress2Err(false)
                      console.log(text)
                      setAddress2(text.trim())
                    }}
                />
            </View>
            {address2Err ? <Text style={{marginLeft:5, fontSize: 13, fontWeight: 'bold', color:"red"}}>Please fill the address line-2</Text> : null}
            
            {
              Object.keys(couponList).length > 0 ?
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
                <HStack space={1}>
                  <Dropdown
                      style={[styles.dropdown2, isFocus && { borderColor:"#364b5b" }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      itemTextStyle={{color:"#364b5b"}}
                      data={couponList}
                      // ref={countryRef}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={'Select coupon'}
                      searchPlaceholder="Search..."
                      value={coupon}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                          setCoupon(item.value)
                          // setRegion(null);
                          // getRegions(item.value)
                          // setCountryError(null)
                          setIsFocus(false);
                      }}
                  />
                  <Button onPress={applyPromoCode} px={5}>Apply</Button>
                </HStack>
              </FormControl>
              : null
            }
            
            <Text style={{fontSize: 17, color:'#000', marginTop:10, fontWeight: 'bold',}}>Order Summary</Text>
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
                {cartA.currencyCode  === 'USD' ? '$' : '₹'} {cartA.discountValue ? cartA.discountValue : 0}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                color={'greyScale.800'}
                style={{fontSize: 13, fontWeight: 'bold'}}>
                Vat ({cartA.taxPercentage}%)
              </Text>
              {
                cartA.taxValue !== null ?
                  <Text color={'primary.100'} style={{fontSize: 13, fontWeight: 'bold'}}>
                    {cartA.currencyCode === 'USD' ? '$' : '₹'} {Number.isInteger(cartA.taxValue) ? cartA.taxValue : cartA.taxValue.toFixed(2)}
                  </Text>
              :
                <Text color={'primary.100'} style={{fontSize: 13, fontWeight: 'bold'}}>{cartA.currencyCode === 'USD' ? '$' : '₹'} 0</Text>
              }
            </HStack>

            <HStack justifyContent="space-between" mt={8}>
              <VStack>
                <Text
                  color={'greyScale.800'}
                  style={{fontSize: 12, fontWeight: 'bold'}}>
                  Total
                </Text>
                {
                  cartA.taxValue !== null ?
                    <Text color={'primary.100'} style={{fontSize: 13, fontWeight: 'bold'}}>
                      {cartA.currencyCode} {cartA.total}
                    </Text>
                :
                  <Text color={'primary.100'} style={{fontSize: 13, fontWeight: 'bold'}}>{cartA.currencyCode} 0</Text>
                }
              </VStack>
              <Button colorScheme={'primary'} onPress={()=> CheckoutServer()}>Checkout</Button>
            </HStack>
            
          </VStack>
        ) : null}
      </ScrollView>
    </View>
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
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color:"#364b5b"
  },
  dropdown2: {
    width:width*0.72,
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color:"#364b5b"
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    color:"#364b5b",
    backgroundColor: 'black',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 13, fontWeight: 'bold',
    color:"#364b5b"
  },
  selectedTextStyle: {
    fontSize: 13, fontWeight: 'bold',
    color:"#364b5b"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color:"#364b5b"
  },
});

export default Cart;
