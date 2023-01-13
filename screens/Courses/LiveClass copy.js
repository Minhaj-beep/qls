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

const { width, height } = Dimensions.get('window');

const socket = io("wss://live.qlearning.academy/qllive");

const LiveClass = ({navigation}) => {
  registerGlobals();
  // const socket = io('ws://live.qlearning.academy/qllive');
  const [ChatList, setChatList] = useState(['Hi', 'how are you ?']);
  const [ChatText, setChatText] = useState();
  const CData = useSelector(state => state.Course.SCData);
  const type = CData.type;
  const SingleCD = CData.CDD;
  // console.log(CData)
  const scrollV = useRef();

  const [Mic, setMic] = useState(false);
  const [Video, setVideo] = useState(true);
  let rtpCapabilities;
  let device;
  let consumerTransport;
  let consumer;


  useEffect(() =>{
    // var CurrentDate = moment().format('hh:mm a');
    // console.log(CurrentDate);
    // console.log(SingleCD.thumbNailImagePath);
  },[]);


  const AppBarContent = {
    title: 'Live Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person',
  };


  const RenderChat = () => {
    return ChatList.map((data,index)=>{
        var CurrentDate = moment().format('hh:mm a');
        // console.log(CurrentDate);
        return (
                <VStack space={1} key={index} alignSelf="flex-end" mt={1}>
                    <HStack space={1} style={{alignSelf:'flex-end'}}>
                    <Text style={{fontSize: 9,color: '#8C8C8C'}}>{CurrentDate}</Text>
                    <Text style={{fontSize: 12,color: '#000000',fontWeight: 'bold'}}>Me</Text>
                    </HStack>

                    <Text style={{fontSize: 12,color: '#000000'}} alignSelf="flex-end">
                        {data}
                    </Text>
                </VStack>
        );
    });
  };





  return (
    <View style={styles.TopContainer}>
      <ScrollView style={{flex:1}}>
        <SafeAreaView>
          <AppBar props={AppBarContent}/>
          <VStack ml={2} mr={2} mt={4}>
           <VStack>
                <Image
                    source={require('../../assets/live.png')}
                    alt="live"
                    size={7}
                    style={{position:'absolute', marginTop:5, zIndex:100, marginLeft:10}}
                />
                <Image
                    // source={{uri: SingleCD.thumbNailImagePath}}
                    source={require('../../assets/course_image.png')}
                    alt="courseImg"
                    resizeMode="cover"
                    style={styles.courseImg}
                    mb={2}
                    />
                <HStack alignItems="center" space={2} justifyContent="center"
                    style={styles.liveBtn}>
                  {/* <IconButton
                    icon={<Feather name={Video ? 'video' : 'video-off'} size={18}/>}
                    onPress={()=>{
                      setVideo(!Video);
                    }}
                    style={styles.video}
                  />

                  <IconButton
                    icon={<Icon name={Mic ? 'mic-outline' : 'mic-off-outline'} size={18}/>}
                    onPress={()=> setMic(!Mic)}
                    style={styles.MicOn}
                  /> */}

                  <TouchableOpacity
                  >
                  <Image
                  source={require('../../assets/Hangup.png')}
                  alt="cameraon"
                  size={10}
                  />
                  </TouchableOpacity>
                </HStack>
           </VStack>

          <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width / 1.3}} ml={2} mr={2} mt={6}>{"SingleCD.courseName"}</Text>
          <Container ml={2} mr={2} mt={6}>
            <Text style={{color:'#FFFFFF',backgroundColor:'#395061', width:width / 1.1, fontSize:20, fontWeight: 'bold', borderTopLeftRadius:10, borderTopRightRadius:10}} p={4}>
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
            <VStack space={1}>
              <HStack space={2}>
              <Text style={{fontSize:12 ,color: '#000000',fontWeight: 'bold'}}>Ragul</Text>
              <Text style={{fontSize: 9,color: '#8C8C8C'}}>10:30 PM</Text>
              </HStack>

              <Text style={{fontSize: 12,color: '#000000'}}>
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.
              </Text>
            </VStack>
            {ChatList && <RenderChat/>}

          </VStack>
          </ScrollView>
          <Input
            variant="filled"
            bg="#f3f3f3"
            value={ChatText}
            placeholder="Write a message"
            InputRightElement={
            <IconButton
            onPress={()=>{
                let NewArray = [...ChatList];
                NewArray.push(ChatText);
                setChatList(NewArray);
                setChatText('');
            }}
            icon={<Icon size={20} name="send" color="#395061"/>}
            />}
            style={{maxWidth:width / 1.2}}
            onChangeText={(text)=>{
                setChatText(text);
            }}
            mt={2}
            rounded={20}
            />
          </VStack>
        </SafeAreaView>
      </ScrollView>
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
