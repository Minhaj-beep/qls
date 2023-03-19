import { View, Text, Button, VStack, HStack, Radio, Actionsheet, Image } from "native-base"
import React, {useState, useEffect} from "react"
import AppBar from "../components/Navbar"
import { ScrollView, Dimensions, } from "react-native"
import {useSelector, useDispatch} from 'react-redux'
import { BaseURL } from "../StaticData/Variables"
import { useNavigation } from "@react-navigation/native"
import GetIndependentAssessmentByCode from "../Functions/API/GetIndependentAssessmentByCode"
import { AttendIndependentAssessment } from "../Functions/API/AttendIndependentAssessment"
import { setLoading } from "../Redux/Features/authSlice"
import { AssessmentTryAgain } from "../Functions/API/AssessmentTryAgain"
import { setIsRetryIndependentAssessment } from "../Redux/Features/CourseSlice"
import { IndependentAssessmentTryAgain } from "../Functions/API/IndependentAssessmentTryAgain"

const {width, height} = Dimensions.get('window')

const ViewAssessment = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const email = useSelector(state => state.Auth.Mail);
    const independentAssessmentCode = useSelector(state => state.Course.ViewIndependentAssessmentCode)
    const isRetryIndependentAssessment = useSelector(state => state.Course.IsRetryIndependentAssessment)
    const [allData, setAllData] = useState({})
    const [showResult, setShowResult] = useState(false)
    const [SResult, setSResult] = useState(false);
    const [ResultData, setResultData] = useState();
    const AnswerMap = new Map()
    const WrongImg = require('../../assets/CompletedTick.png');
    const CorrectImg = require('../../assets/wrong.png');

    const AppBarContent = {
        title: 'Assessment',
        navigation: navigation,
        ArrowVisibility: true,
    };

    useEffect(()=>{
      getIndependentAssessmentByCode()
      TryAssessmentAgain()
    },[])

    const TryAssessmentAgain = async() => {
        try {
          let response = await IndependentAssessmentTryAgain(email, independentAssessmentCode);
          if ( response.status === 200){
            console.log('Now you can try again!');
            dispatch(setLoading(false));
          } else {
            console.log("TryAssessmentAgain error 1 : " + response.message);
            dispatch(setLoading(false));
          }
        } catch (e) {
            console.log("Error fetching 2 : ", e)
          alert("TryAssessmentAgain error 2 : " + e.message);
          dispatch(setLoading(false));
        }
        dispatch(setIsRetryIndependentAssessment(false))
        // dispatch(setLoading(false));
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
            'answers':Answers,
          };
          try {
            let response = await AttendIndependentAssessment(email, independentAssessmentCode, body);
            if (response.status === 200 ){
              // console.log('Console.log: ', response)
              if (response.message === 'Progress already saved for this details.'){
                alert("Submit error: " + response.message);
                dispatch(setLoading(false));
              } else {
                setResultData(response.data)
                setSResult(true);
                dispatch(setLoading(false));
              }
            } else {
              alert("Submit error: 1" + response.message);
              dispatch(setLoading(false));
            }
          } catch (e) {
            console.log("Submit error: 2" + e.message);
            dispatch(setLoading(false));
          }
        } else {
          alert('Please attend at least one Question!');
          dispatch(setLoading(false));
        }
    }

    const getIndependentAssessmentByCode = async () => {
        try {
            let response = await GetIndependentAssessmentByCode(email, independentAssessmentCode)
            if (response.status === 200){
                console.log('All Data that I have for this assessment', response.data)
                setAllData(response.data)
            } else {
                console.log('getAllActivatedAssessment', response.message)
            }
        } catch (e) {
            console.log('getAllActivatedAssessment', e)
        }
    }

    const RenderRR = ({data}) => {
      return (
        data.assessmentDetails.map((props, index)=>{
          let Choice = props.assessmentChoice;
          return (
            <VStack key={index} space={2}>
              <HStack alignItems={'center'} space={3} mt={4}>
                <View style={{maxWidth:width*0.8}}>
                  <Text style={{fontSize: 15, color: '#000000',fontWeight: 'bold',maxWidth:width / 0.7}}>
                    {props.assessmentOrder}. {' '} {props.assessmentQuestion}
                  </Text>
                </View>
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
        })
      )
    };

    const RenderR = ({data}) => {
      return (
        data.assessmentDetails.map((props, index)=>{
          let Choice = props.assessmentChoice
          return (
            <VStack key={index} space={2}>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width / 1}}>
                    {props.assessmentOrder}. {' '} {props.assessmentQuestion}
                </Text>
              <HStack space={6} m={2} justifyContent="space-between">
                <View>
                  <Radio.Group size="sm" name="Radio01" colorScheme={'primary'} onChange={(value)=>{
                      AnswerMap.set(props.assessmentOrder ,Choice[value]);
                  }}>
                    {
                      props.assessmentChoice.map((data, index)=> {
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
          )
        })
      )
    }

    const renderAssessments = () => {
        if(allData === "undefined" || Object.keys(allData).length < 1){
            return (
              <VStack mt={1}>
                <Text style={{fontSize:13, alignSelf:"center", borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>No questions to show!</Text>
              </VStack>
            )
        } else {
            return (
              <VStack mt={1}>
                {SResult ? <RenderRR data={allData} /> : <RenderR data={allData} />}
              </VStack>
            )
        }
    }


    return (
        <View>
            <AppBar props={AppBarContent} />
            <VStack>
                <ScrollView style={{height: height / 1.25,}}>
                    <VStack p={4}>
                        {allData === null ? <></> : renderAssessments()}
                    </VStack>
                </ScrollView>
                <Button m={4} onPress={()=> {Submit()}} isDisabled={showResult}>Submit</Button>
            </VStack>

            {/* <View style={{width:"95%", marginTop:5, alignSelf:"center", backgroundColor:"white", borderRadius:5, flexDirection:"row", justifyContent:"space-between", }}>
                <Text>ViewAssessment</Text>
            </View> */}
        </View>
    )
}

export default ViewAssessment

