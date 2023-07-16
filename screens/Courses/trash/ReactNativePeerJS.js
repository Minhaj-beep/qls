import React, { useState, useEffect } from 'react';
import { View,   } from 'react-native';
import { Text } from 'native-base';
import io from 'socket.io-client';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import Peer from 'react-native-peerjs';
import {useDispatch,useSelector} from 'react-redux';

const LiveClass = ({navigation, route}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connection, setConnection] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null);
  const LiveClassData = route.params.LiveClassData
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const UserName = ProfileD.firstName + ' ' + ProfileD.lastName

  useEffect(() => {
    // Set up the PeerJS client
    const peer = new Peer(undefined, {
      host: 'live.qlearning.academy',
      path: '/peerjs',
      secure: true,
    });
    setPeer(peer);

    // Set up the Socket.IO client
    const socket = io('wss://live.qlearning.academy');
    setSocket(socket);

    // Set up the WebRTC connection
    const connection = new RTCPeerConnection();
    setConnection(connection);

    // Get the local stream from the camera and microphone
    mediaDevices.getUserMedia({ audio: true, video: true })
    .then((stream) => {
      setLocalStream(stream)
      // peer.on('connection', conn => {
      peer.on('error', console.log)
      peer.on("open", (localPeerId) => {
        console.log("join-room", localPeerId);
        socket.emit("join-room", { roomName: LiveClassData.liveUUID, peerId: localPeerId, userName: UserName });
        console.log('conn', 'conn');
        peer.on('data', data => console.log('Received from remote peer', data));
        peer.on('call', call => {
          console.log('Geetting ready to recive calls')
          console.log(call)
          call.answer(stream)
          console.log('Recived the calls')
          console.log('HOLLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLOOOH',)
          // call.on('stream', remoteStream =>{
          //   console.log('HOLLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLOOOH')
          //   setRemoteStream(remoteStream)
          // })
        })
      })
    })

    

    return () => {
      socket.disconnect();
      peer.disconnect();
      connection.close();
    };
  }, []);

  return (
    <View style={{flex:1}}>
      {console.log(remoteStream , '///////////////////////////////')}
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={{ width: '100%', position:'absolute', height: '100%' }} />}
      {localStream && <RTCView streamURL={localStream.toURL()} style={{ width: 200, zIndex:100, height: 200 }} />}
      <Text>Remote peer ID: {remotePeerId}</Text>
      <Text onPress={() => {
        const dataConnection = peer.connect(remotePeerId);
        dataConnection.on('open', () => {
          dataConnection.send('Hello, world!');
        });
        setRemotePeerId(remotePeerId);
        alert('hello', remotePeerId)
      }}>Connect to remote peer</Text>
    </View>
  );
};

export default LiveClass;
