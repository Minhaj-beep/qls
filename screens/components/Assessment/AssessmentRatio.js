import { StyleSheet, View,Dimensions } from 'react-native';
import React from 'react';
import { VStack,HStack,FormControl,Text,Radio } from 'native-base';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

const AssessmentRadio = ({props}) => {
    const [Answer, setAnswer] = React.useState('1');
    // console.log(props.assessmentChoice);
    const Choice = props.assessmentChoice;

    // const data = props.assessmentChoice;

    useEffect(() => {
      // let ans = props.assessmentAnswer;
      // console.log(ans);
      // const ansIndex = data.indexOf(ans);
      // let AlphaAns = ToAlphabet(ansIndex);
      // setAnswer(AlphaAns);
    },[]);

    const ToAlphabet = (index) => {
      const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      return alphabet[index];
    };


  return (
    <VStack space={2}>
      <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width / 1}} mt={4}>
        Question title
      </Text>
      <HStack space={6} m={2} justifyContent="space-between">
        <View>
          <Radio.Group size="sm" name="Radio01" colorScheme={'primary'}>
           {
            Choice.map((data, index)=> {
              return (
                <Radio value="1" my={1} key={index}>
                  {data}
                </Radio>
              );
            })
            }
          </Radio.Group>
        </View>
        <View>
          <Text style={{fontSize:12,borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>2 Points</Text>
        </View>
      </HStack>
    </VStack>
  );
};

export default AssessmentRadio;

const styles = StyleSheet.create({});
