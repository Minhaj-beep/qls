import { View, Text, Input, Icon, ScrollView } from "native-base"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FrontMessage from "./FrontMessage";
import GetAllMessagesFromInstructor from "../../Functions/API/GetAllMessagesFromInstructor";
import { useIsFocused } from "@react-navigation/native";

export default Messages = ({navigation}) => {
    const isFocused = useIsFocused()
    const JWT = useSelector(state => state.Auth.JWT);
    const GUser = useSelector(state => state.Auth.GUser)
    const email = useSelector(state => state.Auth.Mail)
    let User_ID = useSelector(state => state.Auth.User_ID);
    User_ID = User_ID.replace('"','')

    const [allInstructors, setAllInstructors] = useState([])
    const [currentInstructors, setCurrentInstructors] = useState([])
    const [query, setQuery] = useState('')
    // console.log(JWT, User_ID)

    useEffect(()=>{
        getAllMessagesFromInstructor()
    },[isFocused])

    useEffect(()=> {
        if(query.trim() === '') {
            setCurrentInstructors(allInstructors)
        } else {
            const filteredNames = allInstructors.filter(i => i.fullName.toLowerCase().includes(query.toLowerCase()))
            setCurrentInstructors(filteredNames)
        }
    },[query])

    const getAllMessagesFromInstructor = async () => {
        try {
            const result = await GetAllMessagesFromInstructor(GUser, email, JWT, User_ID) 
            if(result.status === 200) {
                setAllInstructors(result.data)
                setCurrentInstructors(result.data)
                console.log(result, "Message list discovered")
            } else {
                console.log('getAllMessagesFromInstructor error 1 : ', result)
            }
        } catch (e) {
            console('getAllMessagesFromInstructor error 2 : ', e)
        }
    }

    return (
        <View style={{flex:1}}>
            <Input onChangeText={setQuery} placeholder="Search" width="95%" alignSelf={"center"} marginTop={1} borderRadius="4" py="0" px="1" fontSize="11" fontWeight={"500"} InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
            <ScrollView>
                <View style={{flex:1, marginBottom:6}}>
                {
                    Object.keys(currentInstructors).length > 0 ?
                        currentInstructors.map((data, index) => {
                            return (
                                <View key={index}>
                                    <FrontMessage props={data} />
                                </View>
                            )
                        }) 
                    : <Text style={{fontSize:12, alignSelf:"center", marginTop:"1%", color:'#8C8C8C'}}>Your inbox is empty!</Text>
                }
                </View>
            </ScrollView>
        </View>
    )
}