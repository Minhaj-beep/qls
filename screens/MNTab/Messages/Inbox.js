import {  Text, IconButton, HStack, VStack, Avatar, Box, Input, Icon, ScrollView } from 'native-base'
import { StatusBar, View, Dimensions } from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import InboxHead from './InboxHead';
// import Chat from './Chat';
import { useSelector } from 'react-redux';
import { messageSocket } from '../../StaticData/MessageSocket';
import Hyperlink from 'react-native-hyperlink';

const {width, height} = Dimensions.get('window')

export default Inbox = ({route}) => {
    const instructor = route.params.instructor
    const navigation= useNavigation()
    const scrollViewRef = useRef();
    const ProfileD = useSelector(state => state.Auth.ProfileData);
    const name = ProfileD.hasOwnProperty('firstName') ? ProfileD.firstName + ' ' + ProfileD.middleName + ' ' + ProfileD.lastName : useSelector(state => state.Auth.TempName)
    let User_ID = useSelector(state => state.Auth.User_ID);
    console.log('profileImgPath --------------------------> ------------------> ---------------> ', instructor.profileImgPath)
    const instructorId = instructor.id
    User_ID = User_ID.replace('"','')
    const [msgList, setMsgList] = useState([])
    const [ChatText, setChatText] = useState('');

    // console.log('Instructor ID: ', instructor.id)

    useEffect(()=>{
        console.log('Message list : ', Object.keys(msgList).length)
        console.log("studentId: ", User_ID,  'instructorId: ', instructorId)
    },[msgList])

    useEffect(()=>{
        // setChatLoading(true)
        messageSocket.connect()
        messageSocket.open()
        messageSocket.on("connection-success", async(response) => {
            console.log(`Socket connected ${response.socketId}`);
        })
        messageSocket.emit('join', { studentId: User_ID,  instructorId: instructorId }, async res => {
            console.log(`Has user Joined: ${res}`);
            // res.map(i => console.log(i))
        })
        messageSocket.emit("getPreviousMessage", { studentId: User_ID,  instructorId: instructorId }, (response) => {
            console.log("getPreviousMessage", response)
            if(response.hasOwnProperty('messages')) {
                setMsgList(chatMessages => ([
                ...response.messages
                ]));
            }
            // setChatLoading(false)
        })
        messageSocket.on("message", receiveMessages)
        return () => {
            messageSocket.off("message", receiveMessages)
            messageSocket.disconnect()
            messageSocket.close();
            messageSocket.on("disconnect", async () => {
                console.log("client disconnected from server");
            })
        }
    },[])
  
    const receiveMessages = useCallback((response) => {
        console.log("recev live chat-------->");
        console.log(response);
            setMsgList(chatMessages => ([
                ...chatMessages,
                {
                    userName: response.userName,
                    dt: response.createdAt,
                    message: response.message,
                    senderId: response.senderId
                    // type: response.type,
                }
            ]));
    }, [])
  
    const sendMsg = (Message) => {
        // setChatLoading(true)
        console.log('Send Message: ', Message)
        messageSocket.emit("sendMessage", {
            studentId: User_ID,
            instructorId: instructorId,
            message: Message,
            userName: name,
            senderId: User_ID,
        }, () => {
            console.log("sendMessage callback!")
            setMsgList(chatMessages => ([
                ...chatMessages,
                {
                    userName: name,
                    dt: new Date(),
                    message: Message,
                    senderId: User_ID
                }
            ]))
            setChatText('')
            // setChatLoading(false)
        })
    }

    const RenderChat = () => {
        return msgList.map((data, index) => {
            const date = new Date(data.dt).toLocaleString()
            return (
                <VStack key={index} mt={4} alignSelf='flex-start'>
                <HStack alignSelf={'flex-start'} space={2}>                    
                    {
                    data.senderId === User_ID ?
                    <>
                        {
                        ProfileD.hasOwnProperty("profileImgPath") && ProfileD.profileImgPath !== '' ?
                        <Avatar bg="green.500" size={'sm'} source={{ uri: ProfileD.profileImgPath}}>{name}</Avatar>
                        :
                        <Avatar bg="green.500" size={'sm'} source={require('../../../assets/personIcon.png')}>{name}</Avatar>
                        }
                    </>
                    :
                    <>
                        {
                        instructor.hasOwnProperty('profileImgPath') && instructor.profileImgPath !== '' && instructor.profileImgPath !== null ?
                        <Avatar bg="green.500" size={'sm'} source={{ uri: instructor.profileImgPath}}>{instructor.fullName}</Avatar>
                        :
                        <Avatar bg="green.500" size={'sm'} source={require('../../../assets/personIcon.png')}>{instructor.fullName}</Avatar>
                        }
                    </>
                    }
                    <VStack>
                    <HStack alignItems="center" alignSelf={'flex-start'} space={2}>
                        {/* <Text color={'primary.900'} style={{fontSize:12,fontWeight:'bold',  }}>{data.userName === ProfileD.fullName ? ProfileD.fullName : data.userName}</Text> */}
                        {
                            data.senderId === User_ID ?
                            <Text color={'primary.900'} style={{fontSize:12,fontWeight:'bold',  }}>{name}</Text>
                            :
                            <Text color={'primary.900'} style={{fontSize:12,fontWeight:'bold',  }}>{instructor.fullName}</Text>
                        }
                        <Text style={{fontSize:8, color:'#8C8C8C' }}>{date}</Text>
                    </HStack>
                    {/* {
                        data.type === 'TEXT' ? */}
                        <Hyperlink linkDefault={ true }>
                            <Text style={{fontSize:12, color:'#000000', maxWidth:width*0.85, alignSelf:'flex-start'}}>{data.message}</Text>
                        </Hyperlink>
                        
                        {/* :
                        <HStack alignItems={"center"} bg={'#b5b5b5'} borderRadius={10} padding={2} width={'100%'}>
                            <IconButton
                                onPress={()=>{
                                // OpenDoc(data.message)
                                }}
                                icon={<Icon size='lg' as={MaterialCommunityIcons} name='download-circle' color='#395061'/>}
                            />
                            <View>
                                <Text numberOfLines={2} style={{fontSize:11, color:'#000000', maxWidth:width/3, marginLeft:5, alignSelf:'flex-end'}}>{data.message.replace('https://ql-files.s3.ap-south-1.amazonaws.com/ticket-files/', '').slice(14).split('%20').join(' ')}</Text>
                            </View>
                        </HStack>
                    } */}
                    </VStack>
                </HStack>
                </VStack>
            )
        })
    }

    return (
        <View style={{ flex:1, width:"100%", height:"100%"}}>
            <InboxHead props={instructor}/>
            <ScrollView
                showsHorizontalScrollIndicator={false} 
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                <View style={{flex:1, width:"95%", alignSelf:"center"}}>
                    {Object.keys(msgList).length > 0 ? <RenderChat/> : <Text style={{fontSize:12, alignSelf:"center", marginTop:"5%", color:'#8C8C8C'}}>This chat is empty.</Text>}
                </View>
            </ScrollView>
            <View style={{bottom:0, width:"100%", }}>
                <View >
                    <Input onChangeText={setChatText} value={ChatText} placeholder="Got any new thought.." marginBottom={2} width="95%" alignSelf={"center"} borderRadius="4" py="1" px="1" fontSize="11" fontWeight={"500"} 
                        InputRightElement={<Icon onPress={()=>{
                            if('' !== ChatText.trim()) {
                                sendMsg(ChatText)
                            }
                        }} m="2" ml="3" size="6" color="primary.900" 
                        as={<MaterialIcons name="send" />} />} 
                    />
                </View>
            </View>
        </View>
    )
}