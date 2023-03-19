import {StyleSheet, View,Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HStack, VStack, Text,Container} from 'native-base';
import {GetFAQ} from '../../Functions/API/GetFAQ';
import {useSelector,useDispatch} from 'react-redux';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Ionicons';
import { setLoading } from '../../Redux/Features/authSlice';

const {width, height} = Dimensions.get('window');

const FAQ = () => {
  const CourseDD = useSelector(state => state.Course.SCData);
  const CourseData = CourseDD.CDD;  const email = useSelector(state => state.Auth.Mail);
  const [FAQD, setFAQD] = useState();
  const [Answers, setAnswers] = useState();
  const [ActiveSessions, setActiveSessions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    SetDiff();
  }, [CourseData]);

  const SetDiff = async () => {
    if (CourseData) {
      if (CourseData.isLive === true) {
        GetFAQData(email, CourseData.liveCourseCode);
      } else {
        GetFAQData(email, CourseData.courseCode);
      }
    }
  };

  const GetFAQData = async (mail, code) => {
    try {
      let response = await GetFAQ(mail, code);
      if (response.status === 200) {
        console.log('FAQ retrieved successfully');
        let data = response.data;
        if (data.length !== 0) {
          let faq = data[0].faqList;
          if (faq.length !== 0){
            setFAQD(faq);
          }
        }
      } else {
        console.log("GetFAQData error: " + response.message);
        // alert("GetFAQData error: " + response.message);
      }
    } catch (err) {
      console.log("GetFAQData error: " + err.message);
      // alert("GetFAQData error: " + err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const CHeader = (data, index) => {
    return (
      <VStack space={1} style={styles.header}>
        <HStack alignItems={'center'} justifyContent={'space-between'}>
          <Text color={'primary.100'} fontSize={14} fontWeight={'bold'} maxW={width / 1.5}>
            {data.question}
          </Text>
          <Icon
            name={
              index === ActiveSessions[0]
                ? 'chevron-up-outline'
                : 'chevron-down-outline'
            }
            size={20}
            color="#000"
          />
        </HStack>
      </VStack>
    );
  };

  const CBody = (data) => {
    return (
      <Container m={2} style={styles.body} maxW={width / 1.2}>
        <Text color="greyScale.800">
          {data.answer}
        </Text>
      </Container>
    );
  };

  const CollapsibleChange = active => {
    setActiveSessions(active);
    setAnswers(FAQD[active]);
  };

  return (
    <View style={styles.container}>
      { FAQD ?
        <Accordion
          sections={FAQD}
          activeSections={ActiveSessions}
          renderHeader={CHeader}
          renderContent={CBody}
          onChange={CollapsibleChange}
          underlayColor={'#F3F3F3'}
          sectionContainerStyle	={styles.sectionContainerStyle}
        />
      : <Text m={2} color={'greyScale.800'} fontSize={12} alignSelf={'center'}>No FAQs</Text>
      }

    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container:{
    padding:15,
  },
  sectionContainerStyle:{
    backgroundColor:'#F3F3F3',
    marginBottom:5,
    borderRadius:7,
    padding:5,
  },
  header:{
    backgroundColor:'#F3F3F3',
    borderRadius:7,
    padding:5,
  },
});
