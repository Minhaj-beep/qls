import {View, Dimensions, ScrollView, ActivityIndicator, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
import {useState,useEffect,React, useCallback, useRef} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import WebView from 'react-native-webview';


const { width, height } = Dimensions.get('window')

const JoinDemoClass = ({navigation}) => {
  const [endClass, setEndClass] = useState(null)
  const JoinDemoClassData = useSelector(state => state.Course.JoinDemoClassData);
  console.log(JoinDemoClassData, 'JoinDemoClassData')
  // console.log(JoinDemoClassData.studentLink.split('?'), 'data')
  const newToken = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3Vyc2VDb2RlIjoiMzk1MjJlMDAtMDJjOC00NTU4LThjMDYtNjc2MjRjNjRhYTdlIiwic3R1ZGVudEVtYWlsIjpudWxsLCJzdHVkZW50TmFtZSI6bnVsbCwiZGVtb0RhdGUiOiIyMDIzLTA0LTA2VDAwOjAwOjAwLjAwMFoiLCJkZW1vVGltZSI6IjEyOjMxIiwiZGVtb0NvZGUiOiI2NDJlNmRmZTVjNzdkOWZmODc4NTJiOGQiLCJ0b3BpY05hbWUiOiJUZXh0IG9uIDIwLzAyLzIzIiwidXNlclR5cGUiOiJTVFVERU5UIiwiaWF0IjoxNjgwNzY2MzAwfQ.ROrTgCNuKarFqeaMdCQA8uiWaquPE3OkJztWUoa_5jQ'
  const [url, setUrl] = useState(null)

  const appToken = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3Vyc2VDb2RlIjoiMzk1MjJlMDAtMDJjOC00NTU4LThjMDYtNjc2MjRjNjRhYTdlIiwiaW5zdHJ1Y3RvckVtYWlsIjoiamlib3JhbTMwOUBuZXZ5eHVzLmNvbSIsImluc3RydWN0b3JJZCI6IjYzYzhkYzEwMjQ3Zjk2ZGJhOTAyMzc5ZCIsImluc3RydWN0b3JOYW1lIjoiSmlibyAgUmFtIiwiZGVtb0RhdGUiOiIyMDIzLTA0LTA2VDAwOjAwOjAwLjAwMFoiLCJkZW1vVGltZSI6IjEyOjMxIiwiZGVtb0NvZGUiOiI2NDJlNmRmZTVjNzdkOWZmODc4NTJiOGQiLCJ0b3BpY05hbWUiOiJUZXh0IG9uIDIwLzAyLzIzIiwidXNlclR5cGUiOiJJTlNUUlVDVE9SIiwiaWF0IjoxNjgwNzY2MjgxfQ.0NAZDVDIV5FGGSRD0kfrwTDQ0PGYp2mr3S1hP_kPg2Y'
  if(appToken === newToken){
    console.log('Mathed !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  }

  useEffect(()=>{
    if(endClass !== null){
      navigation.navigate('DemoClass')
    }
  },[endClass])

  useEffect(()=>{
    var token = JoinDemoClassData.studentLink.length > 0 ? JoinDemoClassData.studentLink.split('?') : null
    if(token !== null){
      var id = JoinDemoClassData._id
      setUrl(`https://uat.qlearning.academy/demo-class-room-app/${JoinDemoClassData.demoCode}?${token[1]}`)
      console.log(id, 'and ', token[1], 'and the entire link ', JoinDemoClassData.studentLink)
      console.log(`{
          https://uat.qlearning.academy/demo-class-room-app/${JoinDemoClassData.demoCode}?${token[1]}
      }`)
    }
  }, [])

  const AppBarContent = {
    title: 'Demo Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const onMessage = (data) => {
    setEndClass(data.nativeEvent.data);
  }

  return (
    <View style={styles.TopContainer}>
          <AppBar props={AppBarContent}/>
          {
            url !== null ?
                <WebView 
                  style={{height:'100%', width:'100%', backgroundColor:"red"}} 
                  source={{ uri: url }} 
                  allowsInlineMediaPlayback={true} 
                  mediaPlaybackRequiresUserAction={false}
                  mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
                  allowsProtectedMedia={true}
                  allowsAirPlayForMediaPlayback={true}
                  startInLoadingState
                  scalesPageToFit
                  onMessage={onMessage}
                  javaScriptEnabled={true}
                  userAgent={'Mozilla/5.0 (Linux; An33qdroid 10; Android SDK built for x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.185 Mobile Safari/537.36'}
                />
            : null
          }
    </View>
  )
}

export default JoinDemoClass

const styles = StyleSheet.create({
  TopContainer:{
    flex: 1,
    top: 0,
    backgroundColor:'#fCfCfC',
    height:height,
    width:width,
},
CameraBorder:{
  width:width/1.1,
  height:height/2.5,
},
MicOn:{
  color:'#395061',
  backgroundColor:'#fCfCfC',
  borderRadius:50
},
video:{
  color:'#395061',
  backgroundColor:'#fCfCfC',
  borderRadius:50
}
})