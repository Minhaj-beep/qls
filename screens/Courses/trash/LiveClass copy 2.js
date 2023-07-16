import {View,SafeAreaView, Dimensions, ScrollView, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
import {useState,useEffect,React,useRef} from 'react';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import {VStack,HStack, ZStack, Image,Container,Text,Input, IconButton} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {
	registerGlobals,
} from 'react-native-webrtc';
import { Device,detectDevice } from 'mediasoup-client';
import { io } from 'socket.io-client';
// import { Ionicons } from "@expo/vector-icons";
// import { Feather } from "@expo/vector-icons";


const { width, height } = Dimensions.get('window');

const socket = io("wss://live.qlearning.academy/qllive");

const LiveClass = ({navigation}) => {
  registerGlobals();
  // const socket = io('ws://live.qlearning.academy/qllive');
  const [ChatList, setChatList] = useState([]);
  const [ChatText, setChatText] = useState();
  const [messageList, setMessageList] = useState([])
  const [data, setDAta] = useState(null)

  const AppBarContent = {
    title: 'Live Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person',
  };

  // This is the current ongoing messages
  socket.on("message", (response) => {
    setChatList(response.message)
    console.log(response)
  })
 

  // This is when a user join the meeting 
  socket.on("userJoin", (response) => {
    // you response link ex: Minhaj joined the room || Minhaj left the room 
    let newUser = [...ChatList]
    newUser.push(`${response.username} has joined.`)
    // document.getElementById("chat").innerHTML += `<li>${response.username}</li>`
  })

  // This is for sending Messages
  const sendMessage = () => {
    let newMessage = [...ChatList]
    newMessage.push(ChatText)
    setChatList(newMessage)
    setChatText('')
    // const message = document.getElementById("message").value
    console.log('This is the data for the message : ', data)
    socket.emit("sendMessage", { message:data }, () => {
        // document.getElementById("message").value = "Hello"
    })
  }

  // Join to the a specific room
  const joinRoom = () => {
    const userName = "Minhaj"
    const roomName = "sample"

    socket.emit("join-room", { userName, roomName }, async (res) => {
        console.lo("joined room");
    });
  };

  // Chat socket connection setup
  const socketConnect = () => {
    console.log('HIs this connected')
    socket.on("connection-success", async (response) => {
        console.log(`Socket connected ${response.socketId}`);
        await joinRoom();
  }); }

  socketConnect()


  const RenderChat = () => {
    console.log(ChatList)
    return ChatList.map((data,index)=>{
        var CurrentDate = moment().format('hh:mm a');
        // console.log(CurrentDate);
        return (
                // <VStack space={1} key={index} alignSelf="flex-start" mt={1}>
                //     <HStack space={2} >
                //     <Text style={{fontSize: 12,color: '#000000',fontWeight: 'bold'}}>Me</Text>
                //     <Text style={{fontSize: 9,color: '#8C8C8C'}}>{CurrentDate}</Text>
                //     </HStack>

                //     <Text style={{fontSize: 12,color: '#000000'}} alignSelf="flex-start">
                //         {data}
                //     </Text>
                // </VStack>
                <></>
        );
    });
  };





  return (
    <View style={styles.TopContainer}>
      <AppBar props={AppBarContent}/>
      <View style={{width:"95%", alignSelf:"center"}}>
        <Image source={require('../../assets/live.png')} alt="live" size={7} style={{position:'absolute', marginTop:5, zIndex:100, marginLeft:10}} />
        <Image source={require('../../assets/course_image.png')} alt="courseImg" resizeMode="cover" style={styles.courseImg} mb={2} />
        {/* <Image source={require('../../assets/Hangup.png')} alt="cameraon" size={10} /> */}
        <Text style={{fontWeight:"600", fontSize:15}}>Live Class 1: UIUX Design Basic To Advance</Text>
      </View>
        <Container ml={2} mr={2} mt={6} >
          <Text style={{color:'#FFFFFF',backgroundColor:'#395061', width:width / 1.035, fontSize:20, fontWeight: 'bold', borderTopLeftRadius:10, borderTopRightRadius:10}} p={4}>
            Chat
          </Text>
        </Container>
        <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{height:height / 2.8}}
            ref={ref => { this.scrollView = ref;}}
            onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
          >
          <VStack ml={2} mr={2} mt={6} space={4}>
            {/* <VStack space={1}>
              <HStack space={2}>
              <Text style={{fontSize:12 ,color: '#000000',fontWeight: 'bold'}}>Ragul</Text>
              <Text style={{fontSize: 9,color: '#8C8C8C'}}>10:30 PM</Text>
              </HStack>

              <Text style={{fontSize: 12,color: '#000000'}}>
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.
              </Text>
            </VStack> */}
            {ChatList && <RenderChat/>}

          </VStack>
        </ScrollView>
        <View style={{width:"95%", alignSelf:"center", marginBottom:2}}>
          <Input
              variant="filled"
              bg="#f3f3f3"
              value={ChatText}
              placeholder="Write a message"
              InputRightElement={
              <IconButton
              onPress={()=>{
                  // let NewArray = [...ChatList];
                  // NewArray.push(ChatText);
                  // setChatList(NewArray);
                  // setChatText('');
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
