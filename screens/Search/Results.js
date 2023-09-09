import { StyleSheet, View,SafeAreaView,ScrollView,Dimensions,TouchableOpacity,FlatList } from 'react-native';
import React,{useState} from 'react';
import { Text,VStack,HStack,Input,FormControl,Actionsheet,Box,useDisclose,Select } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import RCCard from '../components/Courses/RCCard';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width, height } = Dimensions.get('window');

const Results = () => {
    const {
        isOpen,
        onOpen,
        onClose,
      } = useDisclose();
    const [SData, setSData] = useState();
  return (
    <View style={styles.container}>
       <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content >
            <Box w="100%" px={4} justifyContent="center">
                <Text fontSize="16" color="gray.500" _dark={{
                color: 'gray.300',
            }}>
                Filter
                </Text>
            </Box>
                    <VStack space={2}>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight:'bold'}}>Course Type</Text>
                        <Select placeholder="Course Type" variant="filled" bg={'greyScale.600'} borderRadius={15}>
                            <Select.Item label="Live Course" value="lc"/>
                            <Select.Item label="Recorded Course" value="rc"/>
                        </Select>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight:'bold'}}>Sub-Category</Text>
                        <Select placeholder="Sub-Category" variant="filled" bg={'greyScale.600'} borderRadius={15}>
                            <Select.Item label="UI/UX Design" value="lc"/>
                            <Select.Item label="Wireframe" value="rc"/>
                        </Select>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight:'bold'}}>Rating</Text>
                        <HStack space={2}>
                            <Text color={'primary.100'} bg={'secondary.50'} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}>Above 4.0</Text>
                            <Text color={'primary.100'} bg={'secondary.50'} borderRadius={20} pt={2} pb={2} pl={3} pr={3}  fontSize={10}>Above 4.5</Text>
                            <Text color={'primary.100'} bg={'secondary.50'} borderRadius={20}pt={2} pb={2} pl={3} pr={3} fontSize={10}>Above 3.0</Text>
                        </HStack>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight:'bold'}}>Price</Text>
                        <VStack style={{maxWidth:width / 1}}>
                            <MultiSlider
                            values={[20,40]}
                            min={10}
                            max={100}
                            step={1}
                            onValuesChange={(e)=>{
                                setSData(e);
                                console.log(e);
                            }}
                            isMarkersSeparated={true}
                            showSteps={true}
                            showStepMarkers={true}
                            selectedStyle={{backgroundColor:'#364b5b'}}
                            markerStyle={{backgroundColor:'#364b5b'}}
                            />
                            <HStack justifyContent={'space-between'} alignItems={'center'} pr={3}>
                                { SData ? <Text color={'greyScale.800'} fontSize={12} style={{fontWeight:'bold'}}>${SData[0]}</Text> : null}
                                { SData ? <Text color={'greyScale.800'} fontSize={12} style={{fontWeight:'bold'}}>${SData[1]}</Text> : null}
                            </HStack>
                        </VStack>
                    </VStack>


            </Actionsheet.Content>
       </Actionsheet>
        <ScrollView contentContainerStyle={styles.TopContainer} nestedScrollEnabled={true}>
        <Text color={'#000'} style={{fontSize:16, fontWeight:'bold'}} pt={2} pb={2}>Result for " Design "</Text>
        <HStack space={2} style={{maxWidth:width / 1.3}}>
            <FormControl>
                <Input
                variant="filled"
                bg="#f3f3f3"
                borderRadius={5}
                placeholder="Search"
                InputLeftElement={
                    <Icon
                        name={'search'}
                        size={20}
                        style={{ paddingLeft:10 }}
                        color="#364b5b"
                    />
                }
                />
             </FormControl>
                <TouchableOpacity onPress={onOpen} style={{alignItems:'center', justifyContent: 'center'}} >
                    <Icon name="filter-outline" size={20} color="#364b5b" style={{backgroundColor:'#f3f3f3', padding:12,borderRadius:5}}/>
                </TouchableOpacity>
        </HStack>

        <VStack pt={4}>
            <RCCard/>
        </VStack>
        </ScrollView>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#F1F1F1',
        height:height,
        width:width,
        flex: 1,
      },
      TopContainer:{
        flexGrow: 1,
        paddingBottom:70,
        padding:15,
      },
});
