import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  View,
  StatusBar,
} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider, extendTheme, ScrollView} from 'native-base';
import {
  AuthenticatedStack,
  OnBoardingStack,
} from './screens/Navigators/StackNavigator';
import {store} from './screens/Redux/store';
import {Provider, useSelector, useDispatch} from 'react-redux';
import 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

const theme = extendTheme({
  colors: {
    primary: {
      50: '#395061',
      100: '#364b5b',
      600: '#395061',
    },
    secondary: {
      50: '#F0E1EB',
    },
    amber: {
      400: '#d97706',
    },
    white: {
      100: '#FFFFFF',
    },
    greyScale: {
      400: '#FCFCFC',
      600: '#F3F3F3',
      800: '#8C8C8C',
    },
    green: {
      100: '#29D363',
    },
    error: {
      100: '#F65656',
    },
    warning: {
      100: '#FFBE40',
    },
  },
});
// Auth Validation
const RootNavigation = () => {

  const Loading = useSelector(state => state.Auth.Loading);
  const LoggedIn = useSelector(state => state.Auth.LoggedIn);

  return (
    <NavigationContainer>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar animated={true} backgroundColor="#F1F1F1" barStyle="dark-content" />
          {LoggedIn ? <AuthenticatedStack /> : <OnBoardingStack />}
          {Loading ? (
            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
                color="#364b5b"
                style={styles.loader}
              />
            </View>
          ) : null}
        </GestureHandlerRootView>
    </NavigationContainer>
  );
};

const App = () => {

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <RootNavigation />
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F3',
    opacity: 0.5,
  },
  loader: {
    position: 'absolute',
  },
});
