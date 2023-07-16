import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Linking, } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { HStack, VStack, Center, Text, Image, Button, Divider, Container, useToast, Progress, Box, Modal, } from 'native-base';
import Navbar from '../components/Navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import Accordion from 'react-native-collapsible/Accordion';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Overview from './SCTabs/Overview';
import Review from './SCTabs/Review';
import FAQ from './SCTabs/FAQ';
import {useSelector, useDispatch} from 'react-redux';
import {setLoading} from '../Redux/Features/authSlice';
import {setLiveClassD, setBuyNowCourse, setAssessmentData,setFullCourseData} from '../Redux/Features/CourseSlice';
import { setInstructor,setInstructorCourses} from '../Redux/Features/InstructorSlice';
import {BaseURL} from '../StaticData/Variables';
import {ChapterDD,LiveClassD} from '../StaticData/data';
import {GetLiveClass} from '../Functions/API/GetLiveClass';
import { GetInstructor } from '../Functions/API/GetInstructor';
import { GetInstructorCourses } from '../Functions/API/GetInstructorCourses';
import { GetCourseByCode } from '../Functions/API/GetCourseByCode';
import { AddToWishList } from '../Functions/API/AddToWishist';
import {GetPurchasedCourses} from '../Functions/API/GetPurchasedCourses';
import { DemoData } from '../StaticData/data';
import { AddToCart } from '../Functions/API/AddToCart';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import ResoucreFile from '../components/Courses/ResourceFile';
import RenderHtml from 'react-native-render-html';
import ClassTime from './SCTabs/ClassTime';
import moment from 'moment';
import { RequestDemoClass } from '../Functions/API/RequestDemoClass'
import { GetDemoReqbyCourseCode } from '../Functions/API/GetDemoClassListbyCourseCode';
import { setJoinDemoClassData } from '../Redux/Features/CourseSlice';
import { SetCourseProgress } from '../Functions/API/CourseProgress';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CountDownTimer from 'react-native-countdown-timer-hooks'
import { AirbnbRating } from 'react-native-ratings';
import { useIsFocused } from '@react-navigation/native';
import GetScheduledLiveCourseClass from '../Functions/API/GetScheduledLiveCourseClass';
  
const {width, height} = Dimensions.get('window');
  
const ViewLiveCourse = ({navigation}) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const toast = useToast();
    const [ActiveSessions, setActiveSessions] = useState([]);
    const CData = useSelector(state => state.Course.SCData);
    const [type, setType] = useState(false)
    const [loaded, setIsLoaded] = useState(false)
    const CourseData = CData.CDD;
    const [InstructorName, setInstructorName] = useState('No Name');
    const [profileImgPath, setprofileImgPath ] = useState(null);
    const [instructorEmail, setInstructorEmail] = useState(null)
    const email = useSelector(state => state.Auth.Mail);
    const GUser = useSelector(state => state.Auth.GUser);
    const [CourseD, setCourseD] = useState();
    const [allCourseData, setAllCourseData] = useState({})
    const [ChapterD, SetChapterD] = useState();
    const [LiveClass, setLiveClass] = useState([]);
    const [Instructor, setIns] = useState({});
    const [courses, setCourses] = useState(null);
    const [IsLCActive, setIsLCActive] = useState(false);
    const [ActiveLCData, setActiveLCData] = useState();
    const player = useRef();
    const [CourseProgress, setCourseProgress] = useState(0);
    const [CourseTitle, setCourseTitle] = useState(CourseData.courseName);
    const [VideoPath, setVideoPath] = useState(CourseData.introVideoPath);
    const [Resources, setResources] = useState([]);
    const [ShowResources, SetShowResources] = useState(false);
    const [purchasedCourse, setPurchasedCourse] = useState(null)
    const [stateLoading, setStateLoading] = useState(true)
    const [courseDuration, setCourseDuration] = useState(null)
    const JWT = useSelector(state => state.Auth.JWT);
    const [isDemoClassAvailable, setIsDemoClassAvailable] = useState(false)
    const [DemoClassData, setDemoClassData] = useState({})
    const [showEmptyClass, setShowEmptyCLass] = useState(0)
    const [ChapterOrd, setChapterOrd] = useState(null)
    const [LessonOrd, setLessonOrd] = useState(null)
    const [videoEnd, isVideoEnd] = useState(false)
    const [ isComponentLoaded, setIsComponentLoaded] = useState(false);
    const [liveClassList, setLiveClassList] = useState([])
    const [liveObjForToday, setLiveObjForToday] = useState({})
    const [timerId, setTimerId] = useState(null);
    const [liveClassTimerId, setLiveClassTimerId] = useState(null);
    const [isViewReview, setIsViewReview] = useState(false)
    const [liveClassesLiveCourse, setLiveClassesLiveCourse] = useState([])
    const [hasJoinedInDemoBefore, setHasJoinedInDemoBefore] = useState(false)
    const [showDemoMessage, setShowDemoMessage] = useState(false)

    const AppBarContent = {
        title: ' ',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1: 'notifications-outline',
        RightIcon2: 'person',
    };

    useEffect(()=> { // Each time we getting the course details when component in focus
        const unsubscribe = navigation.addListener('focus', () => {
            getCourseByCode();
            if(CourseData.isLive){
                getScheduledLiveCourseClass()
            } else {
                GetLC(email, CourseData.courseCode)
            }
        });
        return unsubscribe;
    },[navigation])

    useEffect(()=> { // Saving the the video completion progress and re-rendering the component
        if(videoEnd && ChapterOrd !== null && LessonOrd !== null){
            saveCourseProgress()
            isVideoEnd(false)
        }
    }, [videoEnd])

    useEffect(()=> { // Getting instructor data and his/her courses
        GetI(email, CourseData.instructorId)
        GetICourses(email, CourseData.instructorId)
    },[])

    // useEffect(()=> { // Timers for live classes
    //     if(isFocused, allCourseData.isPurchase, Object.keys(liveObjForToday).length > 0) {
    //         // console.log('hello')
    //         startLiveClassTimer()
    //     } else {
    //         endLiveClassTimer()
    //     }
    // },[isFocused, allCourseData.isPurchase, liveObjForToday])

    // useEffect(()=> {
    //     if(liveClassTimerId !== null) {
    //         return () => {
    //             endLiveClassTimer()
    //         }
    //     }
    // },[liveClassTimerId])

    // const startLiveClassTimer = async () => {
    //     let check = setInterval(() => {
    //         if(CourseData.isLive){
    //             getLLC()
    //         } else {
    //             getRLC(email, CourseData.courseCode)
    //         }
    //     }, 1000)
    //     setLiveClassTimerId(check)
    // }

    // const endLiveClassTimer = () => clearInterval(liveClassTimerId)

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

    useEffect(()=>{ // Demo class timers
        console.log(isFocused, allCourseData.isPurchase, allCourseData.isDemoRequested, hasJoinedInDemoBefore)
        if(isFocused && !allCourseData.isPurchase && allCourseData.isDemoRequested && !hasJoinedInDemoBefore) {
            console.log('_______________________MOUNTED__________________________')
            startTimer()
        } else {
            console.log('_______________________UNMOUNTED__________________________')
            endTimer()
        }
    },[isFocused, hasJoinedInDemoBefore, allCourseData.isPurchase, allCourseData.isDemoRequested])
    
    useEffect(()=>{
        if(timerId !== null){
            return ()=> {
                console.log('_______________________UNMOUNTED__________________________')
                endTimer()
            }
        }
    },[timerId])
    
    const startTimer = () => {
        let sec = 0
        let check = setInterval(()=>{
            getDemoReqbyCourseCode()
            sec =+ 1
            console.log(sec)
        },5000)
    
        setTimerId(check)
    }
    const endTimer = () => {
        clearInterval(timerId);
    }

    const getCourseByCode = async() =>{ // Get all the details of the current course
        try {
            let response = await GetCourseByCode(GUser, email, JWT, CourseData.courseCode);
            if (response.status === 200) {
                console.log('========All detailes of the course===========>', response)
                dispatch(setFullCourseData(response.data))
                setAllCourseData(response.data)
                if (Object.keys(response.data.chapterList).length > 0) {
                    SetChapterD(response.data.chapterList);
                }
                setIsComponentLoaded(true)
            } else {
                console.log("GetCourseDetails errorrrrrrrrrrrrrrrrrrrrr 1: " + response.message);
                // getCourseByCode(true)
                console.log('This is the g user---------------------->',GUser)
            }
        } catch (error) {
            console.log("GetCourseDetails errorrrrrrrrrrrrrrrrrrrrr 2: " + error.message);
            getCourseByCode(true)
        }
    };

    const getScheduledLiveCourseClass = async () => { // Get the upcoming live classes for live course
        try {
            let response = await GetScheduledLiveCourseClass(GUser, email, JWT, CourseData.courseCode);
            console.log('JWT : ', JWT)
            if (response.status === 200 && response.message !== 'Not Available') {
                console.log('This is the getScheduledLiveCourseClass response: ', response)
                setLiveClassesLiveCourse(response.data)
            } else {
                console.log(response, 'getScheduledLiveCourseClass error___________________________')
                getScheduledLiveCourseClass()
            }
         } catch (err) {
            console.log("getScheduledLiveCourseClass 2 __________________________" + err);
            getScheduledLiveCourseClass()
        }
    }

    const requestDemoClass = async () => { // Requesting for demo class and getting the updated course data
        try {
            let response = await RequestDemoClass(email, CourseData.courseCode);
            if (response.status === 200) {
                console.log('this is da data: ' + response)
                getCourseByCode()
                console.log('PC courses retrieved successfully');
            } else {
                if(response.message === 'You have already requested for Demo for this course'){
                    setHasJoinedInDemoBefore(true)
                    setShowDemoMessage(true)
                } else {
                    alert(response.message);
                    console.log("requestDemoClass 1 " + response.message);
                }
            }
        } catch (err) {
            console.log("requestDemoClass 2 " + err.message);
            alert('Server error please try again!');
        }
    }

    const GetI = async (mail, id) => {
        try {
            let response = await GetInstructor(mail, id);
            console.log('Instructor:' + id);
            if (response.status === 200) {
                let data = response.data;
                setIns(data);
                dispatch(setInstructor(data));
                if (data !== null){
                    setInstructorName(data.fullName);
                    setInstructorEmail(data.instructorEmail)
                    if (data.profileImgPath)
                    {
                        setprofileImgPath(data.profileImgPath);
                    }
                    else {
                        setprofileImgPath(null);
                        console.log('no Profile');
                    }
                } else {
                    setInstructorName('No Name');
                }
            } else {
                console.log("GetI: " + response.message);
                GetI(email, CourseData.instructorId)
            }
        } catch (err) {
            console.log("GetI: " + err.message);
            GetI(email, CourseData.instructorId)
        }
    };

    const GetICourses = async (mail, id) => {
        try {
            let response = await GetInstructorCourses(mail, id);
            if (response.status === 200) {
                if (response.data.length !== 0) {
                    let data = response.data;
                    // console.log('Finding all instructor destails: ', data.totalLearners, ' totalLearners and ', data.totalCourses, 'totalCourses')
                    setCourses(data);
                    dispatch(setInstructorCourses(data));
                } else {
                    dispatch(setInstructorCourses([]));
                }
            } else {
                console.log("GetICourses : " + response.message);
                GetICourses(email, CourseData.instructorId)
            }
        } catch (err) {
            console.log("GetICourses : " + err.message);
            GetICourses(email, CourseData.instructorId)
        }
    };

    const getDemoReqbyCourseCode = async () => {
        try {
          let response = await GetDemoReqbyCourseCode(GUser, email, JWT, CourseData.courseCode);
            if (response.status === 200 && response.message !== 'Not Available') {
                setIsDemoClassAvailable(true)
                setDemoClassData(response.data)
                console.log('This is the demo class response: ', response)
            } else {
                console.log(response, 'getDemoReqbyCourseCode error___________________________')
            }
        } catch (err) {
            console.log("getDemoReqbyCourseCode 2 __________________________" + err.message);
        }
    }

    const sendMailToInstructor = async () => {
        await Linking.openURL(`mailto:${instructorEmail}`)
    }

    const saveCourseProgress = async () => {
        console.log(`{
            chapterOrder: ${ChapterOrd}
            lessonOrder: ${LessonOrd}
            email: ${email}
            courseCode: ${CourseData.courseCode}
        }`)
        try {
            const result = await SetCourseProgress(email, ChapterOrd, LessonOrd, CourseData.courseCode)
            if(result.status === 200) {
                console.log(result, "saveCourseProgress success")
                getCourseByCode()
            } else {
                console.log(result, 'saveCourseProgress error 1')
            }
        } catch (e) {
            console.log('saveCourseProgress error 2 :', e)
        }
    }

    const AddTC = async () => {
        try {
            let cart = await AddToCart(email, CourseData.courseCode);
            if (cart.status === 200) {
                console.log(cart)
                toast.show({
                    description: cart.message,
                });
            } else {
                toast.show({
                    description: cart.message,
                });
                console.log(cart.message);
            }
            console.log(cart);
        } catch (e) {
            console.log('Add to cart error: ', e)
        }
    };

    const ATWish = async() => {
        try {
            let response = await AddToWishList(email, CourseData.courseCode);
            if ( response.status === 200) {
                toast.show({
                    description: response.message,
                });
            } else {
                toast.show({
                    description: response.message,
                });
            }
        } catch (e) {
            toast.show({
            description: e.message,
            });    
        }
    };

    const CollapsibleChange = active => { // Handle collapsing of accodion
        setActiveSessions(active);
    };

    const CHeader = (section, index) => { // Rendering accodion section headers
        return (
          <VStack space={1} mt={2}>
            <HStack alignItems={'center'} justifyContent={'space-between'}>
              <Text color={'#000'} fontSize={14} fontWeight={'bold'}  maxW={width / 1.5}>Chapter {index + 1}: {section.chapterName}</Text>
              <Icon name={ index === ActiveSessions[0] ? 'chevron-up-outline' : 'chevron-down-outline' } size={20} color="#000" />
            </HStack>
            {
                section.chapterDuration ? 
                    <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>
                        {new Date(section.chapterDuration*1000).toISOString().substr(11, 8)}
                    </Text>
                :
                    <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>00:00:00</Text>
            }
            
            {
                ChapterD.length !== index + 1 && index !== ActiveSessions[0] ? (
                    <Divider mt={1} bg={'greyScale.800'} thickness={1} />
                ) : null
            }
          </VStack>
        );
    };
    
    const CBody = (dat, index) => { // Rendering accodion section contents
        const LessonData = dat.lessonList;
        return (
          <View style={{marginTop: 5, marginBottom: 5}}>
            {
                LessonData.map((data, index) => {
                let AData = { Data: data, chapterOrder:dat.chapterOrder, };

                    return (
                        <TouchableOpacity key={index}
                            onPress={()=> {
                                if (allCourseData.isPurchase) {
                                    if (data.isAssesment === false) {
                                        setChapterOrd(dat.chapterOrder)
                                        setLessonOrd(data.lessonOrder)
                                        setCourseTitle(data.lessonName);
                                        setResources(data.resourceDetails);
                                        setVideoPath(data.lessonVideoPath);
                                    } else if (data.isAssesment === true) {
                                        setResources([]);
                                        navigation.navigate('Assessments');
                                        dispatch(setAssessmentData(AData));
                                    }
                                }
                            }}
                        >
                            <HStack justifyContent={'space-between'} mt={2}>
                                <HStack space={2} alignItems="center">
                                    <View>
                                        {data.isCompleted === false && data.isAssesment === false ? (
                                            <Icon name="play" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20, }} size={15} />
                                        ) : null}
                                        {data.isCompleted === false && data.isAssesment === true ? (
                                            <Icon name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20, }} size={15} />
                                        ) : null}
                                        {data.isCompleted === true ? (
                                            <Image source={require('../../assets/CompletedTick.png')} alt="completed" size={7} />
                                        ) : null}
                                    </View>
                                    <VStack>
                                        <Text color={'#000'} maxWidth={width*0.7} fontSize={14} fontWeight={'bold'}>{data.lessonName}</Text>
                                        { data.isAssesment !== true && data.hasOwnProperty('lessonDuration') ?
                                        <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>
                                        {new Date(data.lessonDuration*1000).toISOString().substr(11, 8)}
                                        </Text> : null}
                                    </VStack>
                                </HStack>
                                <Icon name={allCourseData.isPurchase ? "lock-open" : "lock-closed"} size={17} style={{padding: 5}} color="#364b5b" />
                            </HStack>
                        </TouchableOpacity>
                    );
                })
            }
          </View>
        );
    };

    const SetLCData = (data) => {
        if (data.liveStatus === 'INPROGRESS'){
          return data;
        }
    };

    const GetLC = async (mail, code) => { // Getting Live classes for recorded course
        try {
            let response = await GetLiveClass(mail, code);
            if (response.status === 200){
                let data = response.data;
                if (data.length !== 0){
                    if (data[0].liveClassList) {
                        let LData = data[0].liveClassList;
                        if (LData.length !== 0){
                            console.log('Live class data::::::::::::::::: ', LData)
                            setLiveClass(LData);
                            LData.map((data, i) => {
                                var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-')
                                var time = new Date().getTime()
                                var stimestap = new Date(data.date).getTime() + 3600000
                                console.log('utc', time, stimestap, data.liveStatus)
                                if(utc <= data.date.substr(0, 10) && data.liveStatus === 'SCHEDULED' || data.liveStatus === 'INPROGRESS' && time <= stimestap){
                                    setShowEmptyCLass(showEmptyClass+1)
                                }
                            })
                            let ActiveClass = LData.filter(SetLCData);
                            if (ActiveClass.length !== 0) {
                                console.log(' Live Class ' + ActiveClass[0].topicName);
                                setIsLCActive(true);
                                setActiveLCData(ActiveClass[0]);
                            }
                        }
                    }
                }
            } else {
                console.log("GetLC : 1" + response.message);
                GetLC(email, CourseData.courseCode)
            }
        } catch (err) {
            console.log("GetLC : 2" + err.message);
            GetLC(email, CourseData.courseCode)
        }
    };

    const isSameDate = (dateString) => {
        const givenDate = moment(dateString).startOf('day');
        const currentDate = moment().startOf('day');

        return givenDate.isSame(currentDate);
    }

    const hasTimePassed = (timeString) => {
        // Get the current date and time
        const now = new Date();
        
        // Split the input time string into hours and minutes
        const [hours, minutes] = timeString.split(':').map(Number);

        // Set the date to today and the hours and minutes to the input time
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        // If the target time is earlier than the current time, it has passed
        return targetDate < now;
    }

    const convertTimeTo12HourFormat = (timeString) => {
        // Split the time string into hours and minutes
        const [hours, minutes] = timeString.split(':').map(Number);

        // Convert the hours to the 12-hour format and add the AM/PM suffix
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12; // 0 should become 12 in 12-hour format
        const formattedHours = hours12.toString().padStart(2, '0'); // add leading zero if necessary
        const formattedMinutes = minutes.toString().padStart(2, '0'); // add leading zero if necessary

        // Combine the formatted hours, minutes, and suffix into a string
        const formattedTime = `${formattedHours}:${formattedMinutes} ${suffix}`;

        return formattedTime;
    }

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();

        return `${month} ${day}, ${year}`;
    }

    const getSecondsUntilDateTime = (dateString, time) => {
        // extract date from date string and adjust for IST offset
        const date = new Date(dateString);
        const istOffset = 330 * 60 * 1000;
        const targetDate = new Date(date.getTime() + istOffset);
        
        // extract hours and minutes from input time
        const hours = parseInt(time.substring(0, 2));
        const minutes = parseInt(time.substring(3, 5));
        
        // set target time to input time and adjust for IST offset
        targetDate.setUTCHours(hours - 5);
        targetDate.setUTCMinutes(minutes - 30);
        
        // calculate difference in seconds from current time
        const now = new Date();
        const diffInSeconds = (targetDate - now) / 1000;
        
        return parseInt(diffInSeconds);
    }

    const RenderLiveClassess = ({data, i}) => {
        const isToday = isSameDate(data.scheduledDate)
        const hasPassedStartTime = hasTimePassed(data.startTime)
        const hasPassedEndTime = hasTimePassed(data.endTime)
        const secondsRemaining = getSecondsUntilDateTime(data.scheduledDate, data.startTime);
        const [isStart, setIsStart] = useState(isToday && hasPassedStartTime && !hasPassedEndTime ? true : false)
        useEffect(()=>{
            if(isStart && data.hasOwnProperty('joinLiveLink')) {
                setLiveObjForToday(data)
                console.log('What is happening')
            }
        },[isStart])

        console.log('IS this the problemmmmmmmmmmmmmmmmmmmmmmmmm', isToday, data)
        
        return (
            <TouchableOpacity key={i} onPress={()=>{
                if(isStart){
                    console.log(data)
                    dispatch(setLiveClassD(ActiveLCData));
                    navigation.navigate('LiveClass', { LiveClassData : data });
                }
            }}>
                <HStack alignItems={'center'} justifyContent={'space-between'} mt={3} mr={3} ml={3}>
                    <VStack>
                        <Text maxWidth={width*0.7} color={'#000'} fontSize={14} fontWeight={'bold'}>Live Class {i + 1} : {data.weekDay}</Text>
                        <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>{formatDate(data.scheduledDate)} {convertTimeTo12HourFormat(data.startTime)} To {convertTimeTo12HourFormat(data.endTime)}</Text>
                    </VStack>
                    {
                        isToday ? // now check the time
                        <>
                        {console.log('IS this the problemmmmmmmmmmmmmmmmmmmmmmmmm')}
                            {
                                hasPassedStartTime ? // now check if end time exceeded
                                <>
                                    {
                                        hasPassedEndTime ? // show class completed
                                        <HStack bg={'rgba(41,211,99, 0.2)'} alignItems={'center'} paddingX={1} borderRadius={3}>
                                            <AntDesign size={13} name="checkcircle" color="#29d363" />
                                            <Text style={{fontSize:9,color: '#29d363', fontWeight:"bold", padding:5, borderRadius:3}}>Completed</Text>
                                        </HStack>
                                        : // start class
                                        <HStack bg={'primary.50'} paddingX={1} borderRadius={3}>
                                            <Text style={{fontSize:12,color: '#FFFFFF', fontWeight:"bold", padding:5, borderRadius:3}}>Join Live</Text>
                                        </HStack>
                                    }
                                </>
                                : // show timer
                                <CountDownTimer
                                    containerStyle={styles.count}
                                    timestamp={secondsRemaining}
                                    timerCallback={() => {
                                        setIsStart(true)
                                    }}
                                    textStyle={{backgroundColor: 'White', color: '#8C8C8C',  fontWeight:"bold", fontSize: 12, borderWidth: 0,  }}
                                /> 
                            }
                        </>
                        : // show the timer
                        <CountDownTimer
                            containerStyle={styles.count}
                            timestamp={secondsRemaining}
                            timerCallback={() => {
                                setIsStart(true)
                            }}
                            textStyle={{backgroundColor: 'White', color: '#8C8C8C',  fontWeight:"bold", fontSize: 12, borderWidth: 0,  }}
                        /> 
                    }
                </HStack>
                { liveClassesLiveCourse.length !== i + 1 ? <Divider mt={1} bg={'greyScale.800'} thickness={1} mb={2} /> : null }
            </TouchableOpacity>
        )
    }

    const RenderLiveVideosForLiveCourse = () => { // UI for Live classes for live course
        return (
            <>
                {
                  Object.keys(liveClassesLiveCourse).length ? (
                    liveClassesLiveCourse.map((data, i) =>{
                      return (
                        <RenderLiveClassess data={data} i={i} />
                      )
                    })
                  )
                : 
                  <Text color={'greyScale.800'} fontSize={12} p={4} alignSelf="center">No Live Videos to show yet!</Text>
                }
            </>
        )
    }

    const RenderRecordedLiveClassess = ({data, i}) => {
        // console.log(data)
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
        const istOptions = { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const istDateTime = utcDate.toLocaleString('en-US', istOptions);
    
        let now = new Date()
        const startDate = new Date(data.date)
        const endDate = new Date(data.toDate)
        // console.log(now <= endDate, 'How these can we true', now, endDate)
        const [isStart, setIsStart] = useState(now >= startDate && now <= endDate ? true : false)
    
        useEffect(()=>{
          if(isStart && data.hasOwnProperty('joinLiveLink')) setLiveObjForToday(data)
        },[])
        
        //check wheather purchaged or not and render live classes based on that
        if(allCourseData.isPurchase) {
          return (
            <TouchableOpacity
            onPress={()=> {
              if(isStart && data.liveStatus !== 'COMPLETED'){
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
                    isStart && data.liveStatus !== 'COMPLETED' ? // Start Class now
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
                  Object.keys(LiveClass).length ? (
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

    const OpenLink = async(link) =>{
        console.log("Open link: "+ link);
        const supported = await Linking.canOpenURL(link);
        if (supported) {
          await Linking.openURL(link);
        } else {
            toast.show({
                description: 'Unable to open URL, Please try again later!',
            });
        }
    };

    const renderersProps = {a: {onPress: OpenLink}}; 

    const OverviewSource = { // Making overview HTLM ready to render
        html: 
        `
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                body{color:black; background-color: yellow}
                </style>
            </head> 
            <body>${CourseData.courseOverview}</body>
        `,
    };

    const OverTest = () => { // Render component for overview
        return (
            <View style={{flex:1}}>
                <View style={{width:"90%", alignSelf:"center"}}>
                    <RenderHtml
                        contentWidth={width / 3}
                        source={OverviewSource}
                        baseStyle={{color:"#8C8C8C"}}
                        renderersProps={renderersProps}
                    />
                </View>
            </View>
        );
    };

    const RenderTabs01 = () => { // Component for review, class time, faq and overview for live course
        let [index, setIndex] = React.useState(0);
        let [routes] = React.useState([
            {key: 'first', title: 'Overview'},
            {key: 'second', title: 'Review'},
            {key: 'third', title: 'Class Time'},
            {key: 'fourth', title: 'FAQ'},
        ]);
        let renderScene = SceneMap({
            first: OverTest,
            second: Review,
            third: ClassTime,
            fourth: FAQ,
        });
          
        let renderTabBar = props => {
            return (
                <TabBar
                    {...props}
                    indicatorStyle={{backgroundColor: '#364b5b'}}
                    style={{backgroundColor: '#FFF'}}
                    labelStyle={{color: '#8C8C8C'}}
                    activeColor="#364b5b"
                    scrollEnabled={true}
                    tabStyle={{width: width / 4}}
                />
            );
        };
        return (
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: width}}
                swipeEnabled={true}
                pagerStyle={{
                    minHeight: height / 2,
                    maxHeight: height * 4,
                    backgroundColor: '#FFF',
                }}
            />
        );
    };

    const RenderTabs02 = () => { // Component for review, faq and overview for reorded course
        let [index, setIndex] = React.useState(0);
        let [routes] = React.useState([
            {key: 'first', title: 'Overview'},
            {key: 'second', title: 'Review'},
            {key: 'third', title: 'FAQ'},
        ]);
        let renderScene = SceneMap({
            first: OverTest,
            second: Review,
            third: FAQ,
        });
    
        let renderTabBar = props => {
            return (
                <TabBar
                {...props}
                    indicatorStyle={{backgroundColor: '#364b5b'}}
                    style={{backgroundColor: '#FFF'}}
                    labelStyle={{color: '#8C8C8C'}}
                    activeColor="#364b5b"
                    scrollEnabled={true}
                    tabStyle={{width: width / 3.2}}
                />
            );
        };
        return (
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: width}}
                swipeEnabled={true}
                pagerStyle={{
                    minHeight: height / 2,
                    maxHeight: height * 4,
                    backgroundColor: '#FFF',
                    // color:"#000"
                }}
            />
        );
    };

    const RenderMain = () => {
        return (
            <ScrollView>
                <VStack ml={3} mr={3}>

                    {/* Showing intro video on top */}
                    <VideoPlayer
                        source={{uri: VideoPath}}
                        style={{maxWidth: width / 1, height: height / 4}}
                        onError={()=>{
                            console.log('Something went wrong...');
                        }}
                        onEnd = {()=>isVideoEnd(true)}
                        pictureInPicture={true}
                        navigator={navigation}
                        isFullscreen={false}
                        tapAnywhereToPause = {false}
                        onPlay = {() => {}}
                        paused={true}
                    />

                    {/* Course name and instructor name */}
                    <Text mt={1} style={{ fontSize: 15, color: '#000000', fontWeight: 'bold', maxWidth: width / 1,}}>{CourseTitle}</Text>
                    <HStack space={2}>
                        <Text style={{fontSize: 12, fontWeight: 'bold'}} color={'greyScale.800'}>By</Text>
                        <Text style={{fontSize: 13, fontWeight: 'bold'}} color="primary.100">{CourseData.instructorName}</Text>
                    </HStack>

                    {/* Course review and Total learner of the course to show on hero section */}
                    <HStack space={2} justifyContent={"space-between"} mt="2" alignItems="center">
                        <HStack space={2} alignItems="center">
                            <HStack space={1}>
                                <AirbnbRating
                                    count={5}
                                    isDisabled={true}
                                    showRating={false}
                                    defaultRating={`${CourseData.rating}`}
                                    size={15}
                                    value={`${CourseData.rating}`}
                                />
                            </HStack>
                            {
                            CourseData.ratingCount !== 0 ?
                            <Text style={{fontSize: 14, color: '#364b5b'}}>{CourseData.rating.toFixed(1)}({CourseData.ratingCount})</Text>
                            :
                            <Text style={{fontSize: 14, color: '#364b5b'}}>{CourseData.rating}({CourseData.ratingCount})</Text>
                            }
                            <Text onPress={()=>setIsViewReview(true)} style={{ fontSize: 14, color: '#364b5b', fontWeight: 'bold' }}>View Reviews</Text>
                        </HStack>

                        {/* Total learner of the course */}
                        <HStack justifyContent={'space-between'} space={2} alignItems={'center'}>
                            <HStack space={3} alignItems={'center'}>
                                <Image source={require('../../assets/graduate.png')} alt="courses" size={4}/>
                            </HStack>
                            {CourseData.hasOwnProperty('learnersCount') ? <Text color={'#000'} fontSize={14}>{CourseData.learnersCount} Learners</Text> : <Text color={'#000'} fontSize={14}>0 Learners</Text>}
                        </HStack>
                    </HStack>

                    {/* Showing course fee and demo button if the course has demo */}
                    <HStack justifyContent={'space-between'} mt={2} alignItems={'center'}>
                        <VStack>
                            <Text style={{fontSize: 10, fontWeight: 'bold'}} color={'greyScale.800'}>Fee</Text>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}} color={'#000'}>{CourseData.currency === 'INR' ? '₹' : '$'} {CourseData.fee}</Text>
                        </VStack>
                        {
                            !allCourseData.isPurchase && allCourseData.isDemo ?
                                <Button isDisabled={allCourseData.isDemoRequested} colorScheme={'primary'}  _text={{fontSize: 12}} pl={4} pr={4}
                                    onPress={()=>requestDemoClass()}>Request For Demo class</Button>
                            : null
                        }
                    </HStack>

                    {/* Join now on live class if purchased and has live class */}
                    {
                        Object.keys(liveObjForToday).length > 0 ?
                            <TouchableOpacity
                                onPress={()=> {
                                    console.log(liveObjForToday)
                                    navigation.navigate('LiveClass', { LiveClassData : liveObjForToday });
                                    // dispatch(setLiveClassD(ActiveLCData));
                                    // navigation.navigate('LiveClass', { LiveClassData : LiveClass });
                                }}
                            >
                                <HStack justifyContent={'space-between'} bg={'primary.100'} p={4} borderRadius={8} mt={4}>
                                <HStack alignItems={'center'} space={2}>
                                    <Image source={require('../../assets/Courses/streaming_pink.png')} alt="Stream" size={7}/>
                                    <Text fontSize={16} color={'#FFF'}>Join now</Text>
                                </HStack>
                                {/* <Text fontSize={16} color={'#FFF'}>
                                    02:45:00
                                </Text> */}
                                </HStack>
                            </TouchableOpacity>
                        : null
                    }

                    {/* Join demo class if not purchased, has demo class and student joining link is avaiable */}
                    {
                        isDemoClassAvailable && !allCourseData.isPurchase && DemoClassData.hasOwnProperty('studentLink') && DemoClassData.studentLink !== 'CourseCode and DemoCode is required' ?
                            <TouchableOpacity onPress={()=>{
                                dispatch(setJoinDemoClassData(DemoClassData))
                                navigation.navigate('JoinDemoClass')
                            }}>
                                <HStack mt={2} justifyContent={'space-between'} bg={'primary.100'} p={4} borderRadius={8}>
                                    <Text fontSize={16} color={'secondary.50'}>Join in Demo Class</Text>
                                    <HStack alignItems={'center'}>
                                        <Image source={require('../../assets/Courses/streaming_pink.png')} alt="Stream" size={7} />
                                    </HStack>
                                </HStack>
                            </TouchableOpacity>
                        : null
                    }
                    
                    <VStack space={4} mt={4}>

                        {
                            allCourseData.isPurchase ?
                                //  Course progress percentage and recource if purchased 
                                <VStack space={3}>

                                    {/* Course progress percentage */}
                                    <HStack space={2} alignItems={'center'}>
                                        <Center w="90%">
                                            <Box w="100%">
                                                <Progress size={'xs'} mb={1} mt={1} value={allCourseData.courseProgressPercentage} color={'primary.100'} />
                                            </Box>
                                        </Center>
                                        {
                                        allCourseData.courseProgressPercentage ? 
                                            <Text color={'#000'} fontSize={12}>{Number.isInteger(allCourseData.courseProgressPercentage) ? allCourseData.courseProgressPercentage : allCourseData.courseProgressPercentage.toFixed(2) }%</Text>
                                        :
                                            <Text color={'#000'} fontSize={12}>0%</Text>
                                        }
                                    </HStack>

                                    {/* Show recource */}
                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                        <Text color={'#000'} fontSize={14} fontWeight={'bold'}>Resource</Text>
                                        <Button bg={'secondary.50'} _text={{color: '#364b5b'}} width={width / 2.2} borderRadius={5}
                                            endIcon={
                                            <Icon name="cloud-download-outline" size={20} color="#364b5b" />
                                            } _pressed={{backgroundColor: '#F0E1EB', opacity:0.5}}
                                            onPress={()=>SetShowResources(true)}
                                            >
                                            <HStack space={2}>
                                                <Text style={{fontSize: 12, fontWeight: 'bold'}} color={'primary.100'}>Resource</Text>
                                            </HStack>
                                        </Button>
                                    </HStack>
                                </VStack>
                            :
                                //  Add to cart and buy now if not purchased 
                                <VStack space={4}>
                                    <HStack justifyContent="space-between">
                                        <Button bg={'secondary.50'} _text={{color: '#364b5b'}} width={width / 2.2} borderRadius={5}
                                            startIcon={
                                            <Icon name="cart-outline" size={20} color="#364b5b" />
                                            } _pressed={{backgroundColor: '#364b5b', opacity:0.5}} onPress={() => AddTC()}
                                        >
                                            <HStack space={2}>
                                                <Text style={{fontSize: 13, fontWeight: 'bold'}} color={'primary.100'}>Add to Cart</Text>
                                            </HStack>
                                        </Button>
                                        <Button bg={'secondary.50'}  _text={{color: '#364b5b'}} width={width / 2.2} borderRadius={5}
                                            startIcon={
                                            <Icon name="heart-outline" size={20} color="#364b5b" />
                                            } onPress={()=> ATWish()}
                                        >
                                            <HStack space={2}>
                                                <Text style={{fontSize: 13, fontWeight: 'bold'}} color={'primary.100'}>Add to Wishlist</Text>
                                            </HStack>
                                        </Button>
                                    </HStack>
                                    <Button colorScheme={'primary'} width={width / 1.06} justifyContent={'center'} alignSelf={'center'}  _text={{fontSize: 13}}
                                        onPress={()=>{
                                            dispatch(setBuyNowCourse(CourseData))
                                            navigation.navigate('BuyNow');
                                        }}
                                    >Buy Now</Button>
                                </VStack>
                        }


                    </VStack>

                    {/* Message Instructor if purchased */}
                    {
                        allCourseData.isPurchase ? <Button mt={4} bg={'primary.50'} _text={{ color:'secondary.50', fontSize:14, fontWeight:'bold' }} _pressed={{backgroundColor:'#F0E1EB', opacity:'0.5' }} onPress={ ()=> {
                            navigation.navigate('Inbox', {instructor: {
                                fullName: InstructorName,
                                profileImgPath: profileImgPath,
                                id: CourseData.instructorId
                            }})
                        }}>Message to Instructor</Button> : null
                    }

                    {/* Course Curriculum and chapters */}
                    <VStack bg="white.100" mt={2}>

                        {/* Course Curriculum bar with course duration if exist */}
                        <HStack justifyContent={'space-between'} bg={'primary.100'} p={4} borderTopRadius={8}>
                            <Text fontSize={16} color={'secondary.50'}>Course Curriculum</Text>
                            <HStack alignItems={'center'}>
                                <Icon name="time" size={20} color="#F0E1EB" />
                                {
                                allCourseData.totalCourseDuration !== null || allCourseData.totalCourseDuration !== 'undefined' ?
                                    <Text fontSize={14} color={'secondary.50'}>
                                        {} {new Date(courseDuration*1000).toISOString().substr(11, 8)}
                                    </Text>
                                : <></>
                                }
                            </HStack>
                        </HStack>

                        {/* Chapters if exist */}
                        <VStack m={3}>
                            {ChapterD ? (
                                <Accordion
                                    sections={ChapterD}
                                    activeSections={ActiveSessions}
                                    renderHeader={CHeader}
                                    renderContent={CBody}
                                    onChange={CollapsibleChange}
                                    underlayColor={'#FFF'}
                                />
                            ) : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'}> No Chapter to show yet!</Text>}
                        </VStack>

                    </VStack>

                    {/* Live classes */}
                    <VStack bg="white.100" mt={2} pb={2}>

                        {/* Live videos header tab */}
                        <HStack justifyContent={'space-between'} bg={'primary.100'} p={4} borderTopRadius={8}>
                            <Text fontSize={16} color={'secondary.50'}>Live Videos</Text>
                            <HStack alignItems={'center'}>
                                <Image source={require('../../assets/Courses/streaming_pink.png')} alt="Stream" size={7}/>
                            </HStack>
                        </HStack>

                        
                        {
                            allCourseData.isPurchase ? //Checking if purchased
                            <>
                            { // Live class list based on course type i.e recorded or live
                                CourseData.isLive ? <RenderLiveVideosForLiveCourse /> : <RenderLiveVideosForRecordedCourse />
                            }
                            </>
                            : // if not pursased than only recorded courses data will be shown
                            <>
                                {
                                    !CourseData.isLive ? <RenderLiveVideosForRecordedCourse /> : null
                                }
                            </>
                        }
                        
                    </VStack>
                    
                    { // Review, Faq, overview, class time tabs based on course type
                        CourseData.isLive  ? <RenderTabs01/> : <RenderTabs02/>
                    }

                    {/* Intructor Profile section */}
                    <VStack bg={'white.100'} mt={5} p={7} space={4}>
                        <HStack maxW={width / 1.3} space={4} alignItems={'center'}>
                            <Container>
                            { profileImgPath !== null ?
                                <Image source={{ uri: profileImgPath }} alt="profile" size={'md'} rounded={20}/>
                            : <Image source={require('../../assets/personIcon.png')} alt="profile" size={'md'} rounded={20}/>
                            }
                            </Container>
                            <VStack space={1}>
                                <Text color={'#000'} fontSize={16} fontWeight={'bold'}>{InstructorName}</Text>
                                <HStack space={1}>
                                    {
                                        Instructor.hasOwnProperty('rating') ?
                                        <>
                                        <AirbnbRating
                                            count={5}
                                            isDisabled={true}
                                            showRating={false}
                                            defaultRating={`${Instructor.rating}`}
                                            size={15}
                                            value={`${Instructor.rating}`}
                                        />
                                            {
                                                !Number.isInteger(Instructor.ratingCount) ?
                                                <Text style={{fontSize: 14, color: '#364b5b'}}>{Instructor.rating.toFixed(1)} ({Instructor.ratingCount})</Text>
                                                :
                                                <Text style={{fontSize: 14, color: '#364b5b'}}>{Instructor.rating} ({Instructor.ratingCount})</Text>
                                            }
                                        </>
                                        : 
                                        <>
                                        <AirbnbRating
                                        count={5}
                                        isDisabled={true}
                                        showRating={false}
                                        defaultRating={0}
                                        size={15}
                                        value={0}
                                        />
                                        <Text style={{fontSize: 14, color: '#364b5b'}}>0 (0)</Text>
                                        </>
                                    }
                                </HStack>
                            </VStack>
                        </HStack>
                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                            <HStack space={2} alignItems={'center'}>
                                <Image source={require('../../assets/courses.png')} alt="courses" size={8}/>
                                <Text color={'#000'} fontSize={14}>Total Courses</Text>
                            </HStack>
                            { courses ? <Text color={'#000'} fontSize={14}>{courses.totalCourses}</Text> : <Text color={'#000'} fontSize={14}>0</Text>}
                        </HStack>
                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                            <HStack space={3} alignItems={'center'}>
                                <Image source={require('../../assets/graduate.png')} alt="courses" size={7}/>
                                <Text color={'#000'} fontSize={14}>Total Learners</Text>
                            </HStack>
                            {courses ? <Text color={'#000'} fontSize={14}>{courses.totalLearners}</Text> : <Text color={'#000'} fontSize={14}>0</Text>}
                        </HStack>

                        <Button mt={2} bg={'secondary.50'} _text={{ color:'#364b5b', fontSize:14, fontWeight:'bold' }} _pressed={{backgroundColor:'#F0E1EB', opacity:'0.5' }} onPress={()=> navigation.navigate('InstructorProfile')}>
                            View Profile
                        </Button>
                    </VStack>

                </VStack>
            </ScrollView>
        )
    }

    return (
        <VStack style={styles.container}>
            <Navbar props={AppBarContent} />

            {/* Modal to show resources */}
            <Modal isOpen={ShowResources} onClose={()=> SetShowResources(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Body>
                        { Resources.length !== 0 ?
                        <View style={{padding:10}}>
                        {
                            Resources.map((data, i)=>{
                            return (
                                <View key={i}>
                                <ResoucreFile props={data}/>
                                </View>
                            );
                            })
                        }
                        </View>
                        : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'}>No Resouces to show!</Text>
                        }
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            
            {/* Modal to show reviews */}
            <Modal isOpen={isViewReview} size={'full'} onClose={()=> setIsViewReview(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Body>
                        <View mt={5}>
                            <Review />
                        </View>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            {/* Modal to show demo request message */}
            <Modal isOpen={showDemoMessage} onClose={()=> setShowDemoMessage(false)}>
            <Modal.Content maxWidth="700px">
                <Modal.Body>
                    <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5} justifyContent="center" alignItems="center">
                    <Image source={require('../../assets/ErrorPNG.png')} resizeMode="contain" size="40" alt="successful" />
                    {/* <Text fontWeight="bold" color={'red.400'} fontSize="17">E</Text>  */}
                    <Text fontWeight="bold" textAlign={'center'} style={{color:"#000"}} fontSize="14">You have already requested for Demo class for this course.</Text> 
                    <Button  bg={'red.400'} colorScheme="blueGray" style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                        _pressed={{bg: "#fcfcfc",  _text:{color: "#3e5160"} }} onPress={()=>setShowDemoMessage(false)}
                    >
                        OK 
                    </Button>
                    </VStack>
                </Modal.Body>
            </Modal.Content>
            </Modal>

            {/* Recources modal need to added */}
            {
                isComponentLoaded ? <RenderMain /> : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'} mt={2}>Loading ...</Text>
            }
        </VStack>
    );
};

export default ViewLiveCourse;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F1F1',
        height: height,
        width: width,
        flex: 1,
    },
    TopContainer: {
        flexGrow: 1,
        paddingBottom: 70,
    },
    courseImg: {
        height: height / 4,
        borderRadius: 5,
    },
});
  