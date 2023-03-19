//https://dev.qlearning.academy/testcode

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import WebView from 'react-native-webview'
const {height, width} = Dimensions.get('window')

const Demo = ({navigation, route}) => {
const onMessage = (data) => {
    alert(data.nativeEvent.data);
}
  return (
    <View style={styles.TopContainer}>
        <WebView
        style={{height:'100%', width:'100%', backgroundColor:"red"}} 
        source={{ uri: 'https://dev.qlearning.academy/testcode' }} 
        allowsInlineMediaPlayback={true} 
        mediaPlaybackRequiresUserAction={false}
        mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
        allowsProtectedMedia={true}
        allowsAirPlayForMediaPlayback={true}
        startInLoadingState
        onMessage={onMessage}
        scalesPageToFit
        javaScriptEnabled={true}
        userAgent={'Mozilla/5.0 (Linux; An33qdroid 10; Android SDK built for x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.185 Mobile Safari/537.36'}
        />
    </View>
  );
};

export default Demo;

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
