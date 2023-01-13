import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HStack, IconButton, VStack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
// import {setLoading,setBankData} from '../redux-toolkit/features/userDataSlice';

const ProfileSettings = props => {
  const dispatch = useDispatch();
  const navigation = props.navigation;

  return (
    <VStack mt={4}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Profile</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs', {screen: 'Courses'})}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>My courses</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>My Assessments</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Messages</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Notification Management</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('AccountSettings')}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Account Settings</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>
{/* 
      <TouchableOpacity
        onPress={() => {
          // GetAccountInfo()
          navigation.navigate('Tabs', {screen: 'Home'});
        }}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Payment Methods</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => {
          // GetAccountInfo()
          navigation.navigate('PaymentHistory');
        }}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Payment History</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Help & Support</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  ProfileSettings: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ProfileText: {
    color: '#395061',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
