import {StyleSheet, View,Dimensions,ScrollView} from 'react-native';
import React,{useEffect, useState} from 'react';
import {Progress, HStack, VStack,Text,Image,Center,Container} from 'native-base';
import {useSelector} from 'react-redux';
import {GetRating} from '../../Functions/API/GetRating';
import moment from 'moment';

const {width, height} = Dimensions.get('window');

const Review = () => {
  const CourseDD = useSelector(state => state.Course.SCData);
  const CourseData = CourseDD.CDD;
  const email = useSelector(state => state.Auth.Mail);
  const [Rating, setRating] = useState();
  const [ReviewList, setReviewList] = useState();
  const [AvgRate, setAvgRate] = useState();
  const [isLive, setIsLive] = useState();
  const [IsRating, setIsRating] = useState(false);

  useEffect(()=>{
    setIsLive(CourseData.isLive ? true : false);
    GetR(email,CourseData.courseCode);
  },[CourseData,email]);

  const GetR = async (mail, code) => {
    try {
     let response = await GetRating(mail, code);
     if (response.status === 200){
        console.log('Rating updated successfully');
        if ( response.message === 'No ratings yet.') {
          setIsRating(false);
        } else {
          let data = response.data;
          let AVRating = data.averageRating[0];
          setAvgRate(AVRating.avgRating);
          setReviewList(data.reviewList);
          setRating(data);
          setIsRating(true);
        }
     } else {
       console.log("GetR error :" + response.message);
      //  alert("GetR error :" + response.message);
     }
    } catch (err) {
     console.log("GetR error :" + err.message);
    //  alert("GetR error :" + err.message);
    }
   };

   const RatingPercentage = (props) => {
    // console.log(props);
    return (
      <HStack alignItems={'center'} justifyContent={'space-between'} space={1} width={width/1.5}>
          <Center w="60%">
            <VStack width={width / 3 } space={2}>
              <Progress rounded="0" value={props.percent} size="xs"/>
            </VStack>
          </Center>
         <HStack space={1}>
          {
              [...Array(props.star)].map((e, i) =>{
                  return (
                    <Image
                      key={i}
                      source={require('../../../assets/Home/star.png')}
                      alt="rating"
                      size="2"
                    />
                  );
                }
              )
            }
        <Text color={'#000'} fontSize={9} fontWeight={'bold'}>65%</Text>
         </HStack>
      </HStack>
    );
   };

   const StudenRating = (props) => {
    let RD = props.props;
    let date = moment(RD).format('DD MMM YYYY');
    console.log(RD);
    return (
      <HStack mt={7} maxW={width / 1.3} space={2}>
      <Container>
        <Image source={require('../../../assets/profile.png')} alt="profile" size={10} rounded={20}/>
      </Container>
      <VStack space={1}>
        <HStack justifyContent={'space-between'} width={width / 1.4}>
          <Text color={'#000'} fontSize={14} fontWeight={'bold'} maxWidth={width / 3}>{RD.userName}</Text>
          <Text color={'#000'} fontSize={9} fontWeight={'bold'} alignSelf={'flex-end'}>{date}</Text>
        </HStack>
        <HStack space={1} alignSelf={"flex-start"}>
          {
            [...Array(RD.rating)].map((e, i) =>{
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
        </HStack>
        <Text color={'greyScale.800'} fontSize={12} fontWeight={500} maxW={width / 1.3}>
        “ {RD.reviewContent}
        </Text>
      </VStack>
    </HStack>
    );
   };

  return (
    <ScrollView style={styles.container}>
      {isLive || IsRating === false ?
        <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'} mt={2}>No ratings yet</Text>
      :
      <VStack>
        <HStack maxW={width}>
          <VStack alignItems={'center'} space={1}>
            <Text color={'#FFBE40'} fontSize={20} fontWeight={'bold'}>{AvgRate || 0 }</Text>
            <HStack space={1}>
              {
                [...Array(AvgRate || 0)].map((e, i) =>{
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
            </HStack>
            <Text color="#000" fontSize={14} fontWeight="bold">{Rating.numberOfRatings || 0} Ratings</Text>
          </VStack>
          <VStack>
            <RatingPercentage percent={Rating.percentageOfOneStar} star={1}/>
            <RatingPercentage percent={Rating.percentageOfTwoStar} star={2}/>
            <RatingPercentage percent={Rating.percentageOfThreeStar} star={3}/>
            <RatingPercentage percent={Rating.percentageOfFourStar} star={4}/>
            <RatingPercentage percent={Rating.percentageOfFiveStar} star={5}/>
          </VStack>
        </HStack>
        <View>
          {
            ReviewList.map((data, index)=>{
              return (
                <VStack key={index} space={2}>
                  <StudenRating props={data}/>
                </VStack>
              );
            })
          }
        </View>
      </VStack>
      }
    </ScrollView>
  );
};

export default Review;

const styles = StyleSheet.create({
  container:{
    padding:10,
    height: height / 3,
  },
});
