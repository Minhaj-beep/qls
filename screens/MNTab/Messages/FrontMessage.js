import { View, Text, Stack, Heading, Avatar, Divider, Tooltip  } from "native-base"
import { TouchableOpacity } from "react-native"
import React from "react"
import { useNavigation } from "@react-navigation/native"
import { useSelector } from "react-redux";

export default FrontMessage = ({props}) => {
    // console.log(props, 'HAs new message?')
    const navigation = useNavigation()
    let User_ID = useSelector(state => state.Auth.User_ID);
    User_ID = User_ID.replace('"','')

    function calculateAge(givenTime) {
        const currentTime = new Date();
        const givenDateTime = new Date(givenTime);
        
        const elapsedMilliseconds = currentTime - givenDateTime;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        const elapsedMinutes = Math.floor(elapsedSeconds / 60);
        const elapsedHours = Math.floor(elapsedMinutes / 60);
        const elapsedDays = Math.floor(elapsedHours / 24);
        const elapsedMonths = Math.floor(elapsedDays / 30);
        const elapsedYears = Math.floor(elapsedMonths / 12);
        
        if (elapsedSeconds < 60) {
          return 'now';
        } else if (elapsedMinutes < 60) {
          return `${elapsedMinutes} minute ago`;
        } else if (elapsedHours < 24) {
          return `${elapsedHours} hour ago`;
        } else if (elapsedDays < 30) {
          return `${elapsedDays} day ago`;
        } else if (elapsedMonths < 12) {
          return `${elapsedMonths} month ago`;
        } else {
          return `${elapsedYears} year ago`;
        }
    }

    return (
        <TouchableOpacity onPress={()=>navigation.navigate('Inbox', {instructor: props})}>
            <Stack p="4" marginBottom={-5} space={0}>
                <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    <View style={{ flexDirection:"row"}}>
                        <View>
                            {
                                props.hasOwnProperty('profileImgPath') ?
                                <Avatar bg="green.500" source={{uri: props.profileImgPath }}>{props.fullName}</Avatar>
                                :
                                <Avatar bg="green.500" source={require('../../../assets/personIcon.png')}>{props.fullName}</Avatar>
                            }
                        </View>
                        <View style={{marginLeft:10}}>
                            <Text noOfLines={1} maxW={'72'} style={{fontSize:14, fontWeight:"500"}}>{props.fullName}</Text>
                            {
                                props.senderId === User_ID ?
                                <Text noOfLines={1} maxW={'72'} style={{fontSize:11, fontWeight:"500"}}>{props.message !== '' ? 'Me: ' + props.message : ''}</Text>
                                :
                                <Text noOfLines={1} maxW={'72'} style={{fontSize:11, fontWeight:"500"}}>{props.message !== '' ? props.fullName + ': ' + props.message : ''}</Text>
                            }
                        </View>
                    </View>
                    <View bottom={1}>
                        <Text color={'gray.500'} style={{fontSize:11, fontWeight:"500"}}>{props.lastActive !== '' ? calculateAge(props.lastActive) : ''}</Text>
                    </View>
                </View>
                <Divider style={{marginTop:5}} />
            </Stack>
        </TouchableOpacity>
    )
}