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
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CourseCard from '../components/Courses/RCCard';
import {setSCData} from '../Redux/Features/CourseSlice';

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
        console.log(Instructor);
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
    <SafeAreaView style={styles.container}>
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

          <HStack space={2}>
            <VStack alignItems={'center'} space={1}>
              <HStack alignItems={'center'} space={2}>
                <Image
                  source={require('../../assets/graduate.png')}
                  alt="courses"
                  size={4}
                />
                <Text color={'#091B12'} fontSize={14} fontWeight={'bold'}>
                  {ICourses ? ICourses[0].learners.length : '0'} Learners
                </Text>
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
                <Text color={'#091B12'} fontSize={14} fontWeight={'bold'}>
                  {ICourses ? ICourses[0].totalCourses : '0'} Courses
                </Text>
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
              {Ins.facebook ? (
                <TouchableOpacity onPress={() => OpenLink(Ins.facebook)}>
                  <Image
                    source={require('../../assets/Social/facebook.png')}
                    alt="facebook"
                    size={9}
                  />
                </TouchableOpacity>
              ) : null}
              {Ins.instagram ? (
                <TouchableOpacity onPress={() => OpenLink(Ins.instagram)}>
                  <Image
                    source={require('../../assets/Social/instagram.png')}
                    alt="facebook"
                    size={9}
                  />
                </TouchableOpacity>
              ) : null}
              {Ins.linkedin ? (
                <TouchableOpacity onPress={() => OpenLink(Ins.linkedin)}>
                  <Image
                    source={require('../../assets/Social/linkedin.png')}
                    alt="facebook"
                    size={9}
                  />
                </TouchableOpacity>
              ) : null}
              {Ins.twitter ? (
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
              About
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
            <Text color={'#091B12'} fontSize={16} fontWeight={'bold'} mb={1}>
              Courses
            </Text>
            {ICourses ? (
              <VStack space={1}>
                {console.log(ICourses)}
                {ICourses.map((data, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const DD = {CDD: data, type: 'Instructor'};
                        dispatch(setSCData(DD));
                        navigation.navigate('SCView');
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
    </SafeAreaView>
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
