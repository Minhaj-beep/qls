import { View, Text, Input, Icon, ScrollView, FlatList, VStack } from "native-base"
import { TouchableOpacity } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GetCoursesByCategoryCode } from "../../Functions/API/GetCoursesByCategoryCode";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import RcCard from "../../components/Courses/RCCard";
import { setSCData } from "../../Redux/Features/CourseSlice";
import { useNavigation } from "@react-navigation/native";
import { GetIndependentAssessmentsByCategoryCode } from "../../Functions/API/GetIndependentAssessmentsByCategoryCode";
import AssessmentCard from "./components/AssessmentCard";

export default Assessments = ({props}) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const JWT = useSelector(state => state.Auth.JWT);
    const email = useSelector(state => state.Auth.Mail);
    const GUser = useSelector(state => state.Auth.GUser);
    const [allItems, setAllItems] = useState([])
    // console.log(props)

    useEffect(()=> {
        getIndependentAssessmentsByCategoryCode()
    },[])

    const getIndependentAssessmentsByCategoryCode = async () => {
        let arr = []
        try {
            const result = await GetIndependentAssessmentsByCategoryCode(GUser, email, JWT, props.categoryCode)
            if(result.status === 200) {
                if(Object.keys(result.data).length > 0) {
                    result.data.map(i => {
                        if(i.assessmentStatus === "ACTIVE") {
                            arr = [...arr, i]
                        }
                    })
                }
                console.log('Found data: ', arr)
                setAllItems(arr)
            } else {
                console.log('getIndependentAssessmentsByCategoryCode error 1: ', result)
            }
        } catch (e) {
            // getCoursesByCategoryCode()
            console.log('getIndependentAssessmentsByCategoryCode error 2', e)
        }
    }

    const renderCard = ({item}) => {
        return (
            <TouchableOpacity key={item._id}>
                <AssessmentCard props={item} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={{flex:1, width:"95%", alignSelf:"center"}}>
            {
                Object.keys(allItems).length > 0 ?
                    <FlatList
                        data={allItems}
                        renderItem={renderCard}
                        keyExtractor={item => item._id}
                    />
                : <Text mt={5} style={{fontSize:13, alignSelf:"center", borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>No Assessment found!</Text>
            }
        </View>
    )
}