/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View,SafeAreaView,ScrollView,Dimensions} from 'react-native';
import React,{useEffect, useState} from 'react';
import Navbar from './components/Navbar';
import { VStack, HStack, Center, Image, Button,useToast} from 'native-base';
import { GetWishList } from './Functions/API/GetWishList';
import {useSelector, useDispatch} from 'react-redux';
import {AddToCart} from './Functions/API/AddToCart';
import {RemoveFromWL} from './Functions/API/RemoveFromWL';

const {width, height} = Dimensions.get('window');

const Wishlist = ({navigation}) => {

  const toast = useToast();
  const email = useSelector(state => state.Auth.Mail);
  const [WishData, setWishData] = useState('');

  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      GetWList();
    });
    return unsubscribe;
  },[navigation]);

  const AppBarContent = {
    title: 'Wishlist',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  const GetWList = async() => {
    try {
      let response = await GetWishList(email);
      // console.log(response.data.length);
      if (response.status === 200) {
        console.log(response.message);
        if (response.data.length !== 0){
          setWishData(response.data);
        } else {
          setWishData('');
        }
      }
    }
    catch (e) {
      console.log(e.message);
    }
  };

  const AddTC = async (code) => {
    try {
      let cart = await AddToCart(email, code);
      if (cart.status === 200) {
        toast.show({
          description: cart.message,
        });
        GetWList();
      } else {
        toast.show({
          description: cart.message,
        });
        console.log(cart.message);
      }
      // console.log(cart);
    } catch (e) {

    }
  };

  const RemoveWish = async (code) => {
    try {
      let response = await RemoveFromWL(email, code);
      if (response.status === 200) {
        toast.show({
          description: response.message,
        });
        GetWList();
      } else {
        toast.show({
          description: response.message,
        });
        console.log(response.message);
      }
      console.log(response);
    } catch (e) {

    }
  };

  const WishCard = ({props}) => {
    console.log('Whishlist props : ', props)
    const currency = props.currency === 'INR' ? '₹' : '$';
    return (
      <View>
        <View style={{backgroundColor:"#FFF", borderRadius:5, alignItems:"center", marginBottom:10}}>
          <View style={{ width:"95%"}}>
            <View style={{flexDirection:"row", marginTop:10, marginBottom:10}}>
              <View>
                <Image
                  style={styles.cardImg}
                  source={{uri: props.thumbNailImagePath}}
                  alt="courseimg"
                  resizeMode="cover"
                />
              </View>
              <View style={{flex:1, flexDirection:"row", marginLeft:5, justifyContent:"space-between"}}>
                  <View>
                    <Text
                      numberOfLines={2}
                      style={{ fontSize: 12, fontWeight: 'bold', color: '#000000', maxWidth: width / 2.5,}}>
                      {props.courseName}
                    </Text>
                    <View style={{flexDirection:"row"}}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color:"#8C8C8C", marginRight:2, maxWidth: width / 4, }} >
                        By
                      </Text>
                      <Text
                        style={{ fontSize: 10, fontWeight: 'bold', color:"#364b5b", maxWidth: width / 4, }}
                        color={'primary.100'}>
                        {props.instructorName}
                      </Text>
                    </View>
                    <View style={{flexDirection:"row", marginTop:5}}>
                      <Image
                        source={require('../assets/Home/unstar.png')}
                        alt="rating"
                        size="3"
                      />
                      <Image
                        source={require('../assets/Home/unstar.png')}
                        alt="rating"
                        size="3"
                      />
                      <Image
                        source={require('../assets/Home/unstar.png')}
                        alt="rating"
                        size="3"
                      />
                      <Image
                        source={require('../assets/Home/unstar.png')}
                        alt="rating"
                        size="3"
                      />
                      <Image
                        source={require('../assets/Home/unstar.png')}
                        alt="rating"
                        size="3"
                      />
                      <Text style={{fontSize: 11, color:"#8C8C8C"}}>
                        {props.rating}({props.ratingCount})
                      </Text>
                    </View>
                  </View>
                  <View>
                    {/* <Text numberOfLines={2} style={{backgroundColor:"blue"}}>
                      {props.isLive ? "Live" : "Recorded"}
                    </Text> */}
                    {props.isLive
                      ?
                      <Text pr={2} pl={2} borderRadius={20} style={{fontSize:10, paddingHorizontal:5, paddingVertical:1, borderRadius:10, backgroundColor:'#F65656', color:'#FFF'}}>Live Courses</Text>
                      :
                      <></>
                    }
                    <Text
                      style={{fontSize: 10, color:"#8C8C8C", fontWeight: 'bold'}}>
                      Fee
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#000000',
                      }}>
                      {currency}{props.fee}
                    </Text>
                  </View>
              </View>
            </View>
          </View>
          <HStack space={5} m={2} justifyContent={'center'}>
            <Button
              _text={{color: '#364b5b', fontSize: 12, fontWeight: 'bold'}}
              style={{backgroundColor: 'rgba(54, 75, 91, 0.5)', width:width / 2.6}}
              _pressed={{backgroundColor: '#FFFFFF', opacity: 0.3}}
              p={2}
              onPress={() => {
                RemoveWish(props.courseCode);
              }}>
              Remove from Wishlist
            </Button>
            <Button
              _text={{color: '#FFF', fontSize: 12}}
              bg={'primary.100'}
              style={{ width:width / 2.6}}
              _pressed={{backgroundColor: '#FFFFFF', opacity: 0.5}}
              p={2}
              onPress={() => {
                AddTC(props.courseCode);
              }}>
              Add to Cart
            </Button>
         </HStack>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <Navbar props={AppBarContent} />
    <ScrollView
      contentContainerStyle={styles.TopContainer}
      nestedScrollEnabled={true}>

      {WishData !== '' ?
        <VStack m={5} space={3}>
          {
            WishData.map((data, index)=>{
              return (
                <View key={index}>
                  <WishCard props={data}/>
                </View>
              );
            })
          }
        </VStack>
      : 
      <View style={{alignItems:'center'}}>
        <Text color={'greyScale.800'} fontSize={10}>No items to show yet!</Text>
      </View>
      }

    </ScrollView>
    </SafeAreaView>
  );
};

export default Wishlist;

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
    marginTop: 20,
  },
  CourseCard: {
    alignItems: 'center',
    maxHeight: height / 6,
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
