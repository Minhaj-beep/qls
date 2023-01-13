import {  Text, IconButton, Avatar, Box } from 'native-base'
import { StatusBar, View } from 'react-native';
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2'

export default InboxHead = () => {
    const navigation= useNavigation()
    return (
        <View>
            <StatusBar translucent={true} />
            <Shadow style={{width:"100%", paddingBottom:3}} offset={[0, 0]} stretch={true} distance={20} paintInside={false}>
                <View style={{width:'95%', flexDirection:"row", alignItems:"center", marginTop:StatusBar.currentHeight}}>
                    <IconButton
                        onPress={() => navigation.goBack()}
                        style={{fontWeight:"bold"}}
                        icon={<Icon name="arrow-back" color="#3e5160" size={20} />}
                    />
                    <Avatar bg="green.500" style={{height:40, width:40}} source={{
                        uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    }}> AJ </Avatar>
                    <Text style={{fontSize:16, fontWeight:"500", marginLeft:10}}>Naresh Kumar</Text>
                </View>
            </Shadow>
        </View>
    )
}