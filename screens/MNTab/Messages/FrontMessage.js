import { View, Text, Stack, Heading, Avatar, Divider, Tooltip  } from "native-base"
import { TouchableOpacity } from "react-native"
import React from "react"
import { useNavigation } from "@react-navigation/native"

export default FrontMessage = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={()=>navigation.navigate('Inbox')}>
            <Stack p="4" marginBottom={-5} space={0}>
                <View style={{ flexDirection:"row", justifyContent:"space-between"}}>
                    <View style={{ flexDirection:"row"}}>
                        <View>
                        <Avatar bg="green.500" source={{
                            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                        }}> AJ </Avatar>
                        </View>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontSize:14, fontWeight:"500"}}> Naresh </Text>
                            <Text style={{fontSize:11, fontWeight:"500"}}> Me: How are you? </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:11, fontWeight:"500"}}>3d</Text>
                    </View>
                </View>
                <Divider style={{marginTop:5}} />
            </Stack>
        </TouchableOpacity>
    )
}