/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {HStack, VStack, Text, Image, IconButton, useToast} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {BaseURL} from '../../StaticData/Variables';
import {setLoading} from '../../Redux/Features/authSlice';
import {setSCData, setSearchA,setSearchData} from '../../Redux/Features/CourseSlice';
import CourseCard from '../CourseCard';

const {width, height} = Dimensions.get('window');

const RenderCarousel = items => {
  const Data = items.data;
  // console.log(items.data)
  // items.data.map((i)=>console.log(i.isLive))
  // console.log(items.type)
  const navigation = items.nav;
  const toast = useToast();
  const title = items.title;
  const email = useSelector(state => state.Auth.Mail);
  const dispatch = useDispatch();
  // console.log(Data[0]);

  const RenderC = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(items.type);
          const DD = { CDD : item, type: items.type};
          dispatch(setSCData(DD));
          // if (items.type === 'Live') {
            navigation.navigate('ViewLiveCourse');
          // } else {
          //   navigation.navigate('LiveSCView');
          // }
        }}
        key={index}>
        <CourseCard props={item}/>
      </TouchableOpacity>
    );
  };

  return (
    <View >
      <HStack justifyContent="space-between" alignItems="center" mb={3} ml={4} mr={4}>
        <Text style={{color: '#000000', fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
        <TouchableOpacity onPress={() => {
          dispatch(setSearchA(true));
          dispatch(setSearchData(Data));
          // navigation.navigate('Tabs', {screen: 'SearchTab'});
          navigation.navigate('SeeAll', {data:Data, name:title})
        }}>
          <Text style={{ color: '#395061', fontSize: 12, fontWeight: 'bold',}}>See All</Text>
        </TouchableOpacity>
      </HStack>
      <FlatList
        style={{marginBottom:20}}
        renderItem={RenderC}
        data={Data}
        width={width}
        // height={width / 1.5}
        horizontal={true}
        keyExtractor={(Data, index) => index}
        initialNumToRender={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default RenderCarousel;

const styles = StyleSheet.create({
  coursecard: {
    width: width / 1.7,
    height: height / 3.3,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 0.376085489988327,
    },
    shadowRadius: 21.951963424682617,
    shadowOpacity: 1,
    overflow: 'hidden',
    marginLeft: 15,
  },
  courseimg: {
    width: width / 1.85,
    height: height / 7,
    borderRadius: 10,
    backgroundColor: '#C4C4C4',
    alignSelf: 'center',
  },
  courseheading: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#000000',
  },
});
