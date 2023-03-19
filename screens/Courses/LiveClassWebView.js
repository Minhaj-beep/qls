import React, { useState, useEffect } from 'react';
import { View,   } from 'react-native';
import { Text } from 'native-base';
import io from 'socket.io-client';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import Peer from 'peerjs';
import {useDispatch,useSelector} from 'react-redux';
import WebView from 'react-native-webview';

const LiveClass = ({navigation, route}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connection, setConnection] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null);
  const LiveClassData = route.params.LiveClassData
  console.log('Live Class Data: ', LiveClassData)
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const UserName = ProfileD.firstName + ' ' + ProfileD.lastName

  let url = 'https://dev.qlearning.academy/live-room/9c861a87-2864-421c-9b1e-1c924dc5a278?token=63ec69f02fa1849e92b7334b?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3Vyc2VDb2RlIjoiNjUxYTlkN2EtNDdjOC00M2NjLWJkMTgtYzhmYjMyZGE5MWM2Iiwic3R1ZGVudEVtYWlsIjoic2FqaXNlNDMyNUBuZXZ5eHVzLmNvbSIsInN0dWRlbnROYW1lIjoiTWluICBBaG0iLCJpc0xpdmVDb3Vyc2UiOnRydWUsImNsYXNzVGltZSI6IkZlYiAxNywgMjAyMyAzOjMwIEFNIiwibGl2ZUNsYXNzT3JkZXIiOjUsImxpdmVDbGFzc0lkIjoiNjNlYzZhMTcyZmExODQ5ZTkyYjczNDM4IiwidG9waWNOYW1lIjoiVGhpcyB0aGUgbGVuZ3RoeSBsaXZlIHZpZGVvIHRpdGxlIFRoaXMgdGhlIGxlbmd0aHkgbGl2ZSB2aWRlbyB0aXRsZSBUaGlzIHRoZSBsZW5ndGh5IGxpdmUgdmlkZW8gdGl0bGVUaGlzIHRoZSBsZW5ndGh5IGxpdmUgdmlkZW8gdGl0bGU_IiwibGl2ZVVVSUQiOiI3MWRmMGQzMy0zMjUyLTQ1YTgtOGEzOC02N2QyOWQwY2FjZjgiLCJ1c2VyVHlwZSI6IlNUVURFTlQiLCJpYXQiOjE2NzY0NzcwMzd9.p6ZEtDC2Pm3cZI5Rs1Bz8q0MO1Dro1NZYTNXeuVUhnI'

  return (
    <View style={{flex:1}}>
      <WebView source={{ uri: url }} />
    </View>
  );
};

export default LiveClass;
