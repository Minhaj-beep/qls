import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../components/Navbar';
import {useDispatch, useSelector} from 'react-redux';
import {Text, VStack, HStack, IconButton} from 'native-base';
import {BaseURL} from '../StaticData/Variables';
import {setLoggedIn, setLoading, setMail} from '../Redux/Features/authSlice';

const {width, height} = Dimensions.get('window');

const AccountActivity = ({navigation}) => {
  const [activity, setActivity] = useState();
  const dispatch = useDispatch();
  const Email = useSelector(state => state.Auth.Mail);

  useEffect(() => {
    getActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActivity = async () => {
    dispatch(setLoading(true));
    if (Email === '') {
      alert('Something went wrong, please login again and try');
    } else {
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: Email,
          gmailusertype: 'STUDENT',
        },
      };
      await fetch(BaseURL + 'userAccountActivity', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setActivity(result.data);
            console.log(result.data);
            dispatch(setLoading(false));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  const AppBarContent = {
    title: 'Account Activity',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  const RenderNotification = () => {
    return activity.map(act => {
      // let date = null
      // if(act.time){
      //   date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' }).format(act.time);
      // }
      return (
        <View key={act.data}>
          <HStack space={3} alignItems="center" maxWidth={width / 0.5} mt={3}>
            <View>
              <View
                style={{
                  backgroundColor: '#F0E1EB',
                  padding: 5,
                  borderRadius: 10,
                }}>
                <IconButton icon={<Icon name={'time-outline'} size={20} />} />
              </View>
            </View>
            <VStack maxWidth={width*0.75}>
              <Text style={{color: '#000000', fontWeight: 'bold', fontSize: 16}}>
                {act.header}
              </Text>
              <Text style={{color: '#395061', fontSize: 13}}>{act.data} {act.time ? new Date(act.time).toLocaleString() : null}</Text>
              {/* <Text style={{color:"#8C8C8C", fontSize:10}}>04 Oct 2021 at 5:01 PM</Text> */}
            </VStack>
          </HStack>
        </View>
      );
    });
  };

  return (
    <View style={styles.topContainer}>
      <Navbar props={AppBarContent} />
      <ScrollView style={styles.Container}>
        <View style={styles.Container}>
          <VStack mt={5}>{activity ? <RenderNotification /> : null}</VStack>
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountActivity;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    top: 0,
    backgroundColor: '#f5f5f5',
    height: height,
    width: width,
  },
  Container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});
