/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  HStack,
  VStack,
  Center,
  Text,
  Image,
  Button,
  Divider,
  Container,
  useToast,
  Progress,
  Box,
  Modal,
  Linking,
} from 'native-base';
import Navbar from '../components/Navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import Accordion from 'react-native-collapsible/Accordion';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Overview from './SCTabs/Overview';
import Review from './SCTabs/Review';
import FAQ from './SCTabs/FAQ';
import {useSelector, useDispatch} from 'react-redux';
import {setLoading} from '../Redux/Features/authSlice';
import {setLiveClassD, setAssessmentData,setFullCourseData} from '../Redux/Features/CourseSlice';
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


const {width, height} = Dimensions.get('window');

const SCView = ({navigation}) => {

  const dispatch = useDispatch();
  const toast = useToast();
  const [ActiveSessions, setActiveSessions] = useState([]);
  const CData = useSelector(state => state.Course.SCData);
  const [type, setType] = useState(false)
  const CourseData = CData.CDD;
  const [InstructorName, setInstructorName] = useState('No Name');
  const [profileImgPath, setprofileImgPath ] = useState(null);
  const email = useSelector(state => state.Auth.Mail);
  const [CourseTitle, setCourseTitle] = useState();
  const [CourseD, setCourseD] = useState();
  const [ChapterD, SetChapterD] = useState();
  const [LiveClass, setLiveClass] = useState();
  const [Instructor, setIns] = useState();
  const [courses, setCourses] = useState(null);
  const [IsLCActive, setIsLCActive] = useState(false);
  const [ActiveLCData, setActiveLCData] = useState();
  const player = useRef();
  const [CourseProgress, setCourseProgress] = useState(0);
  const [VideoPath, setVideoPath] = useState('https://ql-files.s3.ap-south-1.amazonaws.com/course/lesson-1669093090707-sample-mp4-file.mp4');
  const [Resources, setResources] = useState([]);
  const [ShowResources, SetShowResources] = useState(false);
  const [purchasedCourse, setPurchasedCourse] = useState(null)
  const [stateLoading, setStateLoading] = useState(true)
  
  const AppBarContent = {
    title: ' ',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };
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
const OverviewSource = {
  html: `<head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head> 
        <body>${CourseData.courseOverview}</body>`,
};
// if(CourseD){
//   console.log("Purcaged course data: " + CourseD)
// }

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

    }
  };
  const getPurchasedCourses = async() => {
    try {
      // dispatch(setLoading(true))
     let response = await GetPurchasedCourses(email);
     if (response.status === 200) {
       if (response.data.length !== 0) {
         setPurchasedCourse(response.data);
         console.log('Course code : ',CData.CDD.courseCode)
         response.data.map((i)=>{
          if(i.courseCode === CData.CDD.courseCode){
            setType(true)
          }
         })
         console.log('PC courses retrieved successfully');
       }
     } else {
       console.log("GetPC error: " + response.message);
     }
     setStateLoading(false)
    } catch (err) {
     console.log("GetPC error: " + err.message);
    }
   };

  
  useEffect(() => {
    console.log('Recorded Course details!!');
    if (CourseData) {
      // console.log(CourseData)
      setCourseD(CourseData);
      SetDiff();
      setCourseProgress(CourseData.courseProgressPercentage);
      GetI(email,CourseData.instructorId);
      GetICourses(email,CourseData.instructorId);
      setVideoPath(CourseData.introVideoPath);
      GetCourseDetails(email,CourseData.courseCode);
      getPurchasedCourses()
    }
  }, [CourseData]);

  const RenderTabs01 = () => {
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

  const RenderTabs02 = () => {
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
        }}
      />
      );
    };
    
    // const currency = CourseD.currency === 'INR' ? '₹' : '$';
  const GetCourseDetails = async(mail, code) =>{
    try {
      let response = await GetCourseByCode(mail, code);
      if (response.status === 200) {
        dispatch(setFullCourseData(response.data));
        let FData = response.data;
         if (FData.chapterList.length > 0) {
          SetChapterD(FData.chapterList);
         }
      } else {
        console.log("GetCourseDetails: " + response.message);
        alert( "GetCourseDetails: " + response.message);
      }
    } catch (error) {
      console.log("GetCourseDetails: " + error.message);
      alert("GetCourseDetails: " + error.message);
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
      });    }
    };
    
    const SetDiff = async () => {
      console.log(email + ' ' + CourseData.courseCode);
      setCourseTitle(CourseData.courseName);
      GetLC(email, CourseData.courseCode);
    };
    
    const GetLC = async (mail, code) => {
      try {
        let response = await GetLiveClass(mail, code);
        if (response.status === 200){
          let data = response.data;
          if (data.length !== 0){
            if (data[0].liveClassList) {
              let LData = data[0].liveClassList;
          if (LData.length !== 0){
            // console.log('Live class data: ', LData)
            setLiveClass(LData);
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
      console.log("GetLC :" + response.message);
      alert("GetLC :" + response.message);
    }
   } catch (err) {
    console.log("GetLC :" + err.message);
    alert("GetLC :" + err.message);
   }
  };

  const SetLCData = (data) => {
    if (data.liveStatus === 'INPROGRESS'){
      return data;
    }
  };

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
       alert("GetI: " + response.message);
     }
    } catch (err) {
     console.log("GetI: " + err.message);
     alert("GetI: " + err.message);
    }
   };

   const GetICourses = async (mail, id) => {
    try {
     let response = await GetInstructorCourses(mail, id);
     if (response.status === 200) {
      if (response.data.length !== 0) {
        let data = response.data;
        setCourses(data);
        dispatch(setInstructorCourses(data));
      } else {
        dispatch(setInstructorCourses([]));
      }
       } else {
       console.log("GetICourses : " + response.message);
       alert("GetICourses : " + response.message);
     }
    } catch (err) {
     console.log("GetICourses : " + err.message);
     alert("GetICourses : " + err.message);
    }
   };

  const GetChaps = async (mail, code) => {
    if (mail === '' || code === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: mail,
        },
      };
      await fetch(BaseURL + 'getAllChapter?courseCode=' + code, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            dispatch(setLoading(false));
            let data = result.data;
            if (data.length > 0) {
             if (data[0].chapterList) {
              let chapterList = data[0].chapterList;
               if (chapterList.length !== 0){
                SetChapterD(chapterList);
                // console.log(chapterList);
               }
            }
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('GetChaps: ' + result.message);
            console.log('GetChaps: ' + result.message);
          }
        }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('GetChaps: ' + error);
          alert('GetChaps: ' + error);
        });
    }
  };

  const OverTest = () => {
    // console.log(OverviewSource);
    return (
      <View>
        <RenderHtml
          contentWidth={width / 3}
          source={OverviewSource}
          renderersProps={renderersProps}
        />
        {/* <Text>yeet</Text> */}
      </View>
    );
  };



  const CHeader = (section, index) => {
    return (
      <VStack space={1} mt={2}>
        <HStack alignItems={'center'} justifyContent={'space-between'}>
          <Text color={'#000'} fontSize={14} fontWeight={'bold'}  maxW={width / 1.5}>
            Chapter {index + 1}: {section.chapterName}
          </Text>
          <Icon
            name={
              index === ActiveSessions[0]
                ? 'chevron-up-outline'
                : 'chevron-down-outline'
            }
            size={20}
            color="#000"
          />
        </HStack>

        <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>
          10:20:01
        </Text>
        {ChapterD.length !== index + 1 && index !== ActiveSessions[0] ? (
          <Divider mt={1} bg={'greyScale.800'} thickness={1} />
        ) : null}
      </VStack>
    );
  };

  const CBody = (dat, index) => {
    const LessonData = dat.lessonList;
    // console.log('This is dat: ', dat);
    return (
      <View style={{marginTop: 5, marginBottom: 5}}>
        {LessonData.map((data, index) => {
          // console.log(data);
          let AData = {
            Data: data,
            chapterOrder:dat.chapterOrder,
          };
          // console.log(AData);
          return (
            <TouchableOpacity
              key={index}
              onPress={()=> {
                if (type) {
                  console.log('Purchased')
                  if (data.isAssesment === false) {
                  setVideoPath(data.lessonVideoPath);
                  setCourseTitle(data.lessonName);
                  setResources(data.resourceDetails);
                } else if (data.isAssesment === true) {
                  setResources([]);
                  navigation.navigate('Assessments');
                  dispatch(setAssessmentData(AData));
                  // console.log('Assesment:' + data.isAssesment);
                }
              }
              // else {
              //   setResources(data.resourceDetails);
              //   SetShowResources(true);
                // console.log(data);
                // navigation.navigate('AssessmentList');
              // }
              }}
              >
              <HStack justifyContent={'space-between'} mt={2}>
                <HStack space={2} alignItems="center">
                  <View>
                    {data.isCompleted === false && data.isAssesment === false ? (
                      <Icon
                        name="play"
                        color="#364b5b"
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          backgroundColor: '#F0E1EB',
                          padding: 5,
                          borderRadius: 20,
                        }}
                        size={15}
                      />
                    ) : null}
                    {data.isCompleted === false && data.isAssesment === true ? (
                      <Icon
                        name="clipboard"
                        color="#364b5b"
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          backgroundColor: '#F0E1EB',
                          padding: 5,
                          borderRadius: 20,
                        }}
                        size={15}
                      />
                    ) : null}
                    {data.isCompleted === true ? (
                      <Image
                        source={require('../../assets/CompletedTick.png')}
                        alt="completed"
                        size={7}
                      />
                    ) : null}
                  </View>
                  <VStack>
                    <Text color={'#000'} fontSize={14} fontWeight={'bold'}>
                      {data.lessonName}
                    </Text>
                    { data.isAssesment !== true ?
                    <Text
                      color={'greyScale.800'}
                      fontSize={12}
                      fontWeight={'bold'}>
                      10:20:01
                    </Text> : null}
                  </VStack>
                </HStack>
                <Icon
                  name={type ? "lock-open" : "lock-closed"}
                  size={17}
                  style={{padding: 5}}
                  color="#364b5b"
                />
              </HStack>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const CollapsibleChange = active => {
    setActiveSessions(active);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar props={AppBarContent} />
      {stateLoading ? <></>
        :
        <ScrollView
        contentContainerStyle={styles.TopContainer}
        nestedScrollEnabled={true}>
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
        {CourseD ? (
          <VStack ml={3} mr={3}>
            <VideoPlayer
              source={{uri: VideoPath}}
              style={{maxWidth: width / 1, height: height / 4}}
              onError={()=>{
                console.log('Something went wrong...');
              }}
              pictureInPicture={true}
              navigator={navigation}
              isFullscreen={false}
              tapAnywhereToPause = {false}
              onPlay = {() => {}}
              paused={true}
            />

            <Text
              mt={1}
              style={{
                fontSize: 15,
                color: '#000000',
                fontWeight: 'bold',
                maxWidth: width / 1,
              }}>
              {CourseTitle}
            </Text>
            {type ? <></> :
              <HStack space={2}>
                  <Text
                    style={{fontSize: 12, fontWeight: 'bold'}}
                    color={'greyScale.800'}>
                    By
                  </Text>
                  <Text
                    style={{fontSize: 13, fontWeight: 'bold'}}
                    color="primary.100">
                    {CourseD.instructorName}
                  </Text>
                </HStack>}
            {!type ?
           <HStack space={2} mt="2" alignItems="center">
              <HStack space={2} alignItems="center">
                <HStack space={1}>
                  {[...Array(CourseD.ratingCount)].map((e, i) => {
                    return (
                      <Image
                        key={i}
                        source={require('../../assets/Home/star.png')}
                        alt="rating"
                        size="3"
                      />
                    );
                  })}
                </HStack>
                <Text style={{fontSize: 14, color: '#364b5b'}}>
                  {CourseD.rating}({CourseD.ratingCount})
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#364b5b',
                    fontWeight: 'bold',
                    paddingLeft: 15,
                  }}>
                  View Reviews
                </Text>
              </HStack>
            </HStack> : <></> }

          {type && ActiveLCData && IsLCActive === true ?
            <TouchableOpacity
                onPress={()=> {
                  // console.log(LiveClassD)
                  dispatch(setLiveClassD(ActiveLCData));
                  navigation.navigate('LiveClass', { LiveClassData : LiveClass });
                }}
            >
              <HStack
                justifyContent={'space-between'}
                bg={'primary.100'}
                p={4}
                borderRadius={8}
                mt={4}
                >
                <HStack alignItems={'center'} space={2}>
                  <Image
                    source={require('../../assets/Courses/streaming_pink.png')}
                    alt="Stream"
                    size={7}
                  />
                  <Text fontSize={16} color={'#FFF'}>
                    Join now
                  </Text>
                </HStack>
                <Text fontSize={16} color={'#FFF'}>
                  02:45:00
                </Text>
              </HStack>
            </TouchableOpacity>
            : null
            }

            {!type  ?
           <HStack
              justifyContent={'space-between'}
              mt={2}
              alignItems={'center'}>
              <VStack>
                <Text
                  style={{fontSize: 10, fontWeight: 'bold'}}
                  color={'greyScale.800'}>
                  Fee
                </Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}} color={'#000'}>
                  {CourseD.currency === 'INR' ? '₹' : '$'} {CourseD.fee}
                </Text>
              </VStack>
              <Button
                colorScheme={'primary'}
                _text={{fontSize: 12}}
                pl={4}
                pr={4}>
                Request For Demo class
              </Button>
            </HStack> : null}
            <VStack space={4} mt={4}>
              {purchasedCourse !== null ? console.log('purchasedCourse') : console.log('not data')}
              {!type ?
              <VStack space={4}>
                <HStack justifyContent="space-between">
                  <Button
                    bg={'secondary.50'}
                    _text={{color: '#364b5b'}}
                    width={width / 2.2}
                    borderRadius={5}
                    startIcon={
                      <Icon name="cart-outline" size={20} color="#364b5b" />
                    }
                    _pressed={{backgroundColor: '#364b5b', opacity:0.5}}
                    onPress={() => AddTC()}
                    >
                    <HStack space={2}>
                      <Text
                        style={{fontSize: 13, fontWeight: 'bold'}}
                        color={'primary.100'}>
                        Add to Cart
                      </Text>
                    </HStack>
                  </Button>
                  <Button
                    bg={'secondary.50'}
                    _text={{color: '#364b5b'}}
                    width={width / 2.2}
                    borderRadius={5}
                    startIcon={
                      <Icon name="heart-outline" size={20} color="#364b5b" />
                    }
                    onPress={()=> ATWish()}
                    >
                    <HStack space={2}>
                      <Text
                        style={{fontSize: 13, fontWeight: 'bold'}}
                        color={'primary.100'}>
                        Add to Wishlist
                      </Text>
                    </HStack>
                  </Button>
                </HStack>
                <Button
                  colorScheme={'primary'}
                  width={width / 1.06}
                  justifyContent={'center'}
                  alignSelf={'center'}
                  _text={{fontSize: 13}}
                  onPress={()=>{
                    AddTC();
                    navigation.navigate('Cart');
                  }}
                  >
                  Buy Now
                </Button>
              </VStack> :
              <VStack space={3}>
                <HStack space={2} alignItems={'center'}>
                <Center w="90%">
                  <Box w="100%">
                    <Progress size={'xs'}
                      mb={1}
                      mt={1}
                      value={CourseProgress}
                      color={'primary.100'}
                    />
                  </Box>
                  </Center>
                  <Text color={'#000'} fontSize={12}>{CourseProgress}%</Text>
                </HStack>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                  <Text color={'#000'} fontSize={14} fontWeight={'bold'}>Resource</Text>
                  <Button
                    bg={'secondary.50'}
                    _text={{color: '#364b5b'}}
                    width={width / 2.2}
                    borderRadius={5}
                    endIcon={
                      <Icon name="cloud-download-outline" size={20} color="#364b5b" />
                    }
                    _pressed={{backgroundColor: '#F0E1EB', opacity:0.5}}
                    onPress={()=>SetShowResources(true)}
                    >
                    <HStack space={2}>
                      <Text
                        style={{fontSize: 12, fontWeight: 'bold'}}
                        color={'primary.100'}>
                       Resource
                      </Text>
                    </HStack>
                  </Button>
                </HStack>
              </VStack>}

              <VStack bg="white.100" mt={2}>
                <HStack
                  justifyContent={'space-between'}
                  bg={'primary.100'}
                  p={4}
                  borderTopRadius={8}>
                  <Text fontSize={16} color={'secondary.50'}>
                    Course Curriculum
                  </Text>
                  <HStack alignItems={'center'}>
                    <Icon name="time" size={20} color="#F0E1EB" />
                    <Text fontSize={14} color={'secondary.50'}>
                      {CourseD.timeDuration}
                    </Text>
                  </HStack>
                </HStack>

                <VStack m={3}>
                  {/* {console.log('Chapter D: ',ActiveSessions)} */}
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


              <VStack bg="white.100" mt={2} pb={2}>
                <HStack
                  justifyContent={'space-between'}
                  bg={'primary.100'}
                  p={4}
                  borderTopRadius={8}>
                  <Text fontSize={16} color={'secondary.50'}>
                    Live Videos
                  </Text>
                  <HStack alignItems={'center'}>
                    {/* <Icon name="time" size={20} color="#F0E1EB" /> */}
                    <Image
                      source={require('../../assets/Courses/streaming_pink.png')}
                      alt="Stream"
                      size={7}
                    />
                  </HStack>
                </HStack>

                {
                  LiveClass ? (
                    LiveClass.map((data, i) =>{
                      return (
                        <View key={i}>
                          <HStack justifyContent={'space-between'} mt={3} mr={3} ml={3}>
                          <VStack>
                            <Text color={'#000'} fontSize={14} fontWeight={'bold'}>
                              Live Class {i + 1} : {data.topicName}
                            </Text>
                            <Text
                              color={'greyScale.800'}
                              fontSize={12}
                              fontWeight={'bold'}>
                              10:20:01
                            </Text>
                          </VStack>
                          <Icon
                            name={data.liveStatus === 'INPROGRESS' && type  ? 'lock-open' : 'lock-closed'}
                            size={17}
                            style={{padding: 5}}
                            color="#364b5b"
                          />
                          </HStack>
                          { LiveClass.length !== i + 1 ? <Divider mt={1} bg={'greyScale.800'} thickness={1} mb={2} /> : null }
                        </View>
                      );
                    })
                  )
                : <Text color={'greyScale.800'} fontSize={12} p={4} alignSelf="center">No Live Videos to show yet!</Text>}
                {/* { LiveClass === null ? <Text color={'greyScale.800'} fontSize={12} p={4} alignSelf="center">You don't have any Live Videos</Text> : null} */}

              </VStack>

             { type  ? <RenderTabs01/> : <RenderTabs02/>}
             {/* <RenderTabs02/> */}
            </VStack>

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
                  <HStack space={1} alignSelf={'flex-start'}>
                    {
                      [...Array(3)].map((e, i) =>{
                          return (
                            <Image
                              key={i}
                              source={require('../../assets/Home/star.png')}
                              alt="rating"
                              size="3"
                            />
                          );
                        }
                      )
                    }
                  </HStack>
                </VStack>
              </HStack>
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <HStack space={2} alignItems={'center'}>
                  <Image source={require('../../assets/courses.png')} alt="courses" size={8}/>
                  <Text color={'#000'} fontSize={14}>Total Courses</Text>
                </HStack>
                { courses ? <Text color={'#000'} fontSize={14}>{courses.length}</Text> : <Text color={'#000'} fontSize={14}>0</Text>}
              </HStack>
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <HStack space={3} alignItems={'center'}>
                  <Image source={require('../../assets/graduate.png')} alt="courses" size={7}/>
                  <Text color={'#000'} fontSize={14}>Total Learners</Text>
                </HStack>
                {courses ? <Text color={'#000'} fontSize={14}>{courses[0].learners.length}</Text> : <Text color={'#000'} fontSize={14}>0</Text>}
              </HStack>
              <Button mt={2} bg={'secondary.50'} _text={{ color:'#364b5b', fontSize:14, fontWeight:'bold' }} _pressed={{backgroundColor:'#F0E1EB', opacity:'0.5' }} onPress={()=> navigation.navigate('InstructorProfile')}>
                  View Profile
              </Button>
            </VStack>

          </VStack>
        ) : null}
      </ScrollView>
      }
    </SafeAreaView>
  );
};

export default SCView;

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
