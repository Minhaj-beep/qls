import {StyleSheet, Linking, Dimensions} from 'react-native';
import React,{useEffect,useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {HStack, VStack,Text, View} from 'native-base';
import RenderHtml from 'react-native-render-html';
import { GetLiveCourseFull } from '../../Functions/API/GetLiveCourseFull';
import {setLoading} from '../../Redux/Features/authSlice';
import moment from 'moment';

const {width, height} = Dimensions.get('window');

const Overview = () => {
  const CourseDD = useSelector(state => state.Course.SCData);
  const CourseFull = useSelector(state => state.Course.FullCourseData);
  const CourseData = CourseDD.CDD;
  const email = useSelector(state => state.Auth.Mail);
  const [LiveFull, setLiveFull] = useState();
  const [ClassT, setClassT] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (CourseData) {
        setClassT(CourseFull.classTime);
        setLiveFull(CourseFull);
        // GetClassTime(email,CourseData.liveCourseCode);
        console.log('Class time tab');
    }
  },[CourseData,email,CourseFull]);

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const GetClassTime = async (mail, code) => {
    try {
     dispatch(setLoading(true)); 
     let response = await GetLiveCourseFull(mail, code);
     if (response.status === 200){
       let data = response.data;
       if (data[0].length !== 0){
        setLiveFull(data[0]);
        let classTT = data[0].classTime;
        if (classTT.length > 0 ) {
        setClassT(data[0].classTime);
       }
        console.log('full live');
       }
       dispatch(setLoading(false));
     } else {
        dispatch(setLoading(false));
        console.log("GetClassTime error: " + response.message);
        alert("GetClassTime error: " + response.message);
     }
    } catch (err) {
      dispatch(setLoading(false));
      console.log("GetClassTime error: " + err.message);
      alert("GetClassTime error: " + err.message);
    }
   };
  return (
    <View style={styles.container}>
        <VStack mt={2} space={2}>
            <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>Course Duration</Text>
           { LiveFull ?
            <View>
            { LiveFull.courseDuration ? <View>
                    <Text ml={4} color={'primary.900'} fontSize={12} fontWeight={'bold'}>{LiveFull.fromTime}  to  {LiveFull.toTime} ({LiveFull.courseDuration})</Text>
                </View> :
                <Text ml={4} color={'greyScale.800'} fontSize={10}>Yet to add Class Duration</Text>
                }
           </View>
           :  <Text  color={'greyScale.800'} fontSize={10}>Yet to add Class Duration</Text>
           }

            <Text mt={3} color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>Class Time</Text>
               { ClassT ?
                <View backgroundColor={'gray.200'} padding={1} borderRadius={'md'}>
                    { ClassT.length > 0 ?
                        <VStack space={1}>
                        {
                        ClassT.map((data, index )=>{
                                const startS = moment(data.startTime, 'hh:mm A').format('hh:mm A');
                                const startE = moment(data.endTime, 'hh:mm A').format('hh:mm A');
                            return (
                                <View key={index}>
                                   { data.startTime !== '' ?
                                    <HStack justifyContent={'space-between'} marginX={2} space={10}>
                                        <Text  color={'greyScale.800'} fontSize={14} fontWeight={'bold'} mt={1}>{capitalizeFirstLetter(data.day)}</Text>
                                        <Text  color={'primary.900'} fontSize={14} fontWeight={'bold'} mt={1}>{startS} to {startE} </Text>
                                    </HStack> : null}
                                </View>
                            );
                        })
                        }
                        </VStack>
                        :
                        <Text  color={'greyScale.800'} fontSize={10}>Yet to add Class Duration</Text>
                    }
                </View>
                :
                <Text  color={'greyScale.800'} fontSize={10}>Yet to add Class Duration</Text>
                }

        </VStack>


    </View>
  );
};

export default Overview;

const styles = StyleSheet.create({
  container: {
    minHeight: 250,
    padding:10,
  },
  CStyle:{
    backgroundColor: '#395061',
    opacity:0.2,
    padding:25,
    borderRadius:10,
  },
});
