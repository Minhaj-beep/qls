import { set } from "immer/dist/internal"
import { View, Text, Input, Button } from "native-base"
import React, { useEffect, useState } from "react"
import { TextInput } from "react-native-gesture-handler"
import { io } from 'socket.io-client'

const LiveClass = () => {
  useEffect(()=>{
    socketConnect()
  },[])

  const [connection, setConnection] = useState(0)
  const [connected, setConnected] = useState(false);
  // const [socket, setSocket] = useState(null);
  const [m, setM] = useState(null)
  const [con, setCon] = useState(false)
  const socket = io("wss://live.qlearning.academy/qllive")


  const [message, setMessage] = useState([]);

  console.log(message)

    // This is the current ongoing messages
    socket.on("message", (response) => {
        setMessage(message)
    })
    // This is when a user join the meeting 
    socket.on("userJoin", (response) => {
        // you response link ex: Minhaj joined the room || Minhaj left the room 
        // document.getElementById("chat").innerHTML += `<li>${response.username}</li>`
    })

    useEffect(() => {
        // document.getElementById("chat").innerHTML += `<li>${response.message}</li>`
    }, [message])

    // This for joining the room
    const joinRoom = () => {
        const userName = "Minhaj"
        const roomName = "sample"

        socket.emit("join-room", { userName, roomName }, async (res) => {
            console.lo("joined room");
        });
    };
    
    // This is for sending Messages
    const sendMessage = () => {
        // const message = document.getElementById("message").value
        // socket.on("connection-success", async (response) => {
            socket.emit("sendMessage", { meaasge:m }, () => {
                // document.getElementById("message").value = ""
              })
            
          // });
    }

    // This if for connection
    const socketConnect = () => {
        socket.on("connection-success", (response) => {
            console.log(`Socket connected ${response.socketId}`);
            joinRoom();
        });
    };
    
  
  
  
  
  
  // const useWebsocket = (url) => {
    // useEffect(()=>{
    //     // const newSocket = url;
    //     const userName = "Minhaj"
    //     const roomName = "sample"
    //     socketURL.on('connection-success', ()=>{
    //       socketURL.emit("join-room", { userName, roomName }, async (res) => {
    //         console.lo("joined room");
    //         setCon(true)
    //       });
    //     });

    //     return (
    //       socketURL.on('disconnect', ()=>{
    //         socketURL.emit("join-room", { userName, roomName }, async (res) => {
    //           console.lo("joined room");
    //           setCon(true)
    //         })
    //       })
    //     )
    //     // newSocket.on('disconnect', ()=>setConnected(false));
    //     // setSocket(newSocket);
    // }, [])
    // if(connected){
    //   joinRoom()
    // }
  //   return {
  //       connected,
  //       socket,
  //   }
  // }
  // const joinRoom = () => {
  //   // if(useWebsocket().connected){
  //     const userName = "Minhaj"
  //     const roomName = "sample"
  //     console.log('true')
      
  //     socketURL.emit("join-room", { userName, roomName }, async (res) => {
  //       console.log("joined room");
  //     });
  //   // }
  // }

  

  // const sendMessage = () => {
  //   // if(con.connected){
  //     socketURL.on('connection-success', ()=>{
  //       if(con){
  //         console.log(con)
  //         socketURL.emit("sendMessage", { message:m }, () => {
  //           console.log('hello')
  //           // document.getElementById("message").value = "Hello"
  //         })
  //       }
  //     });
  //   // }
  // }





  return (
    <View>
      <Text>Hello</Text>
      <Button >Join</Button>
      <Input 
        onChangeText={(t)=>setM(t)}
      />
      <Button onPress={()=>{
        sendMessage()
      }} >Send</Button>
    </View>
  )
}

export default LiveClass