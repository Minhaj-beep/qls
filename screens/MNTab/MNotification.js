import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Text,
  VStack,
  HStack,
  Input,
  FormControl,
  Actionsheet,
  Box,
  useDisclose,
  Button,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import AppBar from '../components/Navbar';
import {GetPurchasedCourses} from '../Functions/API/GetPurchasedCourses';
import {useSelector, useDispatch} from 'react-redux';
import Messages from './Messages/Messages';
import Notifications from './Notifications/Notifications';

const {width, height} = Dimensions.get('window');

const Courses = ({navigation}) => {
  const email = useSelector(state => state.Auth.Mail);
  const [PCourses, setPCourses] = useState();
  const [selected, setSelected] = useState('Messages') // Button selection
  const dispatch = useDispatch();
  const AppBarContent = {
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  useEffect(()=>{
    GetPC();
  },[]);

  const GetPC = async() => {
     try {
      let response = await GetPurchasedCourses(email);
      if (response.status === 200) {
        if (response.data.length !== 0) {
          setPCourses(response.data);
          // console.log(response.data.length);
        }
      } else {
        alert(response.message);
        console.log(response.message);
      }
     } catch (err) {
      console.log(err.message);
      alert('Error: ' + err.message);
     }
  };

  const changeSelected = (x) => {
    if (x === "Messages"){
      setSelected("Messages")
    } else {
      setSelected('Notifications')
    }
  }

  return (
    <View style={styles.container}>
      <AppBar props={AppBarContent} />

      {/* Buttons to get messages or notifications */}
      <View style={{width:"95%", marginTop:5, alignSelf:"center", backgroundColor:"grey", borderRadius:5, flexDirection:"row", justifyContent:"space-between", }}>
        <Button onPress={()=>changeSelected("Messages")} size="md" variant={selected === "Messages" ? "subtle" : "ghost" } _text={{color: '#FFF', fontSize: 14, fontWeight:"600" }} borderRadius={5} style={{width:"50%", }}>Messages</Button>
        <Button onPress={()=>changeSelected("Notifications")} size="md" variant={selected === "Messages" ? "ghost" : "subtle" } _text={{color: '#FFF', fontSize: 14, fontWeight:"600" }} borderRadius={5} style={{width:"50%", }}>Notifications</Button>
      </View>

      {selected === 'Messages' ? <Messages /> : <Notifications />}
      
    </View>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    height: height,
    width: width,
    flex: 1,
  },
  TopContainer: {
    flexGrow: 1,
    paddingBottom: 70,
    padding: 15,
  },
});
