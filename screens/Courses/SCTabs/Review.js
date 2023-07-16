import {StyleSheet, View,Dimensions} from 'react-native';
import React,{useEffect, useState} from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {Progress,  HStack, VStack,Text,Image,Center,Container, TextField, Button} from 'native-base';
import {useSelector} from 'react-redux';
import {GetRating} from '../../Functions/API/GetRating';
import moment from 'moment';
import { Rating, AirbnbRating } from 'react-native-ratings'
import Icon from 'react-native-vector-icons/AntDesign';
import { CourseReview } from '../../Functions/API/CourseReview';

const {width, height} = Dimensions.get('window');

const Review = () => {
  const CourseDD = useSelector(state => state.Course.SCData);
  const FullCourseData = useSelector(state => state.Course.FullCourseData);
  const CourseData = CourseDD.CDD;
  // console.log('________________________________')
  // console.log(FullCourseData.isRated)
  // console.log('________________________________')
  const email = useSelector(state => state.Auth.Mail);
  const JWT = useSelector(state => state.Auth.JWT);
  const GUser = useSelector(state => state.Auth.GUser);
  const [Rating, setRating] = useState();
  const [ReviewList, setReviewList] = useState();
  const [AvgRate, setAvgRate] = useState();
  const [isLive, setIsLive] = useState();
  const [IsRating, setIsRating] = useState(false);
  const [newRating, setNewRating] = useState(null)
  const [newReview, setNewReview] = useState('')
  const [reviewError, setReviewError] = useState('')

  useEffect(()=>{
    setIsLive(CourseData.isLive ? true : false);
    GetR(email,CourseData.courseCode);
  },[CourseData,email]);

  const GetR = async (mail, code) => {
    try {
     let response = await GetRating(mail, code);
     if (response.status === 200){
        // console.log('Rating updated successfully');
        if ( response.message === 'No ratings yet.') {
          setIsRating(false);
        } else {
          let data = response.data;
          let AVRating = data.averageRating[0];
          setAvgRate(AVRating.avgRating);
          setReviewList(data.reviewList);
          setRating(data);
          // console.log('What is reating data:', data)
          setIsRating(true);
        }
     } else {
       console.log("GetR error :" + response.message);
       GetR(email,CourseData.courseCode)
     }
    } catch (err) {
     console.log("GetR error :" + err.message);
     GetR(email,CourseData.courseCode)
    }
   };

   const RatingPercentage = (props) => {
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
        <Text color={'#000'} fontSize={9} fontWeight={'bold'}>{parseInt(props.percent) === props.percent ? props.percent : parseInt(props.percent)}%</Text>
         </HStack>
      </HStack>
    );
   };

   const StudenRating = (props) => {
    let RD = props.props;
    let date = moment(RD).format('DD MMM YYYY');
    // console.log(RD);
    return (
      <HStack mt={7} maxW={width / 1.3} space={2}>
      <Container>
        {
          RD.hasOwnProperty('userProfileImgPath') ?
            <Image source={{uri:RD.userProfileImgPath}} alt="profile" size={10} rounded={20}/>
          :
            <Image source={require('../../../assets/personIcon.png')} alt="profile" size={10} rounded={20}/>
        }
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
        "{RD.reviewContent}"
        </Text>
      </VStack>
    </HStack>
    );
   };

   const sendRating = () => {
    // console.log(newRating, newReview)
    if(newRating === null){
      setReviewError('Please insert the start rating!')
    } else if(newReview.trim() === ''){
      setReviewError('Please insert the your review about the course!')
    } else {
      sendReviewAndRating()
    }
   }

   const sendReviewAndRating = async () => {
    try {
      const result = await CourseReview(GUser, email, JWT, newRating, newReview, CourseData.courseCode)
      console.log(result)
      if(result.status === 200) {
        console.log(result)
        alert(result.message)
        GetR(email,CourseData.courseCode)
      } else {
        console.log('_____________sendReviewAndRating error 1_________', result)
        alert(result.message)
      }
    } catch (e) {
      console.log('_____________sendReviewAndRating error 2_________', e)
      alert("Server Error! Please try again.")
    }
   }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {
        CourseDD.type === "Purchased" && !FullCourseData.isRated ?
        <VStack>
          <HStack alignItems={"center"} >
            <Icon size={13} name="staro" color="#000" />
            <Text ml={1} color={'greyScale.800'} fontSize={13} fontWeight={500}>Rate this course</Text>
          </HStack>
          <AirbnbRating
            count={5}
            isDisabled={false}
            showRating={false}
            defaultRating={`${0}`}
            size={20}
            value={`${5}`}
            // ratingContainerStyle={{ marginHorizontal:10, marginTop:20, }}
            starContainerStyle={{paddingVertical:5,}}     
            onFinishRating={(r)=>setNewRating(r)}
          />
          <TextField mt={2} onChangeText={(text)=>{
            setNewReview(text)
            setReviewError('')
          }} placeholder={'Write your experience ..'}></TextField>
          {reviewError !== '' && newRating === null ? <Text color={'#f00'} mt={-3} mb={1} fontSize={9} fontWeight={'bold'} alignSelf={'flex-start'}>{reviewError}</Text> : null}
          {reviewError === 'Please insert the your review about the course!' ? <Text color={'#f00'} mt={-3} mb={1} fontSize={9} fontWeight={'bold'} alignSelf={'flex-start'}>{reviewError}</Text> : null}
          <Button mt={0}  mb={2} bg={'primary.50'} _text={{ color:'secondary.50', fontSize:14, fontWeight:'bold' }} _pressed={{backgroundColor:'#F0E1EB', opacity:'0.5' }} onPress={ ()=> sendRating()}>Submit</Button>
        </VStack>
        : null
      }
      { IsRating === false ?
        <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'} mt={2}>No ratings yet</Text>
      :
      <VStack>
        <HStack alignSelf={'center'}>
          <VStack alignItems={'center'} space={1}>
            <Text color={'#FFBE40'} fontSize={20} fontWeight={'bold'}>{AvgRate.toFixed(1) || 0 }</Text>
            {/* <HStack space={1}>
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
            </HStack> */}
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
        <View style={{zIndex:1000, elevation:1000}} >
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
  },
});
