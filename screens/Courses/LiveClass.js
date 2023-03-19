import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'native-base';
import io from 'socket.io-client';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import Peer from 'react-native-peerjs'
import {useDispatch,useSelector} from 'react-redux';
import AppBar from '../components/Navbar';
import WebView from 'react-native-webview'
const {height, width} = Dimensions.get('window')

const LiveClass = ({navigation, route}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connection, setConnection] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null);
  const LiveClassData = route.params.LiveClassData
  const [url, setUrl] = useState(null)
  console.log('Live Class Data: ', LiveClassData)
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const UserName = ProfileD.firstName + ' ' + ProfileD.lastName

  useEffect(()=>{
    var token = LiveClassData.joinLiveLink.split('?')
    mediaDevices.getUserMedia({
            audio: true,
            video: true,
        })
        .then((stream) => {
            myVideoStream = stream;
            var peer = new Peer(undefined, {
                path: "/peerjs",
                host: "live.qlearning.academy",
                port: "", //443
                secure: true,  
            });
            console.log("Connected on default Port");
            peer.on("open", (id) => {
                console.log("join-room", id);
                setUrl(`https://dev.qlearning.academy/live-room-app/${LiveClassData.liveUUID}?${token[1]}`)
                console.log(`https://dev.qlearning.academy/live-room-app/${LiveClassData.liveUUID}?${token[1]}`)
            });
        })
  }, [])

  const AppBarContent = {
    title: 'Live Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  // let url = 'https://dev.qlearning.academy/live-room-app/d735094c-b110-4cc8-bcaf-406712370d5d?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3Vyc2VDb2RlIjoiNjUxYTlkN2EtNDdjOC00M2NjLWJkMTgtYzhmYjMyZGE5MWM2Iiwic3R1ZGVudEVtYWlsIjoic2FqaXNlNDMyNUBuZXZ5eHVzLmNvbSIsInN0dWRlbnROYW1lIjoiTWluICBBaG0iLCJpc0xpdmVDb3Vyc2UiOnRydWUsImNsYXNzVGltZSI6IkZlYiAxNiwgMjAyMyA4OjU5IEFNIiwibGl2ZUNsYXNzT3JkZXIiOjYsImxpdmVDbGFzc0lkIjoiNjNlZGVmYjM0ZTVmNGMwZGNkMGZjM2U0IiwidG9waWNOYW1lIjoiV2ViUlRDIGluIG1vYmlsZSB0ZXN0IiwibGl2ZVVVSUQiOiJkNzM1MDk0Yy1iMTEwLTRjYzgtYmNhZi00MDY3MTIzNzBkNWQiLCJ1c2VyVHlwZSI6IlNUVURFTlQiLCJpYXQiOjE2NzY1Mzk3MTF9.kxoKmaBUar2ManaM8aRDXl6510gAdt34F8BDr0hW6aw'

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
