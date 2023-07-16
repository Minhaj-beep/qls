import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HStack, VStack, Image, Center, Text, useToast} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setBuyNowCourse } from '../../../Redux/Features/CourseSlice';
import { AddToCartAssessment } from '../../../Functions/API/AddToCartAssessment';

const {width, height} = Dimensions.get('window');

const AssessmentCard = ({props}) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const toast = useToast()
    const email = useSelector(state => state.Auth.Mail);

    //Add to cart
    const AddTC = async (code) => {
        try {
          let cart = await AddToCartAssessment(email, code);
          if (cart.status === 200) {
            toast.show({
              description: cart.message,
            });
          } else {
            toast.show({
              description: cart.message,
            });
            console.log(cart.message);
          }
        } catch (e) {
    
        }
    };

    return (
        <HStack style={styles.CourseCard} space={4} mt={2}>
            <Center>
                <Ionicons name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={30} />
            </Center>
            <VStack style={styles.CardContent} space={1}>
                <HStack justifyContent="space-between" alignItems="center" space={2}>
                    <Text noOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', color: '#000000', maxWidth: width * 0.75,}}>{props.assessmentTitle}</Text>
                </HStack>
                <HStack space={2} alignItems={'center'}>
                    <HStack space={1} alignItems={'center'}>
                        <Image alt="graduate icon" source={require('../../../../assets/Home/graduate_student.png')} size="3" />
                        <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>{props.learnersCount ? props.learnersCount : '0'} Learners</Text>
                    </HStack>
                </HStack>
                <HStack alignItems="center" justifyContent={'space-between'}>
                    <HStack space={2}>
                        <Text color={'greyScale.800'} style={{fontSize: 10, fontWeight: '600'}}>Fee</Text>
                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000000'}}>{props.currency}{props.fee}</Text>
                    </HStack>
                </HStack>
            </VStack>
            {
                props.isPurchased ? null :
                <VStack mr={3} alignItems={'center'}>
                    <Ionicons onPress={()=>AddTC(props.assessmentCode)} name="ios-cart-outline" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={25} />
                    <Text onPress={()=>{
                        dispatch(setBuyNowCourse(props))
                        navigation.navigate('BuyNow')
                    }} noOfLines={1} mt={1} style={{ fontSize: 14, paddingVertical:5, paddingHorizontal:8, backgroundColor: '#F0E1EB', fontWeight: 'bold', color: '#000000', maxWidth: width * 0.75,}}>Buy now</Text>
                </VStack>
            }
        </HStack>
    );
};
export default AssessmentCard;

const styles = StyleSheet.create({
  CourseCard: {
    // maxHeight: height / 8.5,
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
  CardContent: {
    minWidth: width / 1.7,
    maxWidth:width*0.58
  },
});
