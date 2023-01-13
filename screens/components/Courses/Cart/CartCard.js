import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HStack, VStack, Image, Center, Text, Button} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '../../../Redux/Features/authSlice';
import {BaseURL} from '../../../StaticData/Variables';

const {width, height} = Dimensions.get('window');
const CartCard = ({props}) => {
  const dispatch = useDispatch();
  const [courseTitle, setCourseTitle] = useState();
  const [currencyType, setCurrencyType] = useState();
  const email = useSelector(state => state.Auth.Mail);
  // console.log(props.courseCode);
  //   const navigation = props.navigation;
  //   const data = props.data;
  //   var cName = data.courseName;

  //   const courseT = cName.slice(0,25);
  // useEffect(() => {
  //   if (cName.length > 25){
  //     setCourseTitle(courseT + '...');
  //   } else {
  //     setCourseTitle(cName);
  //   }

  //   if (data.currency === 'USD'){
  //     setCurrencyType('$');
  //   } else {
  //     setCurrencyType('₹');

  //   }

  // },[]);

  const RemoveFromCart = async code => {
    dispatch(setLoading(true));
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'POST',
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
            console.log(result);
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
          alert('CError: ' + error);
        });
    }
  };
  return (
    <View>
      <VStack style={styles.CourseCard} mt={3}>
        <HStack space={3}>
          <Center>
            <Image
              style={styles.cardImg}
              source={require('../../../../assets/Home/coursecard.png')}
              alt="courseimg"
              resizeMode="cover"
            />
          </Center>
          <VStack style={styles.CardContent}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#000000',
                maxWidth: width / 2.5,
              }}>
              {props.courseName}
            </Text>

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
                    maxWidth: width / 4,
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
              <HStack space={2} alignItems={'center'}>
                <HStack space={1}>
                  <Image
                    source={require('../../../../assets/Home/star.png')}
                    alt="rating"
                    size="3"
                  />
                  <Image
                    source={require('../../../../assets/Home/star.png')}
                    alt="rating"
                    size="3"
                  />
                  <Image
                    source={require('../../../../assets/Home/star.png')}
                    alt="rating"
                    size="3"
                  />
                  <Image
                    source={require('../../../../assets/Home/star.png')}
                    alt="rating"
                    size="3"
                  />
                  <Image
                    source={require('../../../../assets/Home/star.png')}
                    alt="rating"
                    size="3"
                  />
                </HStack>

                <Text
                  style={{fontSize: 8, fontWeight: '600'}}
                  color={'greyScale.800'}>
                  5.0 (150)
                </Text>

                {/* <HStack space={1} alignItems={'center'}>
                        <Image
                        alt="graduate icon"
                        source={require('../../../../assets/Home/graduate_student.png')}
                        size="3"
                        />
                        <Text style={{fontSize: 10,fontWeight: '600'}} color={'greyScale.800'}>
                            7 Learners
                        </Text>
                    </HStack> */}
              </HStack>
              <View>
                <Text
                  style={{fontSize: 10, fontWeight: 'bold', color: '#000000'}}>
                  ${props.fee}
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
            RemoveFromCart(props.courseCode);
          }}>
          Remove from Cart
        </Button>
      </VStack>
    </View>
  );
};
export default CartCard;

const styles = StyleSheet.create({
  CourseCard: {
    alignItems: 'center',
    maxHeight: height / 6.5,
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
    width: width / 5,
    borderRadius: 5,
  },
  CardContent: {
    minWidth: width / 1.7,
  },
});
