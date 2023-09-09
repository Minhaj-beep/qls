import { Text, VStack, HStack, Divider } from "native-base"
import React, {useState, useEffect} from "react"
import { TouchableOpacity, Dimensions } from "react-native"
import CountDownTimer from "react-native-countdown-timer-hooks"
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setLiveObjForToday } from "../../Redux/Features/CourseSlice";
import { GetLiveClass } from "../../Functions/API/GetLiveClass";
import { useIsFocused } from '@react-navigation/native';
import moment from "moment";

const {width, height} = Dimensions.get('window')

const RenderRecordedLiveClasses = ({props, isPurchase, courseCode}) => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    const [liveClassTimerId, setLiveClassTimerId] = useState(null);
    const [LiveClass, setLiveClass] = useState(props);
    const liveObjForToday = useSelector(state => state.Course.LiveObjForToday)
    const JWT = useSelector(state => state.Auth.JWT);
    const email = useSelector(state => state.Auth.Mail);

    useEffect(()=> { // Timers for live classes
        if(isFocused, isPurchase, Object.keys(liveObjForToday).length > 0) {
            // console.log('hello')
            startLiveClassTimer()
        } else {
            endLiveClassTimer()
        }
    },[isFocused, isPurchase, liveObjForToday])

    useEffect(()=> {
        if(liveClassTimerId !== null) {
            return () => {
                endLiveClassTimer()
            }
        }
    },[liveClassTimerId])

    const startLiveClassTimer = async () => {
        let check = setInterval(() => {
                getRLC(email, courseCode)
        }, 1000)
        setLiveClassTimerId(check)
    }

    const endLiveClassTimer = () => clearInterval(liveClassTimerId)

    const getLLC = async () => {
        let response = await GetScheduledLiveCourseClass(JWT, CourseData.courseCode);
        if (response.status === 200 && response.message !== 'Not Available') {
            setLiveClassesLiveCourse(response.data)
        }
    }

    const getRLC = async (mail, code) => {
        let response = await GetLiveClass(mail, code)
        if(response.status === 200) {
            // setLiveClass(response.data.data[0].liveClassList)
            setLiveClass(response.data[0].liveClassList)
        }
    }

    const RenderRecordedLiveClassess = ({data, i}) => {
        var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-')
        var time = new Date().getTime()
        var stimestap = new Date(data.date).getTime() + 3600000
        // console.log('utc', time, stimestap, data.liveStatus)
        // if(utc <= data.date.substr(0, 10) && data.liveStatus === 'SCHEDULED' || data.liveStatus === 'INPROGRESS'){
          
        // }
        //getting the value of seconds for upcoming classes
        const remainingTime = Date.parse(data.date) - Date.now();
        const sec = Math.floor((remainingTime) / 1000)
        const utcDate = new Date(data.date)
        // const istOptions = { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const istDateTime = moment.utc(utcDate).local().format('ddd, MMM D YYYY, h:mm A');
    
        let now = new Date()
        const startDate = new Date(data.date)
        const endDate = new Date(data.toDate)
        // console.log(now <= endDate, 'How these can we true', now, endDate)
        const [isStart, setIsStart] = useState(now >= startDate && now <= endDate ? true : false)
    
        useEffect(()=>{
          if(isStart && data.hasOwnProperty('joinLiveLink')) dispatch(setLiveObjForToday(data))
        },[])
        
        //check wheather purchaged or not and render live classes based on that
        if(isPurchase) {
          return (
            <TouchableOpacity
            onPress={()=> {
              if(isStart){
                console.log(data)
                dispatch(setLiveClassD(ActiveLCData));
                navigation.navigate('LiveClass', { LiveClassData : data });
              }
            }} key={i}>
              {/* {console.log('_____________LIVE CLASS DATA______________', data.liveStatus)} */}
                <HStack alignItems={'center'} justifyContent={'space-between'} mt={3} mr={3} ml={3}>
                <VStack>
                    <Text maxWidth={width*0.7} color={'#000'} fontSize={14} fontWeight={'bold'}>Live Class {i + 1} : {data.topicName}</Text>
                    {
                    data.liveStatus ? 
                        <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>{istDateTime}</Text>
                    : 
                        <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>{istDateTime}</Text>
                    }
                </VStack>
                {
                    isStart ? // Start Class now
                        <HStack bg={'primary.50'} paddingX={1} borderRadius={3}>
                            <Text style={{fontSize:12,color: '#FFFFFF', fontWeight:"bold", padding:5, borderRadius:3}}>Join Live</Text>
                        </HStack>
                    :
                    <>
                    {
                        now < startDate ? // Yet to start the class
                        <CountDownTimer
                            containerStyle={styles.count}
                            timestamp={sec}
                            timerCallback={() => {
                            setIsStart(true)
                            }}
                            textStyle={{backgroundColor: 'White', color: '#8C8C8C',  fontWeight:"bold", fontSize: 12, borderWidth: 0,  }}
                        /> 
                        : // Class time has passed
                        <HStack bg={'rgba(41,211,99, 0.2)'} alignItems={'center'} paddingX={1} borderRadius={3}>
                            <AntDesign size={13} name="checkcircle" color="#29d363" />
                            <Text style={{fontSize:9,color: '#29d363', fontWeight:"bold", padding:5, borderRadius:3}}>Completed</Text>
                        </HStack>
                    }
                    </>
                }
                </HStack>
                { LiveClass.length !== i + 1 ? <Divider mt={1} bg={'greyScale.800'} thickness={1} mb={2} /> : null }
            </TouchableOpacity>
          );
        } else {
            return (
                <TouchableOpacity>
                <HStack alignItems={'center'} justifyContent={'space-between'} mt={3} mr={3} ml={3}>
                    <VStack>
                        <Text maxWidth={width*0.7} color={'#000'} fontSize={14} fontWeight={'bold'}>Live Class {i + 1} : {data.topicName}</Text>
                        {
                            data.liveStatus ? 
                                <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>{istDateTime}</Text>
                            : 
                                <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>{istDateTime}</Text>
                        }
                    </VStack>
                    <Icon name={data.liveStatus === 'INPROGRESS' && type  ? 'lock-open' : 'lock-closed'} size={17} style={{padding: 5}} color="#364b5b" />
                </HStack>
                </TouchableOpacity>
            )
        }
    }

    const RenderLiveVideosForRecordedCourse = () => { // UI for Live classes for recorded course
        return (
            <>
                {
                  Object.keys(LiveClass).length > 0 ? (
                    LiveClass.map((data, i) =>{
                      return (
                        <RenderRecordedLiveClassess data={data} i={i} />
                      )
                    })
                  )
                : 
                  <Text color={'greyScale.800'} fontSize={12} p={4} alignSelf="center">No Live Videos to show yet!</Text>
                }
            </>
        )
    }

    return (
        <VStack>
            <RenderLiveVideosForRecordedCourse />
        </VStack>
    )
}

export default RenderRecordedLiveClasses