import { Text, View, VStack, ScrollView } from "native-base"
import React, {useState, useEffect} from 'react'
import { Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import AppBar from "../components/Navbar"
import CourseCard from '../components/Courses/CourseCard';
import {GetPurchasedCourses} from '../Functions/API/GetPurchasedCourses';
import {useSelector, useDispatch} from 'react-redux';
import {setSCData} from '../Redux/Features/CourseSlice'
import { setLoading } from "../Redux/Features/authSlice";
const {width, height} = Dimensions.get('window')

const MyCourses = ({navigation}) => {

    const email = useSelector(state => state.Auth.Mail);
    const [PCourses, setPCourses] = useState();
    const dispatch = useDispatch();

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
          GetPC();
        });
        return unsubscribe;
      },[navigation]);
    
    const GetPC = async() => {
        dispatch(setLoading(true))
        try {
            let response = await GetPurchasedCourses(email);
            console.log(email)
            if (response.status === 200) {
                if (response.data.length !== 0) {
                    setPCourses(response.data);
                    console.log('this is da data: ' + response.data)
                    console.log('PC courses retrieved successfully');
                }
            } else {
                console.log(response)
                alert("GetPC error: " + response.message);
                console.log("GetPC error: 1" + response.message);
            }
        } catch (err) {
            console.log("GetPC error: 2" + err.message);
            alert('Error: ' + err.message);
        }
        dispatch(setLoading(false))
    };

    const AppBarContent = {
        title: 'My Courses',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1: 'notifications-outline',
        RightIcon2: 'person',
    };

    return (
        <View style={styles.container}>
            <AppBar props={AppBarContent} />
            <ScrollView contentContainerStyle={styles.TopContainer} nestedScrollEnabled={true}>
            {
                PCourses ?
                    <VStack space={2}>
                    {
                        PCourses.map((data, index)=> {
                            return (
                                <TouchableOpacity
                                onPress={()=>{
                                const DD = { CDD : data, type: 'Purchased'};
                                dispatch(setSCData(DD));
                                navigation.navigate('ViewLiveCourse');
                                }} key={index} >
                                {
                                    data.courseCode ?
                                    <CourseCard props={data}/>
                                    : <></>
                                }
                                </TouchableOpacity>
                            )
                        })
                    }
                    </VStack>
                : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'} mt={2}>No Courses to show {':('}</Text>
            }
            </ScrollView>
        </View>
    )
}

export default MyCourses
  
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
  