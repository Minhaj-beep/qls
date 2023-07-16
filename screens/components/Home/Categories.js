import React, {useEffect, useState} from "react"
import { VStack, Text, View, FlatList, Heading } from "native-base"
import GetCategories from "../../Functions/API/GetCategories"
import { useSelector } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "react-native"

const Categories = () => {
    const navigation = useNavigation()
    const email = useSelector(state => state.Auth.Mail);
    const [allCategories, setAllCategories] = useState([])
    const [array1, setArray1] = useState([])
    const [array2, setArray2] = useState([])
    const [array3, setArray3] = useState([])

    useEffect(()=> {
        getAllCategories()
    },[])

    const segregateArray = (inputArray) => {
        const arr1 = [];
        const arr2 = [];
        const arr3 = [];
        const n = inputArray.length;
        
        for (let i = 0; i < n; i++) {
            if (i % 3 === 0) {
                arr1.push(inputArray[i]);
            } else if (i % 3 === 1) {
                arr2.push(inputArray[i]);
            } else {
                arr3.push(inputArray[i]);
            }
        }
      
        return [arr1, arr2, arr3];
    }

    const getAllCategories = async () => {
        try {
            const result = await GetCategories(email)
            if(result.status === 200) {
                setAllCategories(result.data)
                const [arr1, arr2, arr3] = segregateArray(result.data)
                setArray1(arr1)
                setArray2(arr2)
                setArray3(arr3)
                console.log(Object.keys(result.data).length, '_________________ALL CATEGORIES________________')
            } else {
                console.log('getAllCategories error: 1 ', result)
            }
        } catch (e) {
            console.log('getAllCategories error: 2 ', e)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={()=>navigation.navigate('ViewCategory', {data: item})}>
                <View marginX={1} bg={'white'}>
                    <Text padding={2} color={'primary.900'} fontSize={12} style={{backgroundColor:"white", borderRadius:6}}>{item.categoryName}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const GetFlatlist = ({array}) => {
        return (
            <FlatList
                data={array}
                mb={2}
                horizontal
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item._id}_${index}`}
            />
        )
    }

    return (
        <VStack>
            <Heading color={'#000'} ml={2} style={{fontSize: 15}}>Categories</Heading>
            <VStack bg={'secondary.50'} paddingTop={4} paddingBottom={2}>
                <GetFlatlist array={array1}/>
                <GetFlatlist array={array2}/>
                <GetFlatlist array={array3}/>
            </VStack>
        </VStack>
    )
}

export default Categories