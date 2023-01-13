import {  Text, IconButton, Avatar, Box, Input, Icon, ScrollView } from 'native-base'
import { StatusBar, View } from 'react-native';
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import InboxHead from './InboxHead';
import Chat from './Chat';

export default Inbox = () => {
    const navigation= useNavigation()
    return (
        <View style={{width:"100%", height:"100%"}}>
            <InboxHead />
            <ScrollView style={{marginBottom:51}}>
                <Chat />
                <Chat />
                <Chat />
                <Chat />
                <Chat />
                <Chat />
                <Chat />
            </ScrollView>
            <View style={{bottom:0, width:"100%", position:"absolute"}}>
                <View >
                    <Input placeholder="Got any new thought.." marginBottom={2} width="95%" alignSelf={"center"} borderRadius="4" py="1" px="1" fontSize="11" fontWeight={"500"} 
                        InputRightElement={<Icon onPress={()=>alert('Send')} m="2" ml="3" size="6" color="gray.400" 
                        as={<MaterialIcons name="send" />} />} 
                    />
                </View>
            </View>
        </View>
    )
}