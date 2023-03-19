import { View, Text, Input, Icon, HStack, Center, VStack, Image, Button, IconButton, useDisclose, Actionsheet, FormControl, Select, Box } from "native-base"
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, { useEffect, useState } from "react"
import {useSelector, useDispatch} from 'react-redux'
import AppBar from "../components/Navbar"
import { BaseURL } from "../StaticData/Variables"
import getAllIndependentAssessments from "../Functions/API/GetAllIndependentAssessments"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native"
import { setViewIndependentAssessmentCode } from "../Redux/Features/CourseSlice"
import GetSearchedIndependentAssessments from "../Functions/API/GetSearchedIndependentAssessments"

const {width, height} = Dimensions.get('window')

const IndependentAssessment = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const email = useSelector(state => state.Auth.Mail);
    const [allData, setAllData] = useState(null)
    const [searchedAssessments, setSearchedAssessments] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState(null)
    const [currentSubCategory, setCurrentSubCategory] = useState(null)
    const [currentAssessmentData, setCurrentAssessmentData] = useState([])
    const [pricese, setPriceses] = useState([])
    const [filter, setFilter] = useState(false)
    const [FeeStart, setFeeStart] = useState(0);
    const [FeeEnd, setFeeEnd] = useState(0);
    const [searchActive, setSearchActive] = useState(false)
    const [R1, setR1] = useState(false);
    const [R2, setR2] = useState(false);
    const [R3, setR3] = useState(false);
    const [R4, setR4] = useState(false);
    const [query, setQuery] = useState('')
    const {isOpen, onOpen, onClose} = useDisclose();

    useEffect(()=>{
        getAllActivatedAssessment()
    },[])

    useEffect(()=>{
        let arr = []
        let priceArray = []
        if(currentCategory !== null){
            allData.map((i)=>{
                if(i.catogory === currentCategory){
                    arr = [...arr, i.subCategory]
                    priceArray = [...priceArray, i.fee]
                }
            })
            let subC = arr.filter(function(item, pos) {
                return arr.indexOf(item) == pos;
            })
            setSubCategories(subC)
            let price = priceArray.filter(function(item, pos) {
                return priceArray.indexOf(item) == pos;
            })
            setPriceses(price)
            setFeeEnd(Math.max(...price))
            setFeeStart(Math.min(...price))
        } else {
            setSubCategories([])
            setPriceses([])
        }
    },[currentCategory])

    useEffect(()=>{
        if(query !== ''){
            getSearchedIndependentAssessments()
        }
    },[query])

    const AppBarContent = {
        title: '',
        navigation: navigation,
        ArrowVisibility: true,
    };

    const activeChip = { color: '#364b5b', backgroundColor: '#F0E1EB',}
    const NotActiveChip = { color: '#FFF', backgroundColor: '#364b5b', }

    const findCategories_SubCategoriesAndPriceses = (allData) => {
            let categoryArray = []
            allData.map((i)=>categoryArray = [...categoryArray, i.catogory])
            let category = categoryArray.filter(function(item, pos) {
                return categoryArray.indexOf(item) == pos;
            })
            setCategories(category)
    }

    const getAllActivatedAssessment = async () => {
        try {
            let response = await getAllIndependentAssessments(email)
            if (response.status === 200){
                setAllData(response.data)
                findCategories_SubCategoriesAndPriceses(response.data)
            } else {
                console.log('getAllActivatedAssessment', response.message)
            }
        } catch (e) {
            console.log('getAllActivatedAssessment', e)
        }
    }

    const ViewAssessment = (code) => {
        dispatch(setViewIndependentAssessmentCode(code))
        navigation.navigate('ViewAssessment')
    }


    const RenderCat = () => {
        let categoryArray = []
        allData.map((i)=>categoryArray = [...categoryArray, i.catogory])
        let arr = categoryArray.filter(function(item, pos) {
            return categoryArray.indexOf(item) == pos;
        })
        return arr.map((data, index) => {
          return (
            <TouchableOpacity onPress={() => {setSelectedCategory(data)}} key={index}>
              <HStack style={{padding: 5}} alignItems="center" justifyContent={'space-between'}>
                <Text color={'primary.50'} style={{fontWeight: 'bold'}}>{data}</Text>
                <Ionicons name="chevron-forward-outline" size={20} style={{padding: 5}} color={'#364b5b'}/>
              </HStack>
            </TouchableOpacity>
          );
        });
    };

    const RenderCategory = () => {
        return (
            <View>
                <Text color={'#000'} mt={7} style={{fontSize: 16, fontWeight: 'bold'}}>Categories</Text>
                {allData === null ? <></> :
                    <RenderCat />
                }
            </View>
        )
    }


    const getSearchedIndependentAssessments = async () => {
        try {
            let response = await GetSearchedIndependentAssessments(email, query)
            if (response.status === 200){
                setSearchedAssessments(response.data)
                console.log(Object.keys(response.data).length)
            } else {
                console.log('getAllActivatedAssessment', response.message)
            }
        } catch (e) {
            console.log('getAllActivatedAssessment', e)
        }
    }

    const applyFilter = () => {
        setFilter(true)
        let arr = []
        allData.map((item, index)=>{
            if(Object.keys(pricese).length < 2){
                if(currentSubCategory !== null) {
                    // console.log(item.category, currentCategory, item.subCategory, currentSubCategory)
                    if(item.catogory === currentCategory && item.subCategory === currentSubCategory){
                        console.log(item.subCategory)
                        arr = [...arr, item]
                    }
                } else {
                    if(item.catogory === currentCategory){
                        arr = [...arr, item]
                    }
                }
            } else {
                if (item.fee >= FeeStart && item.fee <= FeeEnd) {
                    if(currentSubCategory !== null) {
                        if(item.catogory === currentCategory && item.subCategory === currentSubCategory){
                            arr = [...arr, item]
                        }
                    } else {
                        if(item.catogory === currentCategory){
                            arr = [...arr, item]
                        }
                    }
                }
            }
        })
        console.log(Object.keys(arr).length)
        setCurrentAssessmentData(arr)
    }

    const displayFilteredData = () => {
        return (
            <View>
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Box w="100%" px={4} justifyContent="center">
                        <Text fontSize="16" color="gray.500"  _dark={{ color: 'gray.300',}}>Filter</Text>
                    </Box>
                    <VStack alignItems={'center'} transparent={true} animationType={'fade'}>
                    <VStack space={2} w={'90%'} mt={4}>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>Category</Text>
                        <Select
                        onValueChange={Value => {
                            setCurrentCategory(Value)
                            // GetSubCategories();
                        }} defaultValue={currentCategory}  placeholder="Category" variant="filled" bg={'greyScale.600'} borderRadius={15}>
                        <Select.Item label="None" value="NIL" />
                        {Object.keys(categories).length > 0
                            ? categories.map((data, index) => {
                                return (
                                <Select.Item
                                    key={index}
                                    label={data}
                                    value={data}
                                />
                                );
                            })
                            : null}
                        </Select>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>Sub-Category</Text>
                        <Select
                        onValueChange={Value => {
                            setCurrentSubCategory(Value);
                        }}  placeholder="Sub-Category" variant="filled" bg={'greyScale.600'} borderRadius={15}>
                            <Select.Item label="None" value="NIL" />
                            {Object.keys(subCategories).length > 0
                                ? subCategories.map((data, index) => {
                                    return (
                                        <Select.Item key={index} label={data} value={data}/>
                                    );
                                })
                                : null}
                        </Select>
                        {/* <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>Rating</Text>
                        <HStack space={2}>
                        <Text
                            style={R1 ? activeChip : NotActiveChip} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}
                            onPress={() => {
                            // setRate(2);
                            // setRatingValue(2);
                            }}>Above 2.0</Text>
                        <Text
                            style={R2 ? activeChip : NotActiveChip} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}
                            onPress={() => {
                            // setRate(3);
                            // setRatingValue(3);
                            }}>Above 3.0</Text>
                        <Text
                            style={R3 ? activeChip : NotActiveChip} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}
                            onPress={() => {
                            // setRate(4);
                            // setRatingValue(4);
                            }}>Above 4.0</Text>
                        <Text
                            style={R4 ? activeChip : NotActiveChip} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}
                            onPress={() => {
                            // setRate(0);
                            // setRatingValue(0);
                            }}>None</Text>
                        </HStack> */}
                        <VStack style={{maxWidth: width / 1}}>
                        {   Object.keys(pricese).length < 2 ? <></> : <>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>Price</Text>
                        
                                <MultiSlider
                                values={[FeeStart, FeeEnd]}
                                min={Math.min(...pricese)}
                                max={Math.max(...pricese)}
                                step={1}
                                onValuesChange={e => {
                                // setSData(e);
                                setFeeStart(e[0]);
                                setFeeEnd(e[1]);
                                // console.log(e);
                                }}
                                isMarkersSeparated={true}
                                showSteps={true}
                                showStepMarkers={true}
                                selectedStyle={{backgroundColor: '#364b5b'}}
                                markerStyle={{backgroundColor: '#364b5b'}}
                            />
                        
                        <HStack justifyContent={'space-between'} alignItems={'center'} pr={3}>
                            <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>₹{FeeStart}</Text>
                            <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>₹{FeeEnd}</Text>
                        </HStack>
                        </>}

                        <HStack justifyContent={'space-evenly'} mt={4}>
                            <Button onPress={() => {
                                setCurrentCategory(null)
                                setCurrentSubCategory(null)
                                onClose(true)
                                
                            }} _text={{color: '#364b5b', fontSize: 12}} bg={'greyScale.600'} pl={10} pr={10}> Clear</Button>
                            <Button onPress={() => {
                                applyFilter()
                                onClose(true)
                            }} colorScheme={'primary'}  _text={{fontSize: 12}} pl={10} pr={10}>Apply</Button>
                        </HStack>
                        </VStack>
                    </VStack>
                    </VStack>
                </Actionsheet.Content>
                </Actionsheet>
                <HStack justifyContent={'space-between'}>
                    <IconButton icon={<Ionicons name={'filter-outline'} size={15} color="#364b5b" />}
                    onPress={onOpen}
                    bg={'#FFFF'} mt={2} />
                    <TouchableOpacity onPress={() => {
                        setSelectedCategory(null)
                        // setSearchActive(false);
                        // ResetFilter();
                        // setCNS('');
                        // dispatch(setSearchData(''));
                        // dispatch(setSearchA(false));
                    }} style={{padding: 5, marginTop: 10}}>
                        <Text color={'primary.100'} style={{ fontSize: 13, fontWeight: 'bold', textDecorationLine: 'underline',}} alignSelf={'flex-end'}>Clear</Text>
                    </TouchableOpacity>
                </HStack>
                {currentAssessmentData.map((data, index) => {
                    
                        const currency = data.currency === 'INR' ? '₹' : '$';
                        return (
                            <TouchableOpacity onPress={()=>ViewAssessment(data.assessmentCode)} key={index}>
                            <HStack style={styles.CourseCard} space={4} mt={2}>
                                <Center>
                                    <Ionicons name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={30} />
                                </Center>
                                <VStack style={styles.CardContent} space={1}>
                                    <HStack justifyContent="space-between" alignItems="center" space={2}>
                                        <Text noOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', color: '#000000', maxWidth: width * 0.75,}}>{data.assessmentTitle}</Text>
                                    </HStack>
                                    <HStack space={2} alignItems={'center'}>
                                        <HStack space={1} alignItems={'center'}>
                                            <Image alt="graduate icon" source={require('../../assets/Home/graduate_student.png')} size="3" />
                                            <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>{data.learnersCount ? data.learnersCount : '0'} Learners</Text>
                                        </HStack>
                                    </HStack>
                                    <HStack alignItems="center" justifyContent={'space-between'}>
                                        <HStack space={2}>
                                            <Text color={'greyScale.800'} style={{fontSize: 10, fontWeight: '600'}}>Fee</Text>
                                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000000'}}>{currency}{data.fee}</Text>
                                        </HStack>
                                    </HStack>
                                </VStack>
                            </HStack>
                            </TouchableOpacity>
                        );
                })}
            </View>
        )
    }

    const getSearchedAssessments = () => {
        if(Object.keys(searchedAssessments).length > 0){
            return (
                searchedAssessments.map((data, index)=> {
                    return (
                        <TouchableOpacity onPress={()=>ViewAssessment(data.assessmentCode)} key={index}>
                        <HStack style={styles.CourseCard} space={4} mt={2}>
                            <Center>
                                <Ionicons name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={30} />
                            </Center>
                            <VStack style={styles.CardContent} space={1}>
                                <HStack justifyContent="space-between" alignItems="center" space={2}>
                                    <Text noOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', color: '#000000', maxWidth: width * 0.75,}}>{data.assessmentTitle}</Text>
                                </HStack>
                                <HStack space={2} alignItems={'center'}>
                                    <HStack space={1} alignItems={'center'}>
                                        <Image alt="graduate icon" source={require('../../assets/Home/graduate_student.png')} size="3" />
                                        <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>{data.learnersCount ? data.learnersCount : '0'} Learners</Text>
                                    </HStack>
                                </HStack>
                                <HStack alignItems="center" justifyContent={'space-between'}>
                                    <HStack space={2}>
                                        <Text color={'greyScale.800'} style={{fontSize: 10, fontWeight: '600'}}>Fee</Text>
                                        <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000000'}}>{data.currency}{data.fee}</Text>
                                    </HStack>
                                </HStack>
                            </VStack>
                        </HStack>
                        </TouchableOpacity>
                    )
                })
            )
        } else {
            return (
                <VStack mt={1}>
                    <Text style={{fontSize:13, alignSelf:"center", borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>No questions to show!</Text>
                </VStack>
            )
        }
    }

    const showAssessmentsForSelectedCategory = () => {
        return (
            <View>
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Box w="100%" px={4} justifyContent="center">
                        <Text fontSize="16" color="gray.500"  _dark={{ color: 'gray.300',}}>Filter</Text>
                    </Box>
                    <VStack alignItems={'center'} transparent={true} animationType={'fade'}>
                    <VStack space={2} w={'90%'} mt={4}>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>Category</Text>
                        <Select
                        onValueChange={Value => {
                            setCurrentCategory(Value)
                            // GetSubCategories();
                        }} defaultValue={currentCategory}  placeholder="Category" variant="filled" bg={'greyScale.600'} borderRadius={15}>
                        <Select.Item label="None" value="NIL" />
                        {Object.keys(categories).length > 0
                            ? categories.map((data, index) => {
                                return (
                                <Select.Item
                                    key={index}
                                    label={data}
                                    value={data}
                                />
                                );
                            })
                            : null}
                        </Select>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>Sub-Category</Text>
                        <Select
                        onValueChange={Value => {
                            setCurrentSubCategory(Value);
                        }}  placeholder="Sub-Category" variant="filled" bg={'greyScale.600'} borderRadius={15}>
                            <Select.Item label="None" value="NIL" />
                            {Object.keys(subCategories).length > 0
                                ? subCategories.map((data, index) => {
                                    return (
                                        <Select.Item key={index} label={data} value={data}/>
                                    );
                                })
                                : null}
                        </Select>
                        {/* <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>Rating</Text>
                        <HStack space={2}>
                        <Text
                            style={R1 ? activeChip : NotActiveChip} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}
                            onPress={() => {
                            // setRate(2);
                            // setRatingValue(2);
                            }}>Above 2.0</Text>
                        <Text
                            style={R2 ? activeChip : NotActiveChip} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}
                            onPress={() => {
                            // setRate(3);
                            // setRatingValue(3);
                            }}>Above 3.0</Text>
                        <Text
                            style={R3 ? activeChip : NotActiveChip} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}
                            onPress={() => {
                            // setRate(4);
                            // setRatingValue(4);
                            }}>Above 4.0</Text>
                        <Text
                            style={R4 ? activeChip : NotActiveChip} borderRadius={20} pt={2} pb={2} pl={3} pr={3} fontSize={10}
                            onPress={() => {
                            // setRate(0);
                            // setRatingValue(0);
                            }}>None</Text>
                        </HStack> */}
                        <VStack style={{maxWidth: width / 1}}>
                        {   Object.keys(pricese).length < 2 ? <></> : <>
                        <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>Price</Text>
                        
                                <MultiSlider
                                values={[FeeStart, FeeEnd]}
                                min={Math.min(...pricese)}
                                max={Math.max(...pricese)}
                                step={1}
                                onValuesChange={e => {
                                // setSData(e);
                                setFeeStart(e[0]);
                                setFeeEnd(e[1]);
                                // console.log(e);
                                }}
                                isMarkersSeparated={true}
                                showSteps={true}
                                showStepMarkers={true}
                                selectedStyle={{backgroundColor: '#364b5b'}}
                                markerStyle={{backgroundColor: '#364b5b'}}
                            />
                        
                        <HStack justifyContent={'space-between'} alignItems={'center'} pr={3}>
                            <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>₹{FeeStart}</Text>
                            <Text color={'greyScale.800'} fontSize={12} style={{fontWeight: 'bold'}}>₹{FeeEnd}</Text>
                        </HStack>
                        </>}

                        <HStack justifyContent={'space-evenly'} mt={4}>
                            <Button onPress={() => {
                                setCurrentCategory(null)
                                setCurrentSubCategory(null)
                                onClose(true)
                            }} _text={{color: '#364b5b', fontSize: 12}} bg={'greyScale.600'} pl={10} pr={10}> Clear</Button>
                            <Button onPress={() => {
                                applyFilter()
                                onClose(true)
                            }} colorScheme={'primary'}  _text={{fontSize: 12}} pl={10} pr={10}>Apply</Button>
                        </HStack>
                        </VStack>
                    </VStack>
                    </VStack>
                </Actionsheet.Content>
                </Actionsheet>
                <HStack justifyContent={'space-between'}>
                    <IconButton icon={<Ionicons name={'filter-outline'} size={15} color="#364b5b" />}
                    onPress={onOpen}
                    bg={'#FFFF'} mt={2} />
                    <TouchableOpacity onPress={() => {
                        setSelectedCategory(null)
                        // setSearchActive(false);
                        // ResetFilter();
                        // setCNS('');
                        // dispatch(setSearchData(''));
                        // dispatch(setSearchA(false));
                    }} style={{padding: 5, marginTop: 10}}>
                        <Text color={'primary.100'} style={{ fontSize: 13, fontWeight: 'bold', textDecorationLine: 'underline',}} alignSelf={'flex-end'}>Clear</Text>
                    </TouchableOpacity>
                </HStack>
                {allData.map((data, index) => {
                    if(data.catogory === selectedCategory){
                        const currency = data.currency === 'INR' ? '₹' : '$';
                        return (
                            <TouchableOpacity onPress={()=>ViewAssessment(data.assessmentCode)} key={index}>
                            <HStack style={styles.CourseCard} space={4} mt={2}>
                                <Center>
                                    <Ionicons name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={30} />
                                </Center>
                                <VStack style={styles.CardContent} space={1}>
                                    <HStack justifyContent="space-between" alignItems="center" space={2}>
                                        <Text noOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', color: '#000000', maxWidth: width * 0.75,}}>{data.assessmentTitle}</Text>
                                    </HStack>
                                    <HStack space={2} alignItems={'center'}>
                                        <HStack space={1} alignItems={'center'}>
                                            <Image alt="graduate icon" source={require('../../assets/Home/graduate_student.png')} size="3" />
                                            <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>{data.learnersCount ? data.learnersCount : '0'} Learners</Text>
                                        </HStack>
                                    </HStack>
                                    <HStack alignItems="center" justifyContent={'space-between'}>
                                        <HStack space={2}>
                                            <Text color={'greyScale.800'} style={{fontSize: 10, fontWeight: '600'}}>Fee</Text>
                                            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000000'}}>{currency}{data.fee}</Text>
                                        </HStack>
                                    </HStack>
                                </VStack>
                            </HStack>
                            </TouchableOpacity>
                        );
                    }
                })}
            </View>
        )
    }

    const getOutput = () => {
        if (query !== ''){
            getSearchedAssessments() 
        } else {
            if (Object.keys(currentAssessmentData).length > 0) {
                displayFilteredData()
            } else {
                if (selectedCategory !== null){
                    showAssessmentsForSelectedCategory()
                } else {
                    RenderCategory()
                }
            }
        }
    }
 
    return (
        <View>
            <AppBar props={AppBarContent} />
            <Input onChangeText={(text)=> {
                setQuery(text.trim())
            }} placeholder="Search" width="95%" alignSelf={"center"} marginTop={1} borderRadius="4" py="0" px="1" fontSize="11" fontWeight={"500"} InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
            <View style={{width:"95%", alignSelf:"center"}}>
                {query !== '' ? getSearchedAssessments() :
                    <View>
                        {
                            Object.keys(currentAssessmentData).length > 0 ?
                            <>{displayFilteredData()}</>
                            :
                            <View>
                                {selectedCategory !== null ? showAssessmentsForSelectedCategory() : RenderCategory() }
                            </View>
                        }
                    </View>
                }
            </View>
        </View>
    )
}

export default IndependentAssessment

const styles = StyleSheet.create({
    CourseCard: {
      maxHeight: height / 8.5,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      shadowColor: 'rgba(0, 0, 0, 0.03)',
      shadowOffset: {
        width: 0,
        height: 0.376085489988327,
      },
      shadowRadius: 22,
      shadowOpacity: 1,
      padding: 10,
    },
    cardImg: {
      height: height / 11,
      width: width / 3.2,
      borderRadius: 5,
    },
    CardContent: {
      minWidth: width / 1.7,
    },
  });