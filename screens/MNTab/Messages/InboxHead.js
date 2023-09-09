import { Text, View, IconButton, Avatar, Box, HStack } from 'native-base'
import { StatusBar } from 'react-native';
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2'
import { TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default InboxHead = ({props}) => {
    const navigation= useNavigation()
    return (
        <View >
            <StatusBar translucent={true} />
            <Shadow style={{width:"100%", paddingBottom:3}} offset={[0, 0]} stretch={true} distance={20} paintInside={false}>
                <View paddingY={2} style={{width:'95%', flexDirection:"row", alignItems:"center", marginTop: getStatusBarHeight()}}>
                    <IconButton
                        onPress={() => navigation.goBack()}
                        style={{fontWeight:"bold"}}
                        icon={<Icon name="arrow-back" color="#3e5160" size={20} />}
                    />
                    <TouchableOpacity onPress={()=>{}}>
                    <HStack ml={2} alignItems={'center'}>
                        {
                            props.hasOwnProperty('profileImgPath') && props.profileImgPath !== null ?
                            <Avatar bg="green.500" style={{height:40, width:40}} source={{uri: props.profileImgPath}}>{props.fullName}</Avatar>
                            :
                            <Avatar bg="green.500" style={{height:40, width:40}} source={require('../../../assets/personIcon.png')}>{props.fullName}</Avatar>
                        }
                        <Text style={{fontSize:16, fontWeight:"500", marginLeft:10}}>{props.fullName}</Text>
                    </HStack>
                    </TouchableOpacity>
                </View>
            </Shadow>
        </View>
    )
}