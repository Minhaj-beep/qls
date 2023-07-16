import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import BuyNow from '../BuyNow/BuyNow';
import IndependentAssessment from '../IndependentAssessment/IndependentAssessment';
import MyAssessments from '../IndependentAssessment/MyAssessments';
import ViewAssessment from '../IndependentAssessment/ViewAssessment';
import NotificationsManagement from '../components/Profile/NotificationManagement';
import ProfileNotification from '../Profile/ProfileNotification';
import JoinDemoClass from '../Courses/JoinDemoClass';
import MyCourses from '../MyCourses/MyCourses';
import SeeAll from '../components/SeeAll';
import ViewLiveCourse from '../Courses/ViewLiveCourse';
import ViewCategory from '../Categories/ViewCategories';
import MyMessages from '../MyMessages/MyMessages';
import { useEffect } from 'react';
import { setIsLoggedInBefore } from '../Redux/Features/authSlice'
import { useSelector, useDispatch } from 'react-redux';

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
      <Stack.Screen
       name="BuyNow"
       component={BuyNow}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="IndependentAssessment"
       component={IndependentAssessment}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="MyAssessments"
       component={MyAssessments}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="ViewAssessment"
       component={ViewAssessment}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="NotificationsManagement"
       component={NotificationsManagement}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="ProfileNotification"
       component={ProfileNotification}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="JoinDemoClass"
       component={JoinDemoClass}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="MyCourses"
       component={MyCourses}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="SeeAll"
       component={SeeAll}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="ViewLiveCourse"
       component={ViewLiveCourse}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="ViewCategory"
       component={ViewCategory}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
       name="MyMessages"
       component={MyMessages}
       options={{headerShown: false}}
       screenOptionStyle={screenOptionStyle}
      />
    </Stack.Navigator>
  );
};

const OnBoardingStack = () => {
  const isLoggedinBefore = useSelector(state => state.Auth.IsLoggedInBefore);

  return (
    <>
      {
          !isLoggedinBefore ?
          <Stack.Navigator initialRouteName={"CreateAccount"}>
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
          : 
          <Stack.Navigator initialRouteName={"Login"}>
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
      }
    </>
  );
};

export {AuthenticatedStack, OnBoardingStack};
