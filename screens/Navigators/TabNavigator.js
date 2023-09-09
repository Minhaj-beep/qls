import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Badge} from 'native-base';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


import Home from '../Home';
import Search from '../Search/Search';
import Results from '../Search/Results';
import Courses from '../Courses/Courses';
import MNotification from '../MNTab/MNotification';
import Wishlist from '../Wishlist';

const Img01 = require('../../assets/BottomNav/01.png');
const Img02 = require('../../assets/BottomNav/02.png');
const Img03 = require('../../assets/BottomNav/03.png');
const Img04 = require('../../assets/BottomNav/04.png');
const Img05 = require('../../assets/BottomNav/05.png');

const Img11 = require('../../assets/BottomNav/11.png');
const Img12 = require('../../assets/BottomNav/12.png');
const Img13 = require('../../assets/BottomNav/13.png');
const Img14 = require('../../assets/BottomNav/14.png');
const Img15 = require('../../assets/BottomNav/15.png');

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const SearchStack = () => {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: '#395061',
        tabBarInactiveTintColor: '#8C8C8C',
        tabBarStyle: {
          paddingBottom: 2,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowRadius: 25,
          shadowOpacity: 1,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                resizeMode={'contain'}
                source={focused ? Img11 : Img01}
                alt="nav"
                style={focused ? styles.NavImgActive : styles.NavImg}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Search',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                resizeMode={'contain'}
                source={focused ? Img12 : Img02}
                alt="nav"
                style={focused ? styles.NavImgActive : styles.NavImg}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Courses"
        component={Courses}
        options={{
          headerShown: false,
          tabBarLabel: 'Courses',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                resizeMode={'contain'}
                source={focused ? Img13 : Img03}
                alt="nav"
                style={focused ? styles.NavImgActive : styles.NavImg}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={MNotification}
        options={{
          headerShown: false,
          tabBarLabel: 'Notifications',
          tabBarIcon: ({focused}) => {
            return (
              <Image
                resizeMode={'contain'}
                source={focused ? Img14 : Img04}
                alt="nav"
                style={focused ? styles.NavImgActive : styles.NavImg}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          headerShown: false,
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({focused}) => {
            return (
              <>
              <Badge // bg="red.400"
                  bg="primary.100"
                  rounded="full"
                  bottom={7}
                  left={-12}
                  position={'absolute'}
                  zIndex={1}
                  variant="solid"
                  alignSelf="flex-end"
                  _text={{
                    fontSize: 7,
                  }}>
                  {7}
                </Badge>
              <Image
                resizeMode={'contain'}
                source={focused ? Img15 : Img05}
                alt="nav"
                style={focused ? styles.NavImgActive : styles.NavImg}
              />
              </>
              
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  NavImg: {
    //   height:20,
    //   width:20,
    maxHeight: 21,
    maxWidth: 21,
  },
  NavImgActive: {
    //   height:20,
    //   width:20,
    maxHeight: 21,
    maxWidth: 21,
    //   marginBottom:3,
  },
});
