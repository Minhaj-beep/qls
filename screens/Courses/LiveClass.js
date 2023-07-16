import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'native-base';
import io from 'socket.io-client';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import Peer from 'react-native-peerjs'
import {useDispatch,useSelector} from 'react-redux';
import AppBar from '../components/Navbar';
import WebView from 'react-native-webview'
const {height, width} = Dimensions.get('window')
import { CoursePurchaseCheck } from '../Functions/API/CoursePurchaseCheck';

const LiveClass = ({navigation, route}) => {
  const [authResponse, setAuthResponse] = useState(null);
  const webViewRef = useRef(null);
  const LiveClassData = route.params.LiveClassData
  const [url, setUrl] = useState(null)
  console.log('Live Class Data: ', LiveClassData)
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const email = useSelector(state => state.Auth.Mail);
  const CData = useSelector(state => state.Course.SCData);
  console.log(CData.CDD)
  const UserName = ProfileD.firstName + ' ' + ProfileD.lastName

  useEffect(()=>{
    checkAuth()
    if(LiveClassData.hasOwnProperty('joinLiveLink')) {
      var token = LiveClassData.joinLiveLink.split('?')
      // console.log('token: ', token)
      let s = LiveClassData.joinLiveLink.replace('undefined/', '')
      if(CData.CDD.isLive) {
        // Folowing code is for live course
        setUrl(`https://uat.qlearning.academy/live-room-app/${s}&email=${email}`)
        console.log(`App recorded token: https://uat.qlearning.academy/live-room-app/${s}&email=${email}`)
      } else {
        // Following code is for recorded live course
      setUrl(`https://uat.qlearning.academy/live-room-app/${LiveClassData.liveUUID}?${token[1]}&email=${email}&coursecode=${LiveClassData.liveUUID}`)
      console.log(`https://uat.qlearning.academy/live-room-app/${LiveClassData.liveUUID}?${token[1]}&email=${email}&coursecode=${LiveClassData.liveUUID}`)
      }
    } else {
      alert ('Instructor has not started the class yet. Kindly try again later!')
      navigation.goBack()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const result = await CoursePurchaseCheck(CData.CDD.courseCode, email)
      setAuthResponse(result)
      console.log('__________________RESULT', result)
    } catch (e) {
      console.log('__________EEEEEEEEE', e)
    }
  }

  const AppBarContent = {
    title: 'Live Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const data = {
    type: 'MY_DATA_TYPE',
    payload: authResponse
  };

  const jsCode = `
  window.postMessage(${JSON.stringify(data)}, '*');
  `;

  return (
    <View style={styles.TopContainer}>
      <AppBar props={AppBarContent}/>
      {
        url !== null && authResponse !== null ?
        <WebView
        ref={webViewRef}
        injectedJavaScript={jsCode}
        style={{height:'100%', width:'100%'}} 
        source={{ uri: url }} 
        allowsInlineMediaPlayback={true} 
        mediaPlaybackRequiresUserAction={false}
        mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
        allowsProtectedMedia={true}
        allowsAirPlayForMediaPlayback={true}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabled={true}
        userAgent={'Mozilla/5.0 (Linux; An33qdroid 10; Android SDK built for x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.185 Mobile Safari/537.36'}
        />
        : <></>
      }
    </View>
  );
};

export default LiveClass;

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
