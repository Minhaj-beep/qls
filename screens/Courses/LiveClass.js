import {View,SafeAreaView, Dimensions, ScrollView, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
import {useState,useEffect,React,useRef} from 'react';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import {VStack,HStack, ZStack, Image,Container,Text,Input, IconButton, Button} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';
import * as webRtcClient from "mediasoup-client";
import { io } from 'socket.io-client';


const { width, height } = Dimensions.get('window');

const socket = io("wss://live.qlearning.academy/qllive");

const LiveClass = ({navigation, route}) => {
  const LiveClassData = route.params.LiveClassData
  registerGlobals();
  const [ChatText, setChatText] = useState();
  const [chat, setChat] = useState({})
  const [newResponse, setNewResponse] = useState(null)
  const [messageList, setMessageList] = useState([])
  const [data, setDAta] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [loadRTP, setLoadRTP] = useState(true)
  const scrollViewRef = useRef();
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const UserName = ProfileD.firstName + ' ' + ProfileD.lastName
  const [rtpCapabilities, setRtpCapbilities] = useState(null)
  const [device, setDevice] = useState(null)
  const [consumerTransport, setConsumerTransport] = useState(null)
  const [consumer, setConsumer] = useState(null)

  const AppBarContent = {
    title: 'Live Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person',
  };

  useEffect(()=>{
    try {
      getRtcCapabilities()
    } catch (e) {
      console.log('Error occured while connecting to RTC : ', e)
    }
  },[])
  

  useEffect(() => {
    console.log('use effect triggerd')
    try{
      socketConnect();
      console.log(socket.connected)
    } catch (e){
      console.log("This is the error triggering socket: ", e)
    }
    return () => {
      joinRoom()
      // socket.disconnect()
      // socket.off('userJoin')
    }
  },[]);  // Socket connection and disconnection

  useEffect(()=>{
    setMessageList([...messageList, newResponse])
  },[newResponse]) // Message and user join/left list

  //Web RTC configuration
  const connectRecvTransport = async () => {
    console.log("start receive");
    console.log('Here ashole: ', device)
    await socket.emit(
      "consume",
      { rtpCapabilities: rtpCapabilities },
      async ({ params }) => {
        if (params.error) {
          console.log("cannot consume ======> ", params.error);
          return;
        }
        console.log("get-consumer =============>", params);
        let Newconsumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });
        setConsumer(Newconsumer)
        const { track } = consumer;
        // document.getElementById("student").srcObject = new MediaStream([track]);
        socket.emit("consumer-resume", { socketId: socket.id });
      }
    );
  };

  const createRecvTransport = async () => {
    await socket.emit(
      "createWebRtcTransport",
      { sender: false },
      ({ params }) => {
        console.log('===============================>') //
        setLoadRTP(false)
        if (params.error) {
          console.log("ERROR__OCCURED===============================>", params);
          return;
        }
        console.log("createRecvTransport ", params);
        setConsumerTransport(device.createRecvTransport(params)); // converted to hook
        console.log('===============================>', consumerTransport) //
        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            console.log("casdad");
            try {
              await socket.emit("transport-recv-connect", {
                dtlsParameters,
              });
              callback();
              //  await connectRecvTransport()
            } catch (error) {
              console.log(error);
              errback(error);
            }
          }
        );
      }
    );
  };

  const createDevice = async () => {
    try {
      let clientDevice = new webRtcClient.Device();
      setDevice(clientDevice)
      console.log('===============>Take THIS : ', device)
      await device.load({ routerRtpCapabilities: rtpCapabilities });
      await createRecvTransport();
    } catch (err) {
      console.log(err);
      if (err.name === "UnsupportedError") {
        console.error("browser not supported");
      }
    }
  };

  const getRtcCapabilities = async () => {
    socket.emit("getRtpCapabilities", async (data) => {
      console.log(`Router RTP Capabilities... ${data}`);
      // rtpCapabilities = data;
      setRtpCapbilities(data)
      await createDevice();
    });
  };
  if(!loadRTP){
    connectRecvTransport()
  }

  socket.on("message", (response) => {
    setNewResponse(response)    
    console.log(response)
    // document.getElementById("chat").innerHTML += `<li>${response.message}</li>`
  })

  socket.on("userJoin", (response) => {
    setMessageList([...messageList, response])
    // document.getElementById("chat").innerHTML += `<li>${response.username}</li>`
  })

  const handleJoin = () => {
    socket.on("userJoin", (response) => {
      setMessageList([...messageList, response])
      // document.getElementById("chat").innerHTML += `<li>${response.username}</li>`
    })
  }
  const joinRoom = () => {
    console.log(`Join room started`);
    const userName = UserName
    // const roomName = LiveClassData.map((i)=>i.liveUUID)
    const roomName = "sample"
    // console.log('This is the room name', roomName[0])

    socket.emit("join-room", { userName, roomName }, async (res) => {
      //  console.log(`Router RTP Capabilities... ${res}`);
      //  rtpCapabilities = res.routerRtpCapabilities;
      // await createDevice();
    });
  };

  const socketConnect = () => {
    socket.on("connection-success", async (response) => {
      console.log(`Socket connected ${response.socketId}`);
    });
    joinRoom();
  };
  const sendMessage = () => {
    let messageObject = {
      createdAt: new Date().getTime(),
      username: "ME",
      message: data
    }
    setMessageList([...messageList, messageObject])
    setDAta('')
    socket.emit("sendMessage", { message:data }, () => {
      console.log("callback from server")
    })

  }

  const RenderChat = () => {
    return messageList.map((data,index)=>{
      if(data !== null) {
          let time = new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })
          if(data.username !== "ME"){
            return (
              <VStack space={1} key={index} alignSelf={"flex-start"} mt={1}>
                  <HStack space={2} alignSelf={"flex-start"} >
                  <Text style={{fontSize: 14,color: '#000000',fontWeight: 'bold'}}>{data.username}</Text>
                  <Text style={{fontSize: 11,color: '#8C8C8C'}}>{time}</Text>
                  </HStack>
                  <Text style={{fontSize: 14,color: '#000000'}} alignSelf="flex-start">
                      {data.message}
                  </Text>
              </VStack>
            );
          } else {
            console.log(new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }))
            return (
              <VStack space={1} key={index} alignSelf={"flex-end"} mt={1}>
                  <HStack space={2} alignSelf={"flex-end"} >
                  <Text style={{fontSize: 11,color: '#8C8C8C'}}>{time}</Text>
                  <Text style={{fontSize: 14,color: '#000000',fontWeight: 'bold'}}>{data.username}</Text>
                  </HStack>
                  <Text style={{fontSize: 14,color: '#000000'}} alignSelf="flex-end">
                      {data.message}
                  </Text>
              </VStack>
            );
          }
        } 
    });
  };


  return (
    <View style={styles.TopContainer}>
      <AppBar props={AppBarContent}/>
      <View style={{width:"95%", alignSelf:"center"}}>
        <Image source={require('../../assets/live.png')} alt="live" size={7} style={{position:'absolute', marginTop:5, zIndex:100, marginLeft:10}} />
        <Image source={require('../../assets/course_image.png')} alt="courseImg" resizeMode="cover" style={styles.courseImg} mb={2} />
        {/* <RTCView 
          key={2}
          streamURL={{}}
          style={styles.courseImg}
        /> */}
        {/* <Image style={{position:"absolute"}} source={require('../../assets/Hangup.png')} alt="cameraon" size={10} /> */}
        <Text style={{fontWeight:"600", fontSize:15}}>{LiveClassData.map((i)=>i.topicName)}</Text>
      </View>
        <Container ml={2} mr={2} mt={6} >
          <Text style={{color:'#FFFFFF',backgroundColor:'#395061', width:width / 1.035, fontSize:20, fontWeight: 'bold', borderTopLeftRadius:10, borderTopRightRadius:10}} p={4}>
            Chat
          </Text>
        </Container>
        <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{height:height / 2.8}}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          >
          <VStack ml={2} mr={2} mt={6} space={4}>

            { messageList && <RenderChat/> }

          </VStack>
        </ScrollView>
        <View style={{width:"95%", alignSelf:"center", marginBottom:2}}>
          <Input
              variant="filled"
              bg="#f3f3f3"
              value={data}
              placeholder="Write a message"
              InputRightElement={
              <IconButton
              onPress={()=>{
                  sendMessage()
              }}
              icon={<Icon size={20} name="send" color="#395061"/>}
              />}
              style={{maxWidth:width / 1.2}}
              onChangeText={(text)=>{
                  setChatText(text);
                  setDAta(text)
              }}
              mt={2}
              rounded={20}
            />
        </View>
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
  width:width / 1.1,
  height:height / 2.5,
},
MicOn:{
  color:'#395061',
  backgroundColor:'#fCfCfC',
  borderRadius:50,
},
video:{
  color:'#395061',
  backgroundColor:'#fCfCfC',
  borderRadius:50,
},
courseImg: {
    height: height / 4,
    borderRadius: 5,
  },
  liveBtn:{
    position:'absolute',
    marginTop:140,
    zIndex:100,
    marginLeft:'35%',
  },
});
