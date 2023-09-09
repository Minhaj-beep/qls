import { StyleSheet, View,TouchableOpacity,SafeAreaView,ScrollView,Dimensions } from 'react-native';
import React, {useEffect,useState} from 'react';
import { HStack, Container, VStack,Text } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../components/Navbar';
import {useSelector, useDispatch} from 'react-redux';
import {setAttendAssessment} from '../Redux/Features/CourseSlice';
import {AssessmentDD} from '../StaticData/data';

const {width, height} = Dimensions.get('window');

const AssessmentList = ({navigation}) => {
  const dispatch = useDispatch();
  const AppBarContent = {
    title: 'Assessment List',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person',
  };
  const AssessmentData = useSelector(state => state.Course.AssessmentData);
  const AssessmentD = [AssessmentDD, AssessmentDD, AssessmentDD];

  useEffect(()=>{

    console.log(AssessmentData);
  },[AssessmentData]);

    const RenderCard = (data) => {
      let DD = data.props;
        return (
            <TouchableOpacity
            style={styles.card}
            onPress={()=> {
                dispatch(setAttendAssessment(DD));
                navigation.navigate('Assessments');
            }}>
            <HStack alignItems="center" space={3}>
                <Container bg="#F0E1EB" p={2} borderRadius={50}>
                  <Icon size={20} name="clipboard-outline" color="primary.100" />
                </Container>
                  <VStack>
                    <HStack justifyContent={'space-between'} alignItems={'center'} width={width / 1.5}>
                      <VStack>
                        <Text style={{fontWeight:'bold',maxWidth:240,fontSize: 13}} color={'primary.100'}>Assessment 01</Text>
                        <Text style={{maxWidth:300,fontSize: 10}} color={'greyScale.800'}> Python  {'>'}  Scripting</Text>
                      </VStack>
                      <Text fontSize={9} color={'primary.100'} fontWeight={'bold'}>Attend Now</Text>
                    </HStack>
                  </VStack>
            </HStack>
        </TouchableOpacity>
        );
    };
  return (
    <View>
      <Navbar props={AppBarContent} />
      <ScrollView style={styles.container}>
      {
        AssessmentD ?
        <VStack>
          {
            AssessmentD.map((data, index) =>{
              return <RenderCard props={data} key={index}/>;
            })
          }
        </VStack>
        : null
      }
    </ScrollView>
   </View>
  );
};

export default AssessmentList;

const styles = StyleSheet.create({
  container:{
    padding:20,
    height:height,
    marginBottom:70,
  },
  card:{
    borderRadius: 5,
    backgroundColor: "#F8F8F8",
    padding:12,
    marginTop:10,
},
});
