/* eslint-disable react-native/no-inline-styles */
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HStack, VStack, Image, Center, Text, Progress} from 'native-base'
import { Rating, AirbnbRating } from 'react-native-ratings'

const {width, height} = Dimensions.get('window');
const CourseCard = ({props}) => {
  const [courseTitle, setCourseTitle] = useState();
  const [currencyType, setCurrencyType] = useState();
  const [rating, setRating] = useState(props.rating)

  const data = props;
  console.log(props)

  useEffect(() => {
    let cName = data.courseName;
    // let courseT = cName.slice(0,25);
    // if (cName.length > 25){
    //   setCourseTitle(courseT + '...');
    // } else {
      setCourseTitle(cName);
    // }

    // console.log(props);

  //   if (data.currency === 'USD'){
  //     setCurrencyType('$');
  //   } else {
  //     setCurrencyType('₹');

  //   }

  },[]);
  return (
    <View>
      <HStack style={styles.CourseCard} space={2}>
        <Center>
          <Image
            style={styles.cardImg}
            source={{uri: props.thumbNailImagePath}}
            alt="courseimg"
            resizeMode="cover"
          />
        </Center>
        <VStack style={styles.CardContent}>
          <View style={{justifyContent:"space-between", flexDirection:"row"}}>
            <Text
              noOfLines={2}
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#000000',
                maxWidth: width*0.4,
              }}>
            {courseTitle}
            </Text>
              {data.isLive
                ?
                <View>
                  <Text pr={2} pl={2} borderRadius={20} style={{fontSize:10, backgroundColor:'#F65656', color:'#FFF'}}>Live Courses</Text>
                </View>
                :
                <></>
              }
          </View>

          <HStack alignItems={'center'} justifyContent={'space-between'}>
            <HStack space={1}>
              <Text
                style={{fontSize: 10, fontWeight: 'bold', maxWidth: width / 4}}
                color={'greyScale.800'}>
                By
              </Text>
              <Text
                style={{fontSize: 10, fontWeight: 'bold', maxWidth: width / 2.5}}
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
            <AirbnbRating
              count={5}
              isDisabled={true}
              showRating={false}
              defaultRating={`${rating}`}
              size={10}
              // selectedColor={colors[2]}
              value={`${rating}`}
              // style={{marginHorizontal:4}}
              // ratingContainerStyle={{ marginHorizontal:10, marginTop:20, }}
              // starContainerStyle={{paddingVertical:10,}}     
              // onFinishRating={ratingCompleted}
            />
              {/* <HStack space={1}>
                   {
                    [...Array(props.rating)].map((e, i) =>{
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
                    [...Array(5 - props.rating)].map((e, i) =>{
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
              </HStack> */}
              {
                props.rating >= 0 ? 
                <Text
                  style={{fontSize: 10, fontWeight: '600'}}
                  color={'greyScale.800'}>
                  {props.rating.toFixed(1)} ({props.ratingCount})
                </Text>
                : null
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
                  {props.learnersCount > 0 ? props.learnersCount : 0} Learners
                </Text>
              </HStack>
            </HStack>
            <View>
              <Text
                style={{fontSize: 10, fontWeight: 'bold', color: '#000000'}}>
                ₹{props.fee}
              </Text>
            </View>
          </HStack>

        { data.courseProgressPercentage === 100 ?
         <HStack alignItems={'center'} space={2}>
            <Image
            source={require('../../../assets/CompletedTick.png')}
            size={4}
            alt={'completed'}
            />
            <Text fontSize={12} bold color={'black'}>Completed!</Text>
          </HStack>
        : 
          <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
            {
              data.courseProgressPercentage ?
              <Text style={{marginRight:10, fontSize: 10, fontWeight: '600'}}>{Number.isInteger(data.courseProgressPercentage) ? data.courseProgressPercentage : data.courseProgressPercentage.toFixed(2)}%</Text>
              : 
              <Text style={{marginRight:10, fontSize: 10, fontWeight: '600'}}>0%</Text>
            }
            <Progress
              size={'xs'}
              style={{width:width*0.5}}
              mb={1}
              mt={1}
              value={data.courseProgressPercentage}
              color={'primary.100'}
            />
          </View>
          }
         
        </VStack>
      </HStack>
    </View>
  );
};
export default CourseCard;

const styles = StyleSheet.create({
  CourseCard: {
    alignItems: 'center',
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
    height: width*0.17,
    width: width*0.27,
    borderRadius: 5,
  },
  CardContent: {
    width:width*0.59,
  },
});
