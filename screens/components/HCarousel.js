import {StyleSheet, View, Text, Dimensions, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
// import Carousel from 'react-native-reanimated-carousel';
import {HStack, FlatList} from 'native-base';
import {setLoading} from '../Redux/Features/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {BaseURL} from '../StaticData/Variables';
import {
  setLiveCourses,
  setFeaturedCourses,
  setPopularCourses,
} from '../Redux/Features/CourseSlice';

import CourseCard from './CourseCard';
// import data from '../StaticData/data';

const {width, height} = Dimensions.get('window');

const HCarousel = ({props}) => {
  const dispatch = useDispatch();
  // console.log(props);

  const email = useSelector(state => state.Auth.Mail);
  // const LCourses = useSelector(state => state.Course.LiveCourses);
  // const PCourses = useSelector(state => state.Course.PopularCourses);
  // const FCourses = useSelector(state => state.Course.FeaturedCourses);
  const [LCourses, setLCourses] = useState();
  const [PCourses, setPCourses] = useState();
  const [FCourses, setFCourses] = useState();
  const [Data, setData] = useState();

  useEffect(() => {
    if (props === 'Popular Courses') {
      GetPopularCourses();
      setData(PCourses);
    } else if (props === 'Featured Courses') {
      GetFeaturedCourses();
      setData(FCourses);
    } else {
      GetLiveCourses();
      setData(LCourses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetLiveCourses = async () => {
    if (email === '') {
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
          token: email,
        },
      };
      await fetch(BaseURL + 'getAllLiveCourse', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            // console.log(result.data);
            dispatch(setLiveCourses(result.data));
            setLCourses(result.data);
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  const GetPopularCourses = async () => {
    if (email === '') {
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
          token: email,
        },
      };
      await fetch(BaseURL + 'searchCourse?popularCourse=true', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            // console.log(result.data);
            dispatch(setPopularCourses(result.data));
            setPCourses(result.data);
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  const GetFeaturedCourses = async () => {
    if (email === '') {
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
          token: email,
        },
      };
      await fetch(BaseURL + 'searchCourse?newCourse=true', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            // console.log(result.data);
            dispatch(setFeaturedCourses(result.data));
            setFCourses(result.data);
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  // console.log(props);
  return (
    <View>
      <View>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          ml={4}
          mr={4}>
          <Text style={{color: '#000000', fontSize: 16, fontWeight: 'bold'}}>
            {props}
          </Text>
          <Text style={{color: '#395061', fontSize: 12, fontWeight: 'bold'}}>
            See All
          </Text>
        </HStack>
        {Data && (
          <FlatList
            renderItem={CourseCard}
            data={Data}
            width={width}
            height={width / 1.5}
            horizontal={true}
            keyExtractor={(item, index) => index}
            initialNumToRender={3}
          />
        )}
      </View>
    </View>
  );
};

export default HCarousel;
