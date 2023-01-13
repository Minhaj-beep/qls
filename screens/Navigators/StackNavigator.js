import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../OnBoarding/Login';
import CreateAccount from '../OnBoarding/CreateAccount';
import TabNavigator from './TabNavigator';
import ProfileDash from '../Profile/ProfileDash';
import Profile from '../Profile/Profile';
import AccountSettings from '../Profile/AccountSettings';
import AccountActivity from '../Profile/AccountActivity';
import Cart from '../Courses/Cart/Cart';
import SCView from '../Courses/SCView';
import InstructorProfile from '../Courses/InstructorProfile';
import LiveSCView from '../Courses/LiveSCView';
import Assessments from '../Assessment/Assessment';
import LiveClass from '../Courses/LiveClass';
import AssessmentList from '../Assessment/AssessmentList';
import PaymentHistory from '../Payment/PaymentHistory';
import Inbox from '../MNTab/Messages/Inbox'
import NotificationInbox from '../MNTab/Notifications/NotificationInbox'

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="ProfileDash"
        component={ProfileDash}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="AccountActivity"
        component={AccountActivity}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="SCView"
        component={SCView}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
       <Stack.Screen
        name="LiveSCView"
        component={LiveSCView}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="InstructorProfile"
       component={InstructorProfile}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="Assessments"
       component={Assessments}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="LiveClass"
       component={LiveClass}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="AssessmentList"
       component={AssessmentList}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="PaymentHistory"
       component={PaymentHistory}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="Inbox"
       component={Inbox}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="NotificationInbox"
       component={NotificationInbox}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
    </Stack.Navigator>
  );
};

const OnBoardingStack = () => {
  return (
    <Stack.Navigator initialRouteName="CreateAccount">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
    </Stack.Navigator>
  );
};

export {AuthenticatedStack, OnBoardingStack};
