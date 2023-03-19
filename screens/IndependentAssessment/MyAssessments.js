import { View, Text, Button } from "native-base"
import React, {useState, useEffect} from "react"
import AppBar from "../components/Navbar"
import {useSelector, useDispatch} from 'react-redux'
import { BaseURL } from "../StaticData/Variables"
import { useNavigation } from "@react-navigation/native"
import Purchaged from "./components/Purchaged"
import Completed from "./components/Completed"
import { GetPurchasedCourses } from "../Functions/API/GetPurchasedCourses"
import { StyleSheet, Dimensions } from "react-native";
const {height, width} = Dimensions.get('window')

const MyAssessments = () => {
    const navigation = useNavigation()
    const email = useSelector(state => state.Auth.Mail);
    const [selected, setSelected] = useState('Messages')
    const [allPurchagedCourses, setAllPurchagedCourses] = useState([])
    const [allCompletedCourses, setAllCompletedCourses] = useState([])

    useEffect(()=>{
        getPurchagesHistory()
    },[])

    const AppBarContent = {
        title: 'My Assessment',
        navigation: navigation,
        ArrowVisibility: true,
    };

    const changeSelected = (x) => {
        if (x === "Messages"){
          setSelected("Messages")
        } else {
          setSelected('Notifications')
        }
    }

    // Get all purchaged assessments
    const getPurchagesHistory = async() => {
        try {
            let response = await GetPurchasedCourses(email)
            if (response.status === 200){
                let arr = []
                response.data.map((i)=>{
                    if(i.assessmentCode){
                        arr = [...arr, i]
                    }
                })
                let cc = []
                let pc = []
                if(Object.keys(arr).length > 0) {
                    arr.map((i)=>{
                        if(i.isCompleted){
                            cc = [...cc, i]
                        } else {
                            pc = [...pc, i]
                        }
                    })
                }
                arr.map((i)=>console.log(i))
                setAllPurchagedCourses(pc)
                setAllCompletedCourses(cc)
            } else {
                console.log('getPurchagesHistory 1', response.message)
            }
        } catch (e) {
            console.log('getPurchagesHistory 2', e)
        }
    }

    return (
        <View style={{flex:1}}>
            <AppBar props={AppBarContent} />

            <View style={{width:"95%", marginTop:5, alignSelf:"center", backgroundColor:"grey", borderRadius:5, flexDirection:"row", justifyContent:"space-between", }}>
                <Button onPress={()=>changeSelected("Messages")} size="md" variant={selected === "Messages" ? "subtle" : "ghost" } _text={{color: '#FFF', fontSize: 14, fontWeight:"600" }} borderRadius={5} style={{width:"50%", }}>Purchaged</Button>
                <Button onPress={()=>changeSelected("Notifications")} size="md" variant={selected === "Messages" ? "ghost" : "subtle" } _text={{color: '#FFF', fontSize: 14, fontWeight:"600" }} borderRadius={5} style={{width:"50%", }}>Completed</Button>
            </View>
            {
                Object.keys(allPurchagedCourses).length > 0 || Object.keys(allCompletedCourses).length > 0
                ?
                <>
                    {selected === 'Messages' ? 
                        <View style={{flex:1, marginTop:5, alignSelf:"center", width:width*0.95}}>
                            {
                                Object.keys(allPurchagedCourses).length > 0 ?
                                <Purchaged props={allPurchagedCourses} />
                                :
                                <Text mt={5} style={{fontSize:15, alignSelf:"center", borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>No new assessment to attempt!</Text>
                            }
                        </View>
                    :
                        <View style={{flex:1, marginTop:5, alignSelf:"center", width:width*0.95}}>
                            
                            {
                                Object.keys(allCompletedCourses).length > 0 ?
                                <Completed props={allCompletedCourses} />
                                :
                                <Text mt={5} style={{fontSize:15, alignSelf:"center", borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>You have not completed any assessment yet!</Text>
                            }
                        </View>
                    }
                </>
                : 
                <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                    <Text mt={5} style={{fontSize:15, alignSelf:"center", borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>Your purchaged courses are empty!</Text>
                </View>
            }
        </View>
    )
}

export default MyAssessments