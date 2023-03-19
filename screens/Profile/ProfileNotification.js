//ProfileNotification
import { StyleSheet, View,Dimensions,ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {VStack,Text,HStack,Icon} from 'native-base';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { setLoading } from '../Redux/Features/authSlice';
// import {setNCount} from '../Redux/Features/loginSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
import { BaseURL } from '../StaticData/Variables';
import { setNotificationCount } from '../Redux/Features/authSlice';
import { MarkAllAsRead } from '../Functions/API/MarkAllAsSeen';
// import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window')

const ProfileNotification = ({navigation}) => {
  
  const dispatch = useDispatch();

  const email = useSelector(state => state.Auth.Mail);
//   console.log('Email : ',email)
//   console.log(BaseURL)
  const [NData, setNData] = useState();
  
  const AppBarContent = {
    title: 'Notification',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  useEffect(()=>{
    GetNotification()
  },[])

  const markAllAsRead = async (id) => {
    try {
      let response = await MarkAllAsRead(email, id);
      if (response.status === 200) {
        console.log('Success')
        dispatch(setNotificationCount(null))
      }
    } catch (e) {
      console.log(`Maked all read didn't worked out`)
    }
  }

  const GetNotification = () =>{
    dispatch(setLoading(true))
    const API = BaseURL+'/v1/notifications/getNotifications'
    var requestOptions = {
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'STUDENT',
        'token':email
      }
    }
    // console.log()
    fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.status === 200)
      {
        // console.log(result.data.result.notificationList)
        // console.log('Heloooooooooo ....')
        markAllAsRead(result.data.result.userId)
        let re = result.data;
        let res = re.result
        setNData(res.notificationList)
        dispatch(setLoading(false))
        // console.log(NData)
      }else if(result.status > 200){
        dispatch(setLoading(false))
        // alert('Error1: ' + result.message);
        console.log(result.message);
      }
    }).catch(error =>{
      dispatch(setLoading(false))
      console.log(error)
      // alert('Error2: ' + error);
    })
  }

  const Render = () =>{
    return NData.map((data, index)=>{
      const TimeD = moment(data.notificationDate).format('DD MMM, YYYY hh:mm a')
      return(
        <View key={index} style={{marginTop:10, flex:1}}>
          <HStack style={styles.card} space={3} maxWidth={width/0.5}>
            <View>
              <View style={{backgroundColor:data.isRead ? "#f9f2f6" : "#F0E1EB", padding:10, borderRadius:10}}>
                <Icon color= {data.isRead ? "#a6a6a6" : "grey"} as={<MaterialIcons name="notifications-active"/>} size={7}/>
              </View>
            </View>
            <VStack style={{maxWidth:width/1.2}} justifyContent="center">
                <Text style={{color:data.isRead ? "#c3cacf" : "#395061", fontWeight:'bold', fontSize:16, maxWidth:width/1.5}}>{data.subject}</Text>
                {/* <Text style={{color:"#395061", fontSize:13,maxWidth:width/1.45}}>{data.content}</Text> */}
                {/* <Text style={{color:"#8C8C8C", fontSize:11}}>22 February, 2022</Text> */}
                <Text style={{color:data.isRead ? "#979797" : "#8C8C8C", fontSize:10}}>{TimeD}</Text>
            </VStack>
          </HStack>
        </View>
      )
    })
  }
  return (
    <View style={{flex:1}}>
      <AppBar props={AppBarContent}/>
      <ScrollView nestedScrollEnabled={true} >
      <VStack space={3} style={styles.Container}>
      {NData && <Render/>}
      </VStack>
      </ScrollView>
    </View>
  )
}

export default ProfileNotification

const styles = StyleSheet.create({
  Container:{
   margin:15,
   flex:1
  },
  card:{
    backgroundColor:"#F8F8F8",
    padding:10,
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.38
    },
    borderRadius:6,
  }
})