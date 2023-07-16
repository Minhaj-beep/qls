import React, { useState, useEffect, useRef } from "react"
import Navbar from '../components/Navbar';
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { Text, VStack, HStack, Button, Modal, Image, Center, Input, useToast, FormControl } from 'native-base';
import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions,} from 'react-native';
import { CheckoutNow } from "../Functions/API/CheckoutNow";
import { CheckoutNowAssessment } from "../Functions/API/CheckoutNowAssessment";
import { CheckoutNowPost } from "../Functions/API/CheckoutNowPost";
import { CheckoutNowPostAssessment } from "../Functions/API/CheckoutNowPostAssessment";
import { AddToCart } from "../Functions/API/AddToCart";
import { AddToCartAssessment } from "../Functions/API/AddToCartAssessment";
import { Dropdown } from 'react-native-element-dropdown'
import { RAZORPAY_API_KEY } from "../StaticData/Variables";
import { setLoading } from "../Redux/Features/authSlice";
import { PaymentVerification } from "../Functions/API/PaymentVerification";
import Ionicons from 'react-native-vector-icons/Ionicons';
import RazorpayCheckout from 'react-native-razorpay';
import { AirbnbRating } from "react-native-ratings";
import { CountryRegionData } from "./Countries";
import { GetDiscountForBuyNow } from "../Functions/API/GetDiscountsForBuyNow";
import { ApplyPromoCode } from "../Functions/API/ApplyPromoCode";
import Invoice from "./Invoice";
const {height, width} = Dimensions.get('window')

const BuyNow = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const toast = useToast()
    const course = useSelector(state => state.Course.BuyNowCourse)
    const ProfileData = useSelector(state => state.Auth.ProfileData);
    const email = useSelector(state => state.Auth.Mail);
    const JWT = useSelector(state => state.Auth.JWT);
    const [checkOutData, setCheckOutData] = useState(null)
    const [country, setCountry] = useState(null)
    const [countries, setCountries] = useState(null)
    const [address1, setAddress1] = useState(null)
    const [address2, setAddress2] = useState(null)
    const [address1Err, setAddress1Err] = useState(false)
    const [address2Err, setAddress2Err] = useState(false)
    const [region, setRegion] = useState(null)
    const [regions, setRegions] = useState(null)
    const [isFocus, setIsFocus] = useState(false);
    const [countryError, setCountryError] = useState(null)
    const [regionError, setRegionError] = useState(null)
    const [isEmptyComponent, setIsEmptyComponet] = useState(false)
    const [coupon, setCoupon] = useState(null)
    const [couponList, setCouponList] = useState([])
    const [showSuccessPurchase, setShowSuccessPurchase] = useState(false)
    const [orderId, setOrderId] = useState('')
    const countryRef = useRef()
    const address2Ref = useRef()
    const address1Ref = useRef()
    const regionRef = useRef()

    useEffect(()=> {
        getCountries()
        GetCheckOutData()
        getDiscountForBuyNow()
    },[])

    // // Calling apply coupon each time as the value of coupon get changes
    // useEffect(()=>{
    //   if(coupon !== null){
    //     applyPromoCode()
    //   }
    // },[coupon])

    // Apply coupon for buy now course or assessment
    const applyPromoCode = async () => {
      try {
        const result = await ApplyPromoCode(email, coupon)
        if(result.status === 200) {
          console.log(result, 'Promo applied successfully')
          GetCheckOutData()
        } else {
          console.log('applyPromoCode error 1 :', result)
        }
      } catch (e) {
        console.log('applyPromoCode error 2 :', e)
      }
    }

    // Get discount for course or assessment
    const getDiscountForBuyNow = async() => {
      try {
        const result = await GetDiscountForBuyNow(email, course.courseCode)
        if(result.status === 200) {
          console.log('getDiscountForBuyNow', result.data)
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
          console.log('==getDiscountForBuyNow==1 ', result)
        }
      } catch (e) {
        getDiscountForBuyNow()
        console.log('==getDiscountForBuyNow==2 ', e)
      }
    }

    const AddTC = async () => {
      if(course.courseCode){
        try {
            let cart = await AddToCart(email, course.courseCode);
            if (cart.status === 200) {
              console.log(cart)
              toast.show({
                description: cart.message,
              });
            } else {
              toast.show({
                description: cart.message,
              });
              console.log(cart.message);
            }
            console.log(cart);
          } catch (e) {
            console.log(e)
          }
      } else {
        try {
          let cart = await AddToCartAssessment(email, course.assessmentCode);
          if (cart.status === 200) {
            console.log(cart)
            toast.show({
              description: cart.message,
            });
          } else {
            toast.show({
              description: cart.message,
            });
            console.log(cart.message);
          }
          console.log(cart);
        } catch (e) {
          console.log(e)
        }
      }
      };

    const CheckoutRazorpay = (id) => {
      const data = checkOutData
      console.log(data)
      var options = {
        description: 'Purchase Completed',
        image: ProfileData.profileImgPath,
        currency: data.currency,
        key: RAZORPAY_API_KEY,
        amount: data.total*100,
        name: ProfileData.firstName + "'s" + ' Order',
        order_id:id.id,
        prefill: {
          email: email,
          contact: ProfileData.mobileNumber,
          name: ProfileData.firstName,
        },
        theme: {color: '#364b5b'},
      };
      RazorpayCheckout.open(options).then((dd) => {
        console.log('Razor pay payment data: ', dd)
        setOrderId(dd.razorpay_order_id)
        VerifyPayment(dd.razorpay_order_id, dd.razorpay_payment_id, dd.razorpay_signature);
      }).catch((error) => {
        // GetPCart()
        AddTC()
        let des = error.error.description;
        console.log(`Error CheckoutRazorpay : ${error.code} | ${des}`);
      });
    }

    const VerifyPayment = async(oi, pi, sign) => {
      dispatch(setLoading(true));
      try {
        let CheckO = await PaymentVerification(email, oi, pi,sign);
          if ( CheckO.status === 200){
            dispatch(setLoading(false));
            setShowSuccessPurchase(true)
          } else {
            alert('VerifyPayment error')
            // setShowSuccess(false);
            dispatch(setLoading(false));
          }
      } catch (error) {
        alert("VerifyPayment error: " + error.message);
        dispatch(setLoading(false));
      }
    };

    const CheckoutServer = async () => {
      if(country === null || country === ''){
        setCountryError('Please select a country!')
      } else if (region === null || region === '') {
        setRegionError('Please select a region!')
      } else if (address1 === null || address1 === ''){
        // console.log(address1)
        setAddress1Err(true)
        address1Ref.current.focus()
      } else if (address2 === null || address2 === '') {
        // console.log(address2)
        setAddress2Err(true)
        address2Ref.current.focus()
      } else {
        try {
          console.log(email, course.courseCode, 'These are the data')
          let CheckO 
          course.courseCode ? CheckO = await CheckoutNowPost(email, course.courseCode, coupon ) : CheckO = await CheckoutNowPostAssessment(email, course.assessmentCode )
          if ( CheckO.status === 200){
            CheckoutRazorpay(CheckO.data);
          } else {
            console.log("CheckoutServer error 1: " + CheckO.message);
          }
        } catch (error) {
          console.log("CheckoutServer error 2: " + error.message);
        }
      }
    }
    
    const GetCheckOutData = async () => {
        try {
            if (email === '') {
                alert('Something is wrong, please login again');
            } else {
                let result 
                course.courseCode ? result = await CheckoutNow(email, course.courseCode, coupon ) : result = await CheckoutNowAssessment(email, course.assessmentCode )
            if (result.status === 200) {
                let cartD = result.data;
                console.log('Get vat and all => ', cartD)
                setCheckOutData(cartD)
            } else if (result.status > 200) {
                console.log('Error: ' + result.message);
            }
        }
    } catch (e) {
        GetCheckOutData()
        console.log('Error: ' + e.message);
    }
    return null
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


    const CartCard = ({props}) => {
        console.log('props: ', props)
        const cName = props.courseName ? props.courseName : props.assessmentTitle
        const courseT = cName.length > 25 ? cName.slice(0,25) + '...' : cName;
        const currency = props.currency === 'INR' ? '₹' : '$';
        return (
          <View>
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
                    value={`${props.rating}`}
                  />
                </HStack>
              
              {
                props.ratingCount !== 0 && props.hasOwnProperty('rating')  ?
                <Text style={{fontSize: 11}}>{props.rating.toFixed(1)} ({props.ratingCount})</Text>
                :
                <Text style={{fontSize: 11}}>0(0)</Text>
              }
            </HStack>
                    <View>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#000000',}}>
                        {currency}{props.fee}
                      </Text>
                    </View>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          </View>
        );
      };

    const AppBarContent = {
        title: 'Buy now',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1: 'notifications-outline',
        RightIcon2: 'person',
    };

    
    const renderLabel = () => {
        if (value || isFocus) {
        return (
            <Text style={[styles.label, isFocus && { color:"#364b5b" }]}>
            Dropdown label
            </Text>
        );
        }
        return null;
    };

    return (
        <View style={{width:width*0.95, alignSelf:"center"}}>
            <Navbar props={AppBarContent}/>

            {/* Modal to show successfull purchase */}
            <Modal isOpen={showSuccessPurchase}>
              <Modal.Content maxWidth="700px">
                <Modal.Body>
                  <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5} justifyContent="center" alignItems="center">
                    <Image source={require('../../assets/success_tick02.png')} resizeMode="contain" size="150" alt="successful" />
                    <Text fontWeight="bold" color={'black'} fontSize="17">Payment Successfully Done</Text> 
                    <HStack space={1}>
                    <Invoice props={checkOutData} orderId={orderId} />
                    <Button 
                      bg={'primary.900'}
                      colorScheme="blueGray"
                      style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                      _pressed={{bg: "#fcfcfc",
                        _text:{color: "#3e5160"}
                        }}
                        onPress={()=>{
                          setIsEmptyComponet(true)
                          course.courseCode ? navigation.navigate('Courses') : navigation.navigate('MyAssessments')
                        }}
                        >
                      Done
                    </Button>
                    </HStack>
                  </VStack>
                </Modal.Body>
              </Modal.Content>
            </Modal>

            {
              isEmptyComponent ? // if cheeckout is done the component will be empty
              <View style={{justifyContent:"center", marginTop:"5%", alignItems:"center"}}>
                <Text style={{marginLeft:5, fontSize: 13, fontWeight: 'bold'}}>No course or assessment to buy now! Kindly go back and retry.</Text>
              </View>
              :
              <>
                <CartCard props={course} />
                
                {/* Country dropdown */}
                <Text style={{fontSize: 17, color:'#000', marginTop:10, fontWeight: 'bold',}}>Billing Address</Text>
    
                <View style={{marginTop:10, marginBottom:5}}>
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
                {countryError !== null ? <Text style={{marginLeft:5, color:"red"}}>{countryError}</Text> : <></>}
                </View>
                
                {/* Region dropdown */}
    
                <View style={{marginTop:5, marginBottom:10}}>
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
                {regionError !== null ? <Text style={{marginLeft:5, color:"red"}}>{regionError}</Text> : <></>}
                </View>
                
                {/* Address bar 1 */}
    
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
                
                {/* Address bar 2 */}
    
                <View style={{marginVertical:10}}>
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
                
                {/* Apply coupon code */}
                
                {
                  Object.keys(couponList).length > 0 ?
                  <FormControl mb={5}>
                    <FormControl.Label _text={{ fontSize: 13, color: 'greyScale.800', fontWeight: 'bold', }} mb={1}>
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
                
                {/* Checkout info */}
    
                {checkOutData !== null ? 
                    <View style={{width:width*0.9, alignSelf:"center"}}>
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
                                {checkOutData.currencyCode} {checkOutData.subTotal}
                            </Text>
                            </HStack>
                            <HStack justifyContent="space-between">
                            <Text
                                color={'greyScale.800'}
                                style={{fontSize: 13, fontWeight: 'bold'}}>
                                Discount ({checkOutData.discountPercentage ? checkOutData.discountPercentage : '0'}%)
                            </Text>
                            <Text
                                color={'primary.100'}
                                style={{fontSize: 13, fontWeight: 'bold'}}>
                                {checkOutData.currencyCode  === 'USD' ? '$' : '₹'} {checkOutData.discountValue ? checkOutData.discountValue : 0}
                            </Text>
                            </HStack>
                            <HStack justifyContent="space-between">
                            <Text
                                color={'greyScale.800'}
                                style={{fontSize: 13, fontWeight: 'bold'}}>
                                Vat ({checkOutData.taxPercentage}%)
                            </Text>
                            {
                              checkOutData.taxValue ?
                              <Text
                                  color={'primary.100'}
                                  style={{fontSize: 13, fontWeight: 'bold'}}>
                                  {checkOutData.currencyCode  === 'USD' ? '$' : '₹'} {Number.isInteger(checkOutData.taxValue) ? checkOutData.taxValue : checkOutData.taxValue.toFixed(2)}
                              </Text>
                              : 
                              <Text
                                  color={'primary.100'}
                                  style={{fontSize: 13, fontWeight: 'bold'}}>0</Text>
                            }
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
                                {checkOutData.currencyCode} {checkOutData.total}
                                </Text>
                            </VStack>
                            <Button colorScheme={'primary'} onPress={()=> CheckoutServer()}>Checkout</Button>
                            </HStack>
                    </View>
                    : <></>
                }
              </>
            }

        </View>
    )
}

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
        width:width*0.75,
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
        fontSize: 16,
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

export default BuyNow