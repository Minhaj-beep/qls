/* eslint-disable react-native/no-inline-styles */
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HStack, VStack, Image, Center, Text, Progress} from 'native-base';

const {width, height} = Dimensions.get('window');
const CourseCard = ({props}) => {
  const [courseTitle, setCourseTitle] = useState();
  const [currencyType, setCurrencyType] = useState();

  const data = props;
  console.log(props)

  useEffect(() => {
    let cName = data.courseName;
    let courseT = cName.slice(0,25);
    if (cName.length > 25){
      setCourseTitle(courseT + '...');
    } else {
      setCourseTitle(cName);
    }

    // console.log(props);

  //   if (data.currency === 'USD'){
  //     setCurrencyType('$');
  //   } else {
  //     setCurrencyType('₹');

  //   }

  },[]);
  return (
    <View>
      <HStack style={styles.CourseCard} space={3}>
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
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#000000',
                maxWidth: width / 2.5,
              }}>
            {courseTitle}
            </Text>
              {data.isLive
                ?
                <Text numberOfLines={2} style={{fontSize: 13, backgroundColor:"#EDAEC0", paddingHorizontal:5, paddingVertical:1, borderRadius:5, bottom:5, color: '#FFF',}} >
                  Live
                </Text>
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
              <HStack space={1}>
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
              </HStack>

              <Text
                style={{fontSize: 10, fontWeight: '600'}}
                color={'greyScale.800'}>
                {props.rating}
              </Text>

              <HStack space={1} alignItems={'center'}>
                <Image
                  alt="graduate icon"
                  source={require('../../../assets/Home/graduate_student.png')}
                  size="3"
                />
                <Text
                  style={{fontSize: 10, fontWeight: '600'}}
                  color={'greyScale.800'}>
                  {props.learners.length} Learners
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
            <Text fontSize={12} color={'greyScale.800'}>Completed!</Text>
          </HStack>
        : <Progress
            size={'xs'}
            mb={1}
            mt={1}
            value={data.courseProgressPercentage}
            color={'primary.100'}
          />}
         
        </VStack>
      </HStack>
    </View>
  );
};
export default CourseCard;

const styles = StyleSheet.create({
  CourseCard: {
    alignItems: 'center',
    maxHeight: height / 9,
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
