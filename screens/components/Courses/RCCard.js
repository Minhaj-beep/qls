import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HStack, VStack, Image, Center, Text} from 'native-base';
import { AirbnbRating } from 'react-native-ratings';

const {width, height} = Dimensions.get('window');
const RcCard = ({props}) => {
  const [courseTitle, setCourseTitle] = useState();
  const [currencyType, setCurrencyType] = useState();
  //   const navigation = props.navigation;
  var cName = props.courseName;
  // const courseT = cName.slice(0, 25);
  // console.log(props)
  const currency = props.currency === 'INR' ? '₹' : '$';
  // console.log(props.currency)
  // let RCount = props.rating;
  // console.log(props)

  // useEffect(() => {
  //   if (cName.length > 25) {
  //     setCourseTitle(courseT + '...');
  //   } else {
  //     setCourseTitle(cName);
  //   }
  //   // console.log(props.currency);
  // }, [cName,courseT]);

  // console.log(props);
  return (
    <HStack style={styles.CourseCard} space={4} mb={2}>
      <Center>
        <Image
          style={styles.cardImg}
          // source={require('../assets/coursecard.png')}
          source={{uri: props.thumbNailImagePath}}
          alt="courseimg"
          resizeMode="cover"
        />
      </Center>
      <VStack style={styles.CardContent} space={1}>
        <HStack justifyContent="space-between" alignItems="center" space={2}>
          <Text
          numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#000000',
              maxWidth: width *0.5,
            }}>
            {cName}
          </Text>
        </HStack>

        <HStack>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color:"#8C8C8C", marginRight:2, maxWidth: width / 4, }} >
            By
          </Text>
          <Text noOfLines={1}
            style={{ fontSize: 10, fontWeight: 'bold', color:"#364b5b", maxWidth: width*0.8, }}
            color={'primary.100'}>
            {props.instructorName}
          </Text>
        </HStack>

        <HStack space={2} width={width *0.5} alignItems={'center'}>
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
            {/* {
                    [...Array(RCount)].map((e, i) =>{
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
                  } */}
            {/* <Image
                    source={require('../../../assets/Home/star.png')}
                    alt="rating"
                    size="3"
                    /> */}
          </HStack>
          
          {
            props.hasOwnProperty('rating') ?
            <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>{props.rating === parseInt(props.rating) ? props.rating : props.rating.toFixed(1)} ({props.ratingCount})</Text>
            :
            <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>{0} ({0})</Text>
          }

          <HStack space={1} alignItems={'center'}>
            <Image
              alt="graduate icon"
              source={require('../../../assets/Home/graduate_student.png')}
              size="3"
            />
            <Text
              style={{fontSize: 10, fontWeight: '600'}}
              color={'greyScale.800'}>
              {props.learnersCount ? props.learnersCount : '0'} Learners
            </Text>
          </HStack>
        </HStack>
        <HStack alignItems="center" justifyContent={'space-between'}>
          <HStack space={2}>
            <Text
              color={'greyScale.800'}
              style={{fontSize: 10, fontWeight: '600'}}>
              Fee
            </Text>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000000'}}>
              {currency}{props.fee}
            </Text>
          </HStack>
          { props.isLive ? <Text pr={2} pl={2} borderRadius={20} style={{fontSize:10, backgroundColor:'#F65656', color:'#FFF'}}>Live Courses</Text> : null}
        </HStack>
      </VStack>
    </HStack>
  );
};
export default RcCard;

const styles = StyleSheet.create({
  CourseCard: {
    // maxHeight: height / 8.5,
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
    height: width*0.2,
    width: width / 3.2,
    borderRadius: 5,
  },
  CardContent: {
    // minWidth: width / 1.7,
  },
});
