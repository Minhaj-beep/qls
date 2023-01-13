import {StyleSheet, Text, View, Linking, Dimensions} from 'react-native';
import React from 'react';
// import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import RenderHtml from 'react-native-render-html';

const {width, height} = Dimensions.get('window');

const Overview = () => {
  const CourseDD = useSelector(state => state.Course.SCData);
  const CourseData = CourseDD.CDD;
  const renderersProps = {a: {onPress: onPress}};
  // console.log(CourseData.courseOverview);

  function onPress(event, href) {
    OpenLink(href);
  }

  const OpenLink = async props => {
    await Linking.openURL(props);
  };
  const OverviewSource = {
    html: `<head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          </head> 
          <body>${CourseData.courseOverview}</body>`,
  };
  return (
    <View style={styles.container}>
        {/* <RenderHtml
          contentWidth={width / 3}
          source={OverviewSource}
          renderersProps={renderersProps}
        /> */}
        <Text>Yeet</Text>
    </View>
  );
};

export default Overview;

const styles = StyleSheet.create({
  container: {
    padding:10,
  },
});
