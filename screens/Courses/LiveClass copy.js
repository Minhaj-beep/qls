import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Button } from 'react-native';
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
  const webViewRef = useRef(null);

  const data = {
    type: 'MY_DATA_TYPE',
    payload: {
      name: 'John Doe',
      age: 30,
    },
  };

  const jsCode = `
  window.postMessage(${JSON.stringify(data)}, '*');
  `;

  const sendDataToWebPage = () => {
    const data = { name: 'John', age: 30 };
    const jsCode = `window.postMessage(${JSON.stringify(data)}, '*')`;
    webViewRef.current.injectJavaScript(jsCode);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        injectedJavaScript={jsCode}
        source={{ uri: 'http://192.168.28.152:3000' }}
      />
      <Button title="Send Data to Web Page" onPress={sendDataToWebPage} />
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
