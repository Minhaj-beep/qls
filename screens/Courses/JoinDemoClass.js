import {View, Dimensions, ScrollView, ActivityIndicator, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
import {useState,useEffect,React, useCallback, useRef} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import WebView from 'react-native-webview';


const { width, height } = Dimensions.get('window')

const JoinDemoClass = ({navigation}) => {
  const [endClass, setEndClass] = useState(null)
  const JoinDemoClassData = useSelector(state => state.Course.JoinDemoClassData);
  const [url, setUrl] = useState(null)

  useEffect(()=>{
    if(endClass !== null){
      navigation.navigate('DemoClass')
    }
  },[endClass])

  useEffect(()=>{
    var token = JoinDemoClassData.studentLink.split('?')
    var id = JoinDemoClassData._id
    setUrl(`https://dev.qlearning.academy/live-demo-class/${id}?${token[1]}`)
    console.log(id, 'and ', token[1], 'and the entire link ', JoinDemoClassData.studentLink)
    console.log(`{
        https://dev.qlearning.academy/live-demo-class/${id}?${token[1]}
    }`)
  }, [])

  const AppBarContent = {
    title: 'Demo Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const onMessage = (data) => {
    setEndClass(data.nativeEvent.data);
  }

  return (
    <View style={styles.TopContainer}>
          <AppBar props={AppBarContent}/>
          {
            url !== null ?
                <WebView 
                  style={{height:'100%', width:'100%', backgroundColor:"red"}} 
                  source={{ uri: url }} 
                  allowsInlineMediaPlayback={true} 
                  mediaPlaybackRequiresUserAction={false}
                  mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
                  allowsProtectedMedia={true}
                  allowsAirPlayForMediaPlayback={true}
                  startInLoadingState
                  scalesPageToFit
                  onMessage={onMessage}
                  javaScriptEnabled={true}
                  userAgent={'Mozilla/5.0 (Linux; An33qdroid 10; Android SDK built for x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.185 Mobile Safari/537.36'}
                />
            : null
          }
    </View>
  )
}

export default JoinDemoClass

const styles = StyleSheet.create({
  TopContainer:{
    flex: 1,
    top: 0,
    backgroundColor:'#fCfCfC',
    height:height,
    width:width,
},
CameraBorder:{
  width:width/1.1,
  height:height/2.5,
},
MicOn:{
  color:'#395061',
  backgroundColor:'#fCfCfC',
  borderRadius:50
},
video:{
  color:'#395061',
  backgroundColor:'#fCfCfC',
  borderRadius:50
}
})