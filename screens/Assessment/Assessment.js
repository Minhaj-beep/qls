/* eslint-disable no-alert */
import { StyleSheet, View,ScrollView,Dimensions,SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { VStack,Icon, IconButton,Radio,FormControl,HStack,Button,Text,Image } from 'native-base';
import {useDispatch,useSelector} from 'react-redux';
import Navbar from '../components/Navbar';
import {setLoading} from '../Redux/Features/authSlice';
import {AttendAssessment} from '../Functions/API/AttendAssessment';
import {AssessmentTryAgain} from '../Functions/API/AssessmentTryAgain';
import { GetCourseByCode } from '../Functions/API/GetCourseByCode';

import AssessmentRadio from '../components/Assessment/AssessmentRatio';

const { width, height } = Dimensions.get('window');

const Assessments = ({navigation}) => {

  const AData = useSelector(state => state.Course.AssessmentData);
  const AssessmentData = AData.Data;
  const [IsCompleted, setIsCompleted] = useState(AssessmentData.isCompleted);
  const [IsAssessmentPass,setIsAssessmentPass] = useState(false);
  const [SResult, setSResult] = useState(false);
  const [ResultData, setResultData] = useState();
  const CData = useSelector(state => state.Course.SCData);
  const type = CData.type;
  const CourseData = CData.CDD;
  const email = useSelector(state => state.Auth.Mail);
  const [AssessmentD, setAssessmentD] = useState();
  const AnswerMap = new Map();
  const dispatch = useDispatch();

  const WrongImg = require('../../assets/CompletedTick.png');
  const CorrectImg = require('../../assets/wrong.png');

  const AppBarContent = {
    title: 'Assessment',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person',
  };

  const Submit = async() => {
    dispatch(setLoading(true));
    if ( AnswerMap.size > 0 ) {
      const Answers = [];
      AnswerMap.forEach((data, index)=>{
        let ans = {
          'assessmentOrder':index,
          'answer':data,
        };
        Answers.push(ans);
      });
      let body = {
        'chapterOrder': AData.chapterOrder,
        'lessonOrder':AssessmentData.lessonOrder,
        'answers':Answers,
      };
      try {
        let response = await AttendAssessment(email, CourseData.courseCode, body);
        if (response.status === 200 ){
          if (response.message === 'Progress already saved for this details.'){
            alert("Submit error: " + response.message);
            dispatch(setLoading(false));
          } else {
            setResultData(response.data);
            let DD = response.data;
            setIsAssessmentPass(DD.isAssessmentPass);
            setAssessmentD(DD.answers);
            setSResult(true);
            dispatch(setLoading(false));
          }
        } else {
          alert("Submit error: " + response.message);
          dispatch(setLoading(false));
        }
      } catch (e) {
        alert("Submit error: " + e.message);
        dispatch(setLoading(false));
      }
    } else {
      alert('Please attend at least one Question!');
      dispatch(setLoading(false));
    }
  };

  // const GetCourseDetails = async(mail, code) =>{
  //   try {
  //     let response = await GetCourseByCode(mail, code);
  //     if (response.status === 200) {
  //       dispatch(setFullCourseData(response.data));
  //     } else {
  //       console.log(response.message);
  //       alert(response.message);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     alert(error.message);
  //   }
  // };

  const TryAssessmentAgain = async() => {
    dispatch(setLoading(true));
    let body = {
      'chapterOrder': AData.chapterOrder,
      'lessonOrder':AssessmentData.lessonOrder,
    };
    try {
      let response = await AssessmentTryAgain(email, CourseData.courseCode, body);
      if ( response.status === 200){
        alert('Now you can try again!');
        dispatch(setLoading(false));
      } else {
        alert("TryAssessmentAgain error : " + response.message);
        dispatch(setLoading(false));
      }
    } catch (e) {
      alert("TryAssessmentAgain error : " + e.message);
      dispatch(setLoading(false));
    }
  };

  const RenderR = ({props}) => {
    let Choice = props.assessmentChoice;
    return (
      <VStack space={2}>
          <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width / 1}}>
            {props.assessmentOrder}. {' '} {props.assessmentQuestion}
          </Text>
      <HStack space={6} m={2} justifyContent="space-between">
        <View>
          <Radio.Group size="sm" name="Radio01" colorScheme={'primary'} onChange={(value)=>{
            AnswerMap.set(props.assessmentOrder ,Choice[value]);
           }}>
           {
            Choice.map((data, index)=> {
              return (
                <Radio value={index} my={1} key={index} size="sm">
                  {data}
                </Radio>
              );
            })
            }
          </Radio.Group>
        </View>
        <View>
          <Text style={{fontSize:13,borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>{props.point} Points</Text>
        </View>
      </HStack>
    </VStack>
    );
  };

  const RenderRR = ({props}) => {
    let Choice = props.assessmentChoice;
    return (
      <VStack space={2}>
        <HStack alignItems={'center'} space={3} mt={4}>
          <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width / 1}}>
            {props.assessmentOrder}. {' '} {props.assessmentQuestion}
          </Text>
          <View>

            { props.isCorrect === false ?
              <HStack bg={'#FBCBCB'} alignItems={'center'} space={1} p={1} borderRadius={20}>
              <Image source={CorrectImg} alt={'status'} size={3}/>
              <Text color={'#F65656'} fontSize={8}>Wrong</Text>
            </HStack>
              :
            <HStack bg={'#BDF0CF'} alignItems={'center'} space={1} p={1} borderRadius={20}>
              <Image source={WrongImg} alt={'status'} size={3}/>
              <Text color={'#29D363'} fontSize={8}>Correct</Text>
            </HStack>}

          </View>
        </HStack>
        <Text fontSize={12} color={'greyScale.800'}>Answer: {props.assessmentAnswer}</Text>
      <HStack space={6} m={2} justifyContent="space-between">
        <View>
          <Radio.Group isDisabled size="sm" name="Radio01" colorScheme={'primary'} defaultValue={Choice.indexOf(props.givenAssessmentAnswer)} onChange={(value)=>{
            AnswerMap.set(props.assessmentOrder ,Choice[value]);
           }}>
           {
            Choice.map((data, index)=> {
              return (
                <Radio value={index} my={1} key={index} size="sm" >
                  {data}
                </Radio>
              );
            })
            }
          </Radio.Group>
        </View>
        <View>
          <Text style={{fontSize:13,borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>{props.point} Points</Text>
        </View>
      </HStack>
    </VStack>
    );
  };

  useEffect(()=>{
    setAssessmentD(AssessmentData.assessmentDetails);
    setIsCompleted(AssessmentData.isCompleted);
    setSResult(AssessmentData.isCompleted);
    console.log("Assessment:")
    console.log(AssessmentData);
    setResultData(AssessmentData);
    setIsAssessmentPass(AssessmentData.isAssessmentPass);
  },[AssessmentData]);

  const RenderAssessment = () => {
    return AssessmentD.map((data,index) =>{
      return (
        <VStack key={index} mt={1}>
         {SResult ? <RenderRR props={data}/> : <RenderR props={data}/>}
        </VStack>
      );
    });
  };

  
  return (
    <SafeAreaView>
      <Navbar props={AppBarContent} />
      <VStack>
        <ScrollView style={styles.container}>
         { SResult ?
          <View>
            {console.log("Result data: ",ResultData)}
              { IsAssessmentPass ?
                <HStack justifyContent={'space-between'} bg={'#BDF0CF'} p={4} mt={4}>
                  <VStack space={1}>
                    <Text fontSize={12} fontWeight={'bold'}>Congratulations 🎉 You Passed!</Text>
                    <Text fontSize={9} fontWeight={'bold'}>Grade Received {
                        parseInt(ResultData.assessmentPercentage) === ResultData.assessmentPercentage
                        ? ResultData.assessmentPercentage : ResultData.assessmentPercentage.toFixed(2)
                    } %</Text>
                  </VStack>
                  <VStack>
                    <Button
                      p={2}
                      bg={'#29D363'}
                      _text={{fontSize:10, fontWeight:'bold', color:'#FFFFFF'}}
                      onPress={() => navigation.goBack()}
                      >
                      Go To Next
                    </Button>
                  </VStack>
                </HStack>
                :
                <HStack justifyContent={'space-between'} bg={'#FBCBCB'} p={4} mt={4}>
                  <VStack space={1}>
                    <Text fontSize={12} fontWeight={'bold'}>Try Again! Once you are ready</Text>
                    <Text fontSize={9} fontWeight={'bold'}>Grade Received {
                      parseInt(ResultData.assessmentPercentage) === ResultData.assessmentPercentage
                      ? ResultData.assessmentPercentage : ResultData.assessmentPercentage.toFixed(2)
                    } % {'  '} To Pass 80 % Or Higher</Text>
                  </VStack>
                  <VStack>
                    <Button
                      onPress={()=> {
                        TryAssessmentAgain();
                        setSResult(false);
                      }}
                      p={2} bg={'primary.100'} _text={{fontSize:10, fontWeight:'bold'}} color={'#FFF'}>
                      Try again
                    </Button>
                  </VStack>
                </HStack>
              }
            </View>
            : null
          }

         <VStack p={4}>
          {AssessmentD ?
            <VStack mt={3} style={{marginBottom:150}}>
              <Text style={{fontSize: 17,color: '#000000',fontWeight: 'bold',maxWidth:width / 1}}>
              {AssessmentData.lessonName}
              </Text>
              { SResult ? <Text fontSize={14} color={'#000'} fontWeight={'bold'}>Total Point {ResultData.assessmentPoints}</Text> : null}
              <RenderAssessment/>
              {/* <AssessmentRadio/> */}
            </VStack> : null}
         </VStack>
        </ScrollView>
        <Button m={4} onPress={()=> Submit()} isDisabled={SResult}>
          Submit
        </Button>
      </VStack>
    </SafeAreaView>
  );
};

export default Assessments;

const styles = StyleSheet.create({
  container:{
    height: height / 1.25,
  },
});
