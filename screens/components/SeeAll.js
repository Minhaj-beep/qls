import { Text, View, VStack, ScrollView, FlatList, Image, HStack } from "native-base"
import React, {useState, useEffect} from 'react'
import { Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import AppBar from "./Navbar"
const {width, height} = Dimensions.get('window')
import {useDispatch, useSelector} from 'react-redux'
import { setSCData } from "../Redux/Features/CourseSlice";
import { AirbnbRating } from "react-native-ratings";

const SeeAll = ({navigation, route}) => {
    const data = route.params.data
    const name = route.params.name
    const dispatch = useDispatch();

    const AppBarContent = {
        title: name,
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1: 'notifications-outline',
        RightIcon2: 'person',
    };

    const RenderC = ({item}) => {
        const currency = item.currency === 'INR' ? '₹' : '$';
        return (
            <TouchableOpacity onPress={()=> {
                const DD = { CDD : item, type: item.isLive}
                dispatch(setSCData(DD))
                navigation.navigate('ViewLiveCourse')
            }}>
                <HStack alignItems={'center'} space={2} height={width*0.3} shadow={1} bg={'#FFFFFF'} borderRadius={10} mb={2} p={2}>
                    <Image borderRadius={10} alt={item.courseCode} width={width*0.35} height={width*0.23} source={{uri: item.thumbNailImagePath}} />
                    <VStack>
                        <Text noOfLines={2} maxWidth={width*0.53} style={{fontSize:12, fontWeight:"600"}}>{item.courseName}</Text>
                        <HStack>
                            <Text style={{color: '#8C8C8C', fontSize: 12}}>by </Text>
                            <Text style={{color: '#395061', fontSize: 12}}>{item.instructorName}</Text>
                        </HStack>
                        <HStack mt={1} space={1} alignItems='center'>
                            <HStack alignItems='center'>
                                <HStack space={1}>
                                <AirbnbRating
                                    count={5}
                                    isDisabled={true}
                                    showRating={false}
                                    defaultRating={`${item.rating}`}
                                    size={10}
                                    value={`${item.rating}`}
                                />
                                </HStack>
                                {item.hasOwnProperty('rating') ?
                                    <Text style={{fontSize: 11}}>{item.rating === parseInt(item.rating) ? item.rating : item.rating.toFixed(1)} ({item.ratingCount})</Text>
                                    : null
                                }
                            </HStack>
                            <HStack space={1} ml={1} alignItems='center'>
                                <Image alt="graduate icon" source={require('../../assets/Home/graduate_student.png')} size="3"/>
                                <Text style={{fontSize: 11}}>{item.learnersCount} Learners</Text>
                            </HStack>
                        </HStack>
                        <HStack mt={2} width={width*0.53} alignItems={'center'} style={{justifyContent:"space-between"}}>
                            <Text style={{fontSize: 15, color: '#000000', fontWeight: 'bold'}}>
                                {currency}{item.fee}
                            </Text>
                            {item.isLive
                                ?
                                <Text pr={2} pl={2} borderRadius={20} style={{fontSize:10, paddingHorizontal:5, paddingVertical:1, borderRadius:10,marginBottom:2, backgroundColor:'#F65656', color:'#FFF'}}>Live Courses</Text>
                                :
                                <></>
                            }
                        </HStack>
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    }

    const ITEM_HEIGHT = width*0.23

    return (
        <View  style={styles.container}>
            <AppBar props={AppBarContent} />
            {
                Object.keys(data).length > 0 ?
                <FlatList 
                    renderItem={RenderC}
                    data={data}
                    keyExtractor={(data, index) => index}
                    getItemLayout={(data, index) => (
                        {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
                    )}
                />
                : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'} mt={2}>Loading ...</Text>
            }
        </View>
    )
}

export default SeeAll

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F1F1',
        height: height,
        width: width*0.95,
        alignSelf:"center",
        flex: 1,
    },
    TopContainer: {
        flexGrow: 1,
        paddingBottom: 70,
        padding: 15,
    },
});