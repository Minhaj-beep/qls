import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Text,
  VStack,
  HStack,
  Input,
  FormControl,
  Actionsheet,
  Box,
  useDisclose,
  Select,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import AppBar from '../components/Navbar';
import CourseCard from '../components/Courses/CourseCard';
import {GetPurchasedCourses} from '../Functions/API/GetPurchasedCourses';
import {useSelector, useDispatch} from 'react-redux';
import {setSCData} from '../Redux/Features/CourseSlice';

const {width, height} = Dimensions.get('window');

const Courses = ({navigation}) => {
  const email = useSelector(state => state.Auth.Mail);
  const [PCourses, setPCourses] = useState();
  const dispatch = useDispatch();
  const AppBarContent = {
    title: 'Courses',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      GetPC();
    });
    return unsubscribe;
  },[navigation]);

  const GetPC = async() => {
     try {
      let response = await GetPurchasedCourses(email);
      if (response.status === 200) {
        if (response.data.length !== 0) {
          setPCourses(response.data);
          console.log('this is da data: ' + response.data)
          console.log('PC courses retrieved successfully');
        }
      } else {
        alert("GetPC error: " + response.message);
        console.log("GetPC error: " + response.message);
      }
     } catch (err) {
      console.log("GetPC error: " + err.message);
      alert('Error: ' + err.message);
     }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <AppBar props={AppBarContent} />
      <ScrollView
        contentContainerStyle={styles.TopContainer}
        nestedScrollEnabled={true}>
        {
          PCourses ?
          <VStack space={2}>
            {
            PCourses.map((data, index)=> {
              return (
              <TouchableOpacity
              onPress={()=>{
                // console.log(data);
                const DD = { CDD : data, type: 'Purchased'};
                dispatch(setSCData(DD));
                navigation.navigate('SCView');
              }}
              key={index}
              >
                <CourseCard props={data}/>
              </TouchableOpacity>
              );
            })
              }
          </VStack>
          : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'} mt={2}>No Courses to show {':('}</Text>
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Courses;

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
    padding: 15,
  },
});
