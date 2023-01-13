/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Dimensions,
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
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
  } from 'native-base';
  import Navbar from '../components/Navbar';
  import Icon from 'react-native-vector-icons/Ionicons';
  import Accordion from 'react-native-collapsible/Accordion';
  import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
  import Overview from './SCTabs/Overview';
  import Review from './SCTabs/Review';
  import FAQ from './SCTabs/FAQ';
  import ClassTime from './SCTabs/ClassTime';
  import {useSelector, useDispatch} from 'react-redux';
  import {setLoading} from '../Redux/Features/authSlice';
  import { setInstructor,setInstructorCourses} from '../Redux/Features/InstructorSlice';
  import {BaseURL} from '../StaticData/Variables';
  import {ChapterDD,LiveClassD} from '../StaticData/data';
  import {GetLiveClass} from '../Functions/API/GetLiveClass';
  import { GetInstructor } from '../Functions/API/GetInstructor';
  import { GetLiveCourseFull } from '../Functions/API/GetLiveCourseFull';
  import { GetInstructorCourses } from '../Functions/API/GetInstructorCourses';
  import { DemoData } from '../StaticData/data';
  import { AddToCart } from '../Functions/API/AddToCart';

  const {width, height} = Dimensions.get('window');

  const LiveSCView = ({navigation}) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [ActiveSessions, setActiveSessions] = useState([]);
    const CData = useSelector(state => state.Course.SCData);
    const type = CData.type;
    const CourseData = CData.CDD;
    // const CourseData = DemoData[0];
    const [InstructorName, setInstructorName] = useState('No Name');
    const [profileImgPath, setprofileImgPath ] = useState(null);
    const email = useSelector(state => state.Auth.Mail);
    const [CourseTitle, setCourseTitle] = useState();
    const [CourseD, setCourseD] = useState();
    const [ChapterD, SetChapterD] = useState();
    const [LiveClass, setLiveClass] = useState(null);
    const [Instructor, setIns] = useState();
    const [courses, setCourses] = useState(null);
    // console.log(ChapterDD.length);
    const AppBarContent = {
      title: ' ',
      navigation: navigation,
      ArrowVisibility: true,
      RightIcon1: 'notifications-outline',
      RightIcon2: 'person',
    };
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      {key: 'first', title: 'Overview'},
      {key: 'second', title: 'Review'},
      {key: 'third', title: 'Class Time'},
      {key: 'fourth', title: 'FAQ'},
    ]);
    useEffect(() => {
      console.log('Live Course details');
      // console.log(CourseData);
      if (CourseData) {
        setCourseD(CourseData);
        SetDiff();
        GetI(email,CourseData.instructorId);
        GetICourses(email,CourseData.instructorId);
      }
    }, [CourseData]);

    const AddTC = async () => {
      try {
        let cart = await AddToCart(email, CourseData.courseCode);
        if (cart.status === 200) {
          toast.show({
            description: cart.message,
          });
          console.log(cart.message);
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

    const SetDiff = async () => {
        setCourseTitle(CourseData.courseName);
        // GetChaps(email, CourseData.courseCode);
        GetLC(email, CourseData.courseCode);
    };

    const GetLC = async (mail, code) => {
     try {
      let response = await GetLiveClass(mail, code);
      if (response.status === 200){
        let data = response.data;
        if (data.length !== 0){
          let LData = data[0].liveClassList;
          setLiveClass(LData);
          // console.log(LData);
          // setLiveClass(LiveClassD);
        }
      } else {
        console.log("GetLC error: " + response.message);
        alert("GetLC error: " + response.message);
      }
     } catch (err) {
      console.log("GetLC error: " + err.message);
      alert("GetLC error: " + err.message);
     }
    };

    const GetI = async (mail, id) => {
      // console.log(mail + ' ' + id);
      try {
       let response = await GetInstructor(mail, id);
       console.log(response.message);
       if (response.status === 200) {
         let data = response.data;
         setIns(data);
         console.log(response);
         dispatch(setInstructor(data));
         if (data !== null){
          setInstructorName(data.fullName);
            if (data.profileImgPath)
            {
              setprofileImgPath(data.profileImgPath);
              console.log(data.profileImgPath);
            }
            else {
              setprofileImgPath(null);
              console.log('no Profile');
            }
         } else {
          setInstructorName('No Name');
         }
         } else {
         console.log("GetI error: " + response.message);
         alert("GetI error: " + response.message);
       }
      } catch (err) {
       console.log("GetI error: " + err.message);
       alert("GetI error: " + err.message);
      }
     };

     const GetICourses = async (mail, id) => {
      try {
       let response = await GetInstructorCourses(mail, id);
       console.log(response.message);
       if (response.status === 200) {
        if (response.data.length !== 0) {
          let data = response.data;
          setCourses(data);
          dispatch(setInstructorCourses(data));
        } else {
          dispatch(setInstructorCourses([]));
        }
         } else {
         console.log("GetICourses error: " + response.message);
         alert("GetICourses error: " + response.message);
       }
      } catch (err) {
       console.log("GetICourses error: " + err.message);
       alert("GetICourses error: " + err.message);
      }
     };

    // const GetChaps = async (mail, code) => {
    //   if (mail === '' || code === '') {
    //     alert('Something is wrong, please login again');
    //   } else {
    //     const requestOptions = {
    //       method: 'GET',
    //       // headers:{
    //       //   'Accept': 'application/json',
    //       //   'Content-Type': 'application/json',
    //       //   'x-auth-token':UserD.JWT,
    //       // },
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         gmailUserType: 'STUDENT',
    //         token: mail,
    //       },
    //     };
    //     await fetch(BaseURL + 'getAllChapter?courseCode=' + code, requestOptions)
    //       .then(response => response.json())
    //       .then(result => {
    //         if (result.status === 200) {
    //           dispatch(setLoading(false));
    //           console.log(result.message);
    //           let data = result.data;
    //           if (data.length > 0) {
    //             SetChapterD(data[0].chapterList);
    //           }
    //           // if ( type === 'Popular'){
    //           //   // SetChapterD(data.chapterList);
    //             // console.log(data);
    //           // } else {
    //           //   SetChapterD(data[0].chapterList);
    //           // }
    //         } else if (result.status > 200) {
    //           dispatch(setLoading(false));
    //           alert('Error: ' + result.message);
    //           console.log(result.message);
    //         }
    //         // console.log(result);
    //       })
    //       .catch(error => {
    //         dispatch(setLoading(false));
    //         console.log('Error:' + error);
    //         alert('Error: ' + error);
    //       });
    //   }
    // };

    const renderScene = SceneMap({
      first: Overview,
      second: Review,
      third: ClassTime,
      fourth:FAQ,
    });

    const renderTabBar = props => {
      return (
        <TabBar
          {...props}
          indicatorStyle={{backgroundColor: '#364b5b'}}
          style={{backgroundColor: '#FFF'}}
          labelStyle={{color: '#8C8C8C', fontSize:10}}
          activeColor="#364b5b"
          scrollEnabled={true}
          tabStyle={{width: width / 4.3}}
        />
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

    const CBody = (data, index) => {
      // console.log(data);
      const LessonData = data.lessonList;
      return (
        <View style={{marginTop: 5, marginBottom: 5}}>
          {LessonData.map((data, index) => {
            return (
              <HStack justifyContent={'space-between'} mt={2} key={index}>
                <HStack space={2} alignItems="center">
                  <View>
                    {data.isCompleted !== false && data.isAssesment !== false ? (
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
                    <Text
                      color={'greyScale.800'}
                      fontSize={12}
                      fontWeight={'bold'}>
                      10:20:01
                    </Text>
                  </VStack>
                </HStack>
                <Icon
                  name="lock-closed"
                  size={17}
                  style={{padding: 5}}
                  color="#364b5b"
                />
              </HStack>
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
        <ScrollView
          contentContainerStyle={styles.TopContainer}
          nestedScrollEnabled={true}>
          {CourseD ? (
            <VStack ml={3} mr={3}>
              <Image
                source={{uri: CourseD.thumbNailImagePath}}
                alt="courseImg"
                resizeMode="cover"
                style={styles.courseImg}
                mb={2}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: '#000000',
                  fontWeight: 'bold',
                  maxWidth: width / 1,
                }}>
                {CourseTitle}
              </Text>
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
              </HStack>
              <HStack space={2} mt="2" alignItems="center">
                <HStack space={2} alignItems="center">
                  <HStack space={1}>
                    {/* <Image
                      source={require('../../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                    <Image
                      source={require('../../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                    <Image
                      source={require('../../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                    <Image
                      source={require('../../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    /> */}
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
              </HStack>
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
                    $ {CourseD.fee}
                  </Text>
                </VStack>
                <Button
                  colorScheme={'primary'}
                  _text={{fontSize: 12}}
                  pl={4}
                  pr={4}>
                  Request For Demo class
                </Button>
              </HStack>
              <VStack space={4} mt={4}>
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
                    }>
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
                  _text={{fontSize: 13}}>
                  Buy Now
                </Button>
                {/* <VStack bg="white.100" mt={2}>
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
                    {ChapterD ? (
                      <Accordion
                        sections={ChapterD}
                        activeSections={ActiveSessions}
                        renderHeader={CHeader}
                        renderContent={CBody}
                        onChange={CollapsibleChange}
                        underlayColor={'#FFF'}
                      />
                    ) : null}
                  </VStack>
                </VStack> */}
                {/* <VStack bg="white.100" mt={2} pb={2}>
                  <HStack
                    justifyContent={'space-between'}
                    bg={'primary.100'}
                    p={4}
                    borderTopRadius={8}>
                    <Text fontSize={16} color={'secondary.50'}>
                      Live Videos
                    </Text>
                    <HStack alignItems={'center'}>
                      <Image
                        source={require('../../assets/Courses/streaming_pink.png')}
                        alt="Stream"
                        size={7}
                      />
                    </HStack>
                  </HStack>

                  {
                    LiveClass !== null  ? (
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
                              name="lock-closed"
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
                  : <Text color={'greyScale.800'} fontSize={12} p={4} alignSelf="center">You don't have any Live Videos</Text>}

                </VStack> */}

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
                  { courses ? <Text color={'#000'} fontSize={14}>{courses[0].totalCourses}</Text> : <Text color={'#000'} fontSize={14}>0</Text>}
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
      </SafeAreaView>
    );
  };

  export default LiveSCView;

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

