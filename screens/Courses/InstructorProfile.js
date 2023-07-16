/* eslint-disable react/self-closing-comp */
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  HStack,
  VStack,
  Button,
  Image,
  Center,
  IconButton,
} from 'native-base';
import Navbar from '../components/Navbar';
import {useSelector, useDispatch} from 'react-redux';
import CourseCard from '../components/Courses/RCCard';
import {setSCData} from '../Redux/Features/CourseSlice';
import { AirbnbRating } from 'react-native-ratings';

const {width, height} = Dimensions.get('window');

const InstructorProfile = ({navigation}) => {
  const email = useSelector(state => state.Auth.Mail);
  const Instructor = useSelector(state => state.Instructor.Instructor);
  console.log("Instructor details : ", Instructor)
  const InstructorCourses = useSelector(
    state => state.Instructor.InstructorCourses,
  );
  console.log("Cources by instructor :",InstructorCourses)
  const [Ins, setIns] = useState();
  const [ICourses, setICourses] = useState();
  const [InstructorName, setInstructorName] = useState('No Name');
  const [profileImgPath, setprofileImgPath] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Instructor !== null) {
      if (Instructor.length !== 0) {
        setIns(Instructor);
        setInstructorName(Instructor.fullName);
        console.log('This is instructor data: ', Instructor);
        if (Instructor.profileImgPath) {
          setprofileImgPath(Instructor.profileImgPath);
          console.log(Instructor.profileImgPath);
        } else {
          setprofileImgPath(null);
          console.log('no Profile');
        }
      } else {
        setInstructorName('No Name');
        setprofileImgPath(null);
      }
    } else {
      setInstructorName('No Name');
    }
    // console.log(Instructor);
    if (InstructorCourses) {
      if (InstructorCourses.length !== 0) {
        setICourses(InstructorCourses);
        // InstructorCourses.map((i)=>{
        //   console.log('Instructor course: ' + i)
        // })
      }
    }
  }, [Instructor, InstructorCourses]);


  const AppBarContent = {
    title: '',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  const OpenLink = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar props={AppBarContent} />
      <ScrollView
        contentContainerStyle={styles.TopContainer}
        nestedScrollEnabled={true}>
        <VStack space={2} alignItems={'center'} justifyContent={'center'}>
          {profileImgPath !== null ? (
            <Image
              source={{uri: profileImgPath}}
              alt="profile"
              size={'md'}
              rounded={20}
            />
          ) : (
            <Image
              source={require('../../assets/personIcon.png')}
              alt="profile"
              size={'md'}
              rounded={20}
            />
          )}
          <Text color={'#000'} fontSize={16} fontWeight={'bold'}>
            {InstructorName}
          </Text>
          <HStack space={1}>
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
          </HStack>

          <HStack space={2}>
            <VStack alignItems={'center'} space={1}>
              <HStack alignItems={'center'} space={2}>
                <Image
                  source={require('../../assets/graduate.png')}
                  alt="courses"
                  size={4}
                />
                {
                  ICourses ?
                  <Text color={'#091B12'} fontSize={14} fontWeight={'bold'}>
                    {ICourses.totalLearners > 0 ? ICourses.totalLearners : '0'} Learners
                  </Text>
                  :
                  <></>

                }
              </HStack>
              <Text color={'#091B12'} fontSize={14} fontWeight={'bold'}>
                {!Instructor.yearsOfExperience ? '0 ' : Instructor.yearsOfExperience} Years Experience
              </Text>
            </VStack>
            <VStack space={1}>
              <Text
                color={'#091B12'}
                fontSize={14}
                pl={1}
                pr={1}
                fontWeight={'bold'}>
                |
              </Text>
              <Text
                color={'#091B12'}
                fontSize={14}
                pl={1}
                pr={1}
                fontWeight={'bold'}>
                |
              </Text>
            </VStack>
            <VStack alignItems={'center'} space={1}>
              <HStack alignItems={'center'} space={2}>
                <Image
                  source={require('../../assets/courses.png')}
                  alt="courses"
                  size={4}
                />
                {ICourses ?
                  <Text color={'#091B12'} fontSize={14} fontWeight={'bold'}>
                    {ICourses.totalCourses > 0 ? ICourses.totalCourses : '0'} Courses
                  </Text>
                  : <></>
                }
              </HStack>
              {Ins ? (
                <Text color={'#091B12'} fontSize={14} fontWeight={'bold'}>
                  Available{' '}
                  {Ins.availablePerHours !== undefined
                    ? Ins.availablePerHours
                    : '0'}{' '}
                  Hrs/Week
                </Text>
              ) : (
                <Text color={'#091B12'} fontSize={14} fontWeight={'bold'}>
                  Available 0 Hrs/Week
                </Text>
              )}
            </VStack>
          </HStack>
          {Ins ? (
            <HStack space={2}>
              {console.log(Ins.facebook, 'Is this a vaild url')}
              {Ins.facebook && Ins.facebook !== 'https://www.facebook.com/' ? (
                <TouchableOpacity onPress={() => OpenLink(Ins.facebook)}>
                  <Image
                    source={require('../../assets/Social/facebook.png')}
                    alt="facebook"
                    size={9}
                  />
                </TouchableOpacity>
              ) : null}
              {Ins.instagram && Ins.instagram !== 'https://www.instagram.com/' ? (
                <TouchableOpacity onPress={() => OpenLink(Ins.instagram)}>
                  <Image
                    source={require('../../assets/Social/instagram.png')}
                    alt="facebook"
                    size={9}
                  />
                </TouchableOpacity>
              ) : null}
              {Ins.linkedin && Ins.linkedin !== 'https://www.linkedin.com/'  ? (
                <TouchableOpacity onPress={() => OpenLink(Ins.linkedin)}>
                  <Image
                    source={require('../../assets/Social/linkedin.png')}
                    alt="facebook"
                    size={9}
                  />
                </TouchableOpacity>
              ) : null}
              {Ins.twitter && Ins.twitter !== 'https://twitter.com/' ? (
                <TouchableOpacity onPress={() => OpenLink(Ins.twitter)}>
                  <Image
                    source={require('../../assets/Social/Twitter.png')}
                    alt="facebook"
                    size={9}
                  />
                </TouchableOpacity>
              ) : null}
            </HStack>
          ) : null}
        </VStack>
        <VStack m={4} space={4}>
          <View>
            <Text color={'#091B12'} fontSize={16} fontWeight={'bold'} mb={1}>
              Expert In
            </Text>
            {Ins ? (
              <View>
                {Ins.categories && Ins.categories.length !== 0 ? (
                  <View style={styles.Experts}>
                    {Ins.categories.map((data, index) => {
                      return (
                        <Text
                          key={index}
                          bg={'primary.100'}
                          color={'#FFF'}
                          borderRadius={7}
                          fontSize={12}
                          pl={2}
                          pr={2}
                          pt={1}
                          pb={1}
                          m={1}>
                          {data}
                        </Text>
                      );
                    })}
                  </View>
                ) : (
                  <Text
                    color={'greyScale.800'}
                    fontSize={10}
                    pl={2}
                    pr={2}
                    pt={1}
                    pb={1}
                    m={1}>
                    "Yet to add expertise!"
                  </Text>
                )}
              </View>
            ) : (
              <Text
                color={'greyScale.800'}
                fontSize={10}
                pl={2}
                pr={2}
                pt={1}
                pb={1}
                m={1}>
                "Yet to add expertise!"
              </Text>
            )}
          </View>
          <View>
            <Text color={'#091B12'} fontSize={16} fontWeight={'bold'} mb={1}>
              About Instructor
            </Text>
            {Ins ? (
              <View>
                {Ins.aboutYou ? (
                  <Text color={'#000'} fontSize={12}>
                    {Ins.aboutYou}
                  </Text>
                ) : (
                  <Text
                    color={'greyScale.800'}
                    fontSize={10}
                    pl={2}
                    pr={2}
                    pt={1}
                    pb={1}
                    m={1}>
                    "Yet to add About!"
                  </Text>
                )}
              </View>
            ) : (
              <Text
                color={'greyScale.800'}
                fontSize={10}
                pl={2}
                pr={2}
                pt={1}
                pb={1}
                m={1}>
                "Yet to add About!"
              </Text>
            )}
          </View>

          <View>
            {ICourses ? <Text color={'#091B12'} fontSize={16} fontWeight={'bold'} mb={1}>Courses ({ICourses.totalCourses > 0 ? ICourses.totalCourses : '0'})</Text> : null }
            {ICourses ? (
              <VStack space={1}>
                {console.log(ICourses, 'is it this')}
                {ICourses.courseList.map((data, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const DD = {CDD: data, type: 'Instructor'};
                        dispatch(setSCData(DD));
                        navigation.navigate('ViewLiveCourse');
                      }}>
                      <CourseCard props={data} />
                    </TouchableOpacity>
                  );
                })}
              </VStack>
            ) : (
              <Text
                color={'greyScale.800'}
                fontSize={10}
                pl={2}
                pr={2}
                pt={1}
                pb={1}
                m={1}>
                "Yet to add Courses!"
              </Text>
            )}
          </View>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default InstructorProfile;

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
  Experts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
