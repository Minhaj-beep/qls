import { View, Text, Input, Icon, ScrollView } from "native-base"
import React from "react"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FrontMessage from "./FrontMessage";

export default Messages = () => {
    return (
        <ScrollView>
            <Input placeholder="Search" width="95%" alignSelf={"center"} marginTop={1} borderRadius="4" py="0" px="1" fontSize="11" fontWeight={"500"} InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
            <FrontMessage />
            <FrontMessage />
            <FrontMessage />
            <FrontMessage />
            <FrontMessage />
            <FrontMessage />
            <FrontMessage />
            <FrontMessage />
            <FrontMessage />
            <FrontMessage />
        </ScrollView>
    )
}