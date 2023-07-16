import { View, Text, Input, Center, Icon, ScrollView, HStack, VStack } from "native-base"
import React from "react"
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from "react-redux";
import { setViewIndependentAssessmentCode } from "../../Redux/Features/CourseSlice";
import { setIsRetryIndependentAssessment } from "../../Redux/Features/CourseSlice";
const {height, width} = Dimensions.get('window')

const Completed = ({props}) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    
    const viewAssessment = (code, percentage) => {
        if(percentage < 100) {
            dispatch(setIsRetryIndependentAssessment(true))
            dispatch(setViewIndependentAssessmentCode(code))
            navigation.navigate('ViewAssessment')
        } else {
            dispatch(setViewIndependentAssessmentCode(code))
            navigation.navigate('ViewAssessment')
        }
    }

    const renderAssessmentCard = () => {
        return (
            props.map((data, index) => {
                const currency = data.currency === 'INR' ? '₹' : '$';
                return (
                    <TouchableOpacity key={index}>
                        <HStack style={styles.CourseCard} space={4} mt={2}>
                            <Center>
                                <Ionicons name="md-checkmark-sharp" color="#FFF" style={{ backgroundColor: '#29D363', padding: 5, borderRadius: 20,}} size={30} />
                            </Center>
                            <VStack style={styles.CardContent} space={1}>
                                <HStack maxWidth={width*0.5} alignItems="center" space={2}>
                                    <Text noOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', color: '#395061'}}>{data.assessmentTitle}</Text>
                                    {
                                        data.assessmentPercentage < 80 ?
                                        <Text noOfLines={2} style={{ fontSize: 9, backgroundColor:"#F65656", paddingHorizontal:5, borderRadius:10, color: '#ffffff'}}>Failed</Text>
                                        :
                                        <Text noOfLines={2} style={{ fontSize: 9, backgroundColor:"#29D363", paddingHorizontal:5, borderRadius:10, color: '#ffffff'}}>Passed</Text>
                                    }
                                </HStack>
                                <HStack maxWidth={width*0.5} space={2} alignItems={'center'}>
                                    <HStack space={1} alignItems={'center'}>
                                        <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>By :</Text>
                                        <Text style={{fontSize: 11, fontWeight: '600'}} color={'#395061'}>{data.instructorName}</Text>
                                        <Text ml={3} style={{fontSize: 11, fontWeight: '600'}} color={'greyScale.800'}>Received Grade</Text>
                                        <Text style={{fontSize: 11, fontWeight: '600'}} color={'#395061'}>{parseInt(data.assessmentPercentage) === data.assessmentPercentage ? data.assessmentPercentage : data.assessmentPercentage.toFixed(2)}%</Text>
                                    </HStack>
                                </HStack>
                            </VStack>
                            <VStack mr={0} justifyContent={"center"} alignItems={'center'}>
                                {
                                    data.assessmentPercentage < 80 ?
                                    <Text onPress={()=>{viewAssessment(data.assessmentCode, data.assessmentPercentage)}} noOfLines={1} mt={1} style={{ fontSize: 12, padding:2, fontWeight: 'bold', color: '#395061', maxWidth: width * 0.75,}}>Retry</Text>
                                    :
                                    <Text onPress={()=>{viewAssessment(data.assessmentCode, data.assessmentPercentage)}} noOfLines={1} mt={1} style={{ fontSize: 12, padding:2, fontWeight: 'bold', color: '#395061', maxWidth: width * 0.75,}}>View</Text>
                                }
                            </VStack>
                        </HStack>
                    </TouchableOpacity>
                )
            })
        )
    }

    return (
        <ScrollView>
            {renderAssessmentCard()}
        </ScrollView>
    )
}

export default Completed

const styles = StyleSheet.create({
    CourseCard: {
      maxHeight: height / 8.5,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      shadowColor: 'rgba(0, 0, 0, 0.03)',
      shadowOffset: {
        width: 0,
        height: 0.376085489988327,
      },
      shadowRadius: 22,
      shadowOpacity: 1,
      padding: 10,
    },
    cardImg: {
      height: height / 11,
      width: width / 3.2,
      borderRadius: 5,
    },
    CardContent: {
      minWidth: width / 1.6,
      maxWidth:width*0.58
    },
});