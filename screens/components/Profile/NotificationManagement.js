import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import React, {useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {VStack,Text,HStack,Icon} from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import AppBar from '../Navbar';
import { setLoading } from '../../Redux/Features/authSlice';
import {useDispatch,useSelector} from 'react-redux';
import { BaseURL } from '../../StaticData/Variables';

const { width, height } = Dimensions.get('window')

const NotificationsManagement = ({navigation}) => {

  const [NE0001, setNE0001] = useState(false);
  const [NE0002, setNE0002] = useState(false);
  const [NE0003, setNE0003] = useState(false);

  const [NP0001, setNP0001] = useState(false);
  const [NP0002, setNP0002] = useState(false);
  const [NP0003, setNP0003] = useState(false);

  const [NMData, setNMData] = useState();
  const email = useSelector(state => state.Auth.Mail);
  console.log(email)

  const dispatch = useDispatch()

  useEffect(()=>{
    GetNData()
  },[])


  const AppBarContent = {
    title: 'Notifications',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const GetNData = () =>{
    dispatch(setLoading(true))
    const API = BaseURL+'v1/notifications/getNotificationMainData'
    // const API = 'https://api-uat.qlearning.academy/v1/notifications/getNotifications'
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
        let DD = result.data;
        if(DD.length != 0){
          let re = result.data[0];
        let res = re.notificationMainList;
        setNMData(res);
        console.log(res);
        SetCheckOp(res)
        }
        
        dispatch(setLoading(false))
      }else if(result.status > 200){
        dispatch(setLoading(false))
        alert('Error: ' + result.message);
        console.log(result.message);
      }
    }).catch(error =>{
      dispatch(setLoading(false))
      console.log(error)
      alert('Error: ' + error);
    })
  }

  const SetCheckOp = (data) =>{
    data.map((data,index)=>{
      if(data.notificationType ==='EMAIL'){
        if(data.notificationCode === NE0001){
          if(data.isNotify === true){
            setNE0001(true)
          }else{
            setNE0001(false)
          }
        }else if(data.notificationCode === NE0002){
          if(data.isNotify === true){
            setNE0002(true)
          }else{
            setNE0002(false)
          }
        }else{
          if(data.isNotify === true){
            setNE0003(true)
          }else{
            setNE0003(false)
          }
        }
      }else{
        // Filter PUSH and set
        if(data.notificationCode === NP0001){
          if(data.isNotify === true){
            setNP0001(true)
          }else{
            setNP0001(false)
          }
        }else if(data.notificationCode === NP0002){
          if(data.isNotify === true){
            setNP0002(true)
          }else{
            setNP0002(false)
          }
        }else{
          if(data.isNotify === true){
            setNP0003(true)
          }else{
            setNP0003(false)
          }
        }
        //end
      }
    })
  }

  const UpdateCheckOp = (data) =>{
    dispatch(setLoading(true))
    const API = BaseURL+'v1/notifications/updateNotificationMainData'
    console.log('Updating')
    // const API = 'https://api-uat.qlearning.academy/v1/notifications/getNotifications'
    
    let Notify = !data.isNotify
    let NCode = data.notificationCode

    var requestOptions = {
      method:'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'STUDENT',
        'token':email
      },
      body:JSON.stringify({
        isNotify:Notify,
        notificationCode:NCode
      })
    }
    // console.log()
    fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.status === 200)
      {
        GetNData()
        alert(result.message)
        dispatch(setLoading(false))
      }else if(result.status > 200){
        dispatch(setLoading(false))
        alert('Error: ' + result.message);
        console.log(result.message);
      }
    }).catch(error =>{
      dispatch(setLoading(false))
      console.log(error)
      alert('Error: ' + error);
    })
}

const NMCheckEmail = () => {
    return NMData.map((data, index) => {
        let CCheck = 'NE000'+(index+1)
        return (
        <View  key={index}>
          {data.notificationType === "EMAIL" ?
          <HStack space={2} maxWidth='300' mt={3}>
              {console.log(data.isNotify)}
              <CheckBox
                style={{bottom:3}}
                tintColors={{ true: '#395061' , false: '#d4d4d4' }}
                value={data.isNotify}
                // defaultValue={data.isNotify}
                onValueChange={()=> UpdateCheckOp(data)}
                onCheckColor={ '#395061'}
                />
              <Text style={styles.para}>{data.content}</Text>
            </HStack> : null}
        </View>
    )
})
}

const NMCheckPush = () => {
    return NMData.map((data, index) => {
        let CCheck = 'NP000'+(index+1)
        let NCode = data.notificationCode
        return (
            <View  key={index}>
        {/* <View  > */}
          {data.notificationType === "PUSH" ?
          <HStack space={2} maxWidth='300' mt={3}>
            {console.log(data.isNotify)}
              <CheckBox
                style={{bottom:3}}
                tintColors={{ true: '#395061' , false: '#d4d4d4' }}
                value={data.isNotify}
                onValueChange={()=> UpdateCheckOp(data)}
                onCheckColor={'#395061'}
                onTintColor={'#395061'}
              />
              <Text style={styles.para}>{data.content}</Text>
            </HStack> : null}
        </View>
    )
    })
  }

  return (
    <SafeAreaView>
      <AppBar props={AppBarContent}/>
      <ScrollView>
        <VStack style={styles.container} pt={5} space={3}>
          <Text style={{color:'#395061', fontSize:16, fontWeight:'bold'}} pb={3}>Email Notifications</Text>
          { NMData ? <NMCheckEmail/>: null}
        </VStack>

        <VStack style={styles.container} pt={1} space={3}>
          <Text style={{color:'#395061', fontSize:16, fontWeight:'bold'}} pb={3}>App Push Notifications</Text>
          {NMData ? <NMCheckPush/> : null}
        </VStack>

      </ScrollView>
    </SafeAreaView>
  )
}

export default NotificationsManagement

const styles = StyleSheet.create({
  container:{
    margin:25
  },
  para:{
    fontSize:15,
    color:'#395061'
  }
})