import { Button, Input, ScrollView, View, Text } from "native-base";
import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("wss://live.qlearning.academy/qllive");

const LiveClass = () => {
  const [message, setMessage] = useState({})
  const [newResponse, setNewResponse] = useState({})
  const [messageList, setMessageList] = useState([
    {username: 'Minhaj', message: 'Welcome', createdAt: 1672329948874}
  ])
  
  useEffect(() => {
    console.log('use effect triggerd')
    try{
      socketConnect();
      console.log(socket.connected)
    } catch (e){
      console.log("This is the error triggering socket: ", e)
    }
    
  }, []);

  useEffect(()=>{
    setMessageList([newResponse, ...messageList])
  },[newResponse.createdAt])
  socket.on("message", (response) => {
    setNewResponse(response)    
    console.log(response)
    // document.getElementById("chat").innerHTML += `<li>${response.message}</li>`
  })

  socket.on("userJoin", (response) => {
    // document.getElementById("chat").innerHTML += `<li>${response.username}</li>`
  })

  const joinRoom = () => {
    console.log(`Join room started`);
    const userName = "Minhaj"
    const roomName = "sample"

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
    socket.emit("sendMessage", { message:message }, () => {
      console.log("callback from server")
    })

  }
  // socketConnect();
  return (
    <View>
      <Input onChangeText={(text)=>{ setMessage(text) }} />
      <Button onPress={()=>{sendMessage()}}>Send</Button>
      <ScrollView>
        {messageList.map((i, key)=>{
          return (
            <Text key={key}>{i.message}</Text>
          )
        })}
      </ScrollView>
    </View>
  );
};
export default LiveClass;
