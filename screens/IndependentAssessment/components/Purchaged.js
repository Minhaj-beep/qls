import { View, Text, Input, Center, Icon, ScrollView, HStack, VStack } from "native-base"
import React from "react"
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from "react-redux";
import { setViewIndependentAssessmentCode } from "../../Redux/Features/CourseSlice";
const {height, width} = Dimensions.get('window')

const Purchaged = ({props}) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    
    const viewAssessment = (code) => {
        dispatch(setViewIndependentAssessmentCode(code))
        navigation.navigate('ViewAssessment')
    }

    const renderAssessmentCard = () => {
        return (
            props.map((data, index) => {
                const currency = data.currency === 'INR' ? '₹' : '$';
                return (
                    <TouchableOpacity onPress={()=>{viewAssessment(data.assessmentCode)}} key={index}>
                        <HStack alignItems={'center'} style={styles.CourseCard} space={4} mt={2}>
                            <Center>
                                <Ionicons name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={30} />
                            </Center>
                            <VStack style={styles.CardContent} space={1}>
                                <HStack justifyContent="space-between" alignItems="center" space={2}>
                                    <Text noOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', color: '#000000', maxWidth: width * 0.5,}}>{data.assessmentTitle}</Text>
                                </HStack>
                                <HStack space={2} alignItems={'center'}>
                                    <HStack space={1} alignItems={'center'}>
                                        <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>By :</Text>
                                        <Text style={{fontSize: 11, fontWeight: '600'}} color={'greyScale.800'}>{data.instructorName}</Text>
                                    </HStack>
                                </HStack>
                            </VStack>
                            <VStack mr={3} flex={1} alignItems={'center'}>
                                <Text alignSelf={'flex-end'} noOfLines={1} mt={1} style={{ fontSize: 12, padding:0, fontWeight: 'bold', color: '#395061', maxWidth: width * 0.75,}}>Attend Now</Text>
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

export default Purchaged

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
    //   minWidth: width / 1.7,
      width:width*0.52,
    },
});