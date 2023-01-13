import { View, Text, Image, Avatar, Stack } from "native-base"
import React from "react"
import { TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default FrontNotification = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={()=>navigation.navigate('NotificationInbox')} style={{marginBottom:0}}>
            <Stack p="4" space={0} marginBottom={-5}>
                <View style={{flexDirection:"row"}}>
                    <View>
                        <View style={{backgroundColor:"#F0E1EB", width:30, height:30, marginTop:5, borderRadius:10}}>
                            <Image alt="Notification" top={-25} resizeMode="contain" source={require('../../../assets/BottomNav/14.png')} />
                            {/* <Avatar bg="transparent" margin={2} source={require('../../../assets/BottomNav/04.png')} >
                                Notification
                            </Avatar> */}
                        </View>
                    </View>
                    <View style={{marginLeft:10, flex:1, }}>
                        <Text noOfLines={1} style={{fontSize:14, fontWeight:"600"}}>Nahid enrolled "UI/UX advance course"</Text>
                        <Text noOfLines={2} style={{fontSize:11}}>Lorem ipsum susagn  sjhs kj kjlnsd kjha  lakd alk lksdf koeu oolnsl ldo ksdk intoxic asxibaaaaaaaaa. Ipsum susagn intoxic asxibabe ipsum susagn intoxic asxibabe.</Text>
                        <Text noOfLines={1} style={{fontSize:9}}>04 Oct 2021 at 5.01 PM</Text>
                    </View>
                </View>
            </Stack>
        </TouchableOpacity>
    )
}