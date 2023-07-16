import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, FlatList, } from 'react-native';
import React, {useState, useEffect} from 'react';
import { Text, VStack, HStack, Input, FormControl, Actionsheet, Box, useDisclose, Button, } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import AppBar from '../components/Navbar';
import {useSelector, useDispatch} from 'react-redux';
import Assessments from './Assessments/Assessments';
import Courses from './Courses/Courses';

const {width, height} = Dimensions.get('window');
  
const ViewCategories = ({navigation, route}) => {
    const data = route.params.data
    const email = useSelector(state => state.Auth.Mail);
    const [PCourses, setPCourses] = useState();
    const [selected, setSelected] = useState('Courses') // Button selection
    const dispatch = useDispatch();

    const AppBarContent = {
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1: 'notifications-outline',
        RightIcon2: 'person',
    };
  
    const changeSelected = (x) => {
        if (x === "Courses"){
            setSelected("Courses")
        } else {
            setSelected('Assessments')
        }
    }
  
    return (
        <View style={styles.container}>
            <AppBar props={AppBarContent} />

            {/* Buttons to get Courses or Assessments */}
            <View style={{width:"95%", marginTop:5, alignSelf:"center", backgroundColor:"grey", borderRadius:5, flexDirection:"row", justifyContent:"space-between", }}>
                <Button onPress={()=>changeSelected("Courses")} size="md" variant={selected === "Courses" ? "subtle" : "ghost" } _text={{color: '#FFF', fontSize: 14, fontWeight:"600" }} borderRadius={5} style={{width:"50%", }}>Courses</Button>
                <Button onPress={()=>changeSelected("Assessments")} size="md" variant={selected === "Courses" ? "ghost" : "subtle" } _text={{color: '#FFF', fontSize: 14, fontWeight:"600" }} borderRadius={5} style={{width:"50%", }}>Assessments</Button>
            </View>
            {selected === 'Courses' ? <Courses props={data} /> : <Assessments props={data} />}
            
        </View>
    );
};
  
export default ViewCategories;
  
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