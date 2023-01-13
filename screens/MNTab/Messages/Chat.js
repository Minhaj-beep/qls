import {  Text, IconButton, Avatar, Box, Input, Icon } from 'native-base'
import { StatusBar, View } from 'react-native';
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default Chat = () => {
    return (
            <View style={{width:"95%", marginVertical:10, alignSelf:"center"}}>
                <View style={{flexDirection:"row", marginTop:10}}>
                    <Avatar bg="green.500" style={{height:30, width:30}} source={{
                        uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    }}> AJ </Avatar>
                    <View style={{marginLeft:10, flex:1}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={{fontSize:14, fontWeight:"600"}}>Naresh Kumar</Text>
                            <Text style={{marginLeft:10, color:"#777777", fontSize:9, fontWeight:"400"}}>Aug 14, 10:50 PM</Text>
                        </View>
                        <Text style={{fontSize:12, fontWeight:"400", lineHeight:16}}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                        </Text>
                    </View>
                </View>
            </View>
    )
}