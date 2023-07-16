import { View, Text, Input, Icon, HStack, Center, VStack, Image, Button, IconButton, useDisclose, Actionsheet, FormControl, Select, Box, ScrollView, useToast } from "native-base"
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
import GetCategories from "../Functions/API/GetCategories";
import GetSubcategoriesByCategoryCode from "../Functions/API/GetSubCategoriesByCategoryCode";
import { AddToCartAssessment } from "../Functions/API/AddToCartAssessment";
import { setBuyNowCourse } from "../Redux/Features/CourseSlice";
import { GetPurchasedCourses } from "../Functions/API/GetPurchasedCourses";

const {width, height} = Dimensions.get('window')

const IndependentAssessment = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const toast = useToast()
    const email = useSelector(state => state.Auth.Mail);
    const [allAssessments, setAllAssessments] = useState([])
    const [allData, setAllData] = useState([])
    const [allCategories, setAllCategories] = useState(null)
    const [categoryCode, setCategoryCode] = useState(null)
    const [searchedAssessments, setSearchedAssessments] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categories, setCategories] = useState([])
    const [allSubCategories, setAllSubCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState(null)
    const [currentSubCategory, setCurrentSubCategory] = useState(null)
    const [currentAssessmentData, setCurrentAssessmentData] = useState([])
    const [allPurchagedCourses, setAllPurchagedCourses] = useState([])
    const [pricese, setPriceses] = useState([])
    const [filter, setFilter] = useState(false)
    const [FeeStart, setFeeStart] = useState(0);
    const [FeeEnd, setFeeEnd] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false)
    const [searchActive, setSearchActive] = useState(false)
    const [R1, setR1] = useState(false);
    const [R2, setR2] = useState(false);
    const [R3, setR3] = useState(false);
    const [R4, setR4] = useState(false);
    const [query, setQuery] = useState('')
    const {isOpen, onOpen, onClose} = useDisclose();
    const activeChip = { color: '#364b5b', backgroundColor: '#F0E1EB',}
    const NotActiveChip = { color: '#FFF', backgroundColor: '#364b5b', }

    useEffect(()=>{
        getAllCategories()
        getAllActiveAssessments()
    },[]) // getting all the categories and all active assessments 

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getPurchagesItemsCourseCode()
        });
        return unsubscribe;
    },[navigation]) // getting all purchaged assessments when component in focus

    useEffect(()=>{
        if(query !== ''){
            searchAsssessment()
        }
    },[query])

    useEffect(()=>{
        if(currentCategory !== null){
            let priceArray = []
            let code = null
            allCategories.map((i)=>{
                if(currentCategory === i.categoryName){
                    getSubCategory(i.categoryCode)
                    code = i.categoryCode
                    setCategoryCode(code)
                }
            })

            allAssessments.map((j)=>{
                if(j.catogory === code){
                    priceArray = [...priceArray, j.fee]
                }
            })
            let price = priceArray.filter(function(item, pos) {
                return priceArray.indexOf(item) == pos;
            })
            setPriceses(price)
            setFeeEnd(Math.max(...price))
            setFeeStart(Math.min(...price))            
        }
    },[currentCategory])

    //get Categories
    const getAllCategories = async() => {
        try {
            let response = await GetCategories(email)
            if (response.status === 200){
                setAllCategories(response.data)
                let arr = []
                response.data.map((i)=>{
                    arr = [...arr, i.categoryName]
                })
                setCategories(arr)
            } else {
                console.log('getAllActivatedAssessment', response.message)
            }
        } catch (e) {
            console.log('getAllActivatedAssessment', e)
        }
    }

    // get sub categories by category code
    const getSubCategory = async (code) => {
        try {
            let response = await GetSubcategoriesByCategoryCode(email, code)
            if (response.status === 200){
                console.log(response.data)
                setAllSubCategories(response.data)
                if(response.data !== null){
                    let arr = []
                    response.data.map((i)=>{
                        arr = [...arr, i.subCategoryName]
                    })
                    setSubCategories(arr)
                }
            } else {
                console.log('getAllActivatedAssessment', response.message)
            }
        } catch (e) {
            console.log('getAllActivatedAssessment', e)
        }
    }

    // get All the active assessments
    const getAllActiveAssessments = async () => {
        let arr = []
        try {
            let response = await getAllIndependentAssessments(email)
            if (response.status === 200){
                if(Object.keys(response.data).length > 0) {
                    response.data.map(i => {
                        if(i.assessmentStatus === "ACTIVE") {
                            arr = [...arr, i]
                        }
                        if(i.assessmentQuestion === 'Get Blessings without Praying') console.log(i, '=======================================')
                        console.log(i, '=======================================')
                    })
                }
                setAllAssessments(arr)
                console.log(arr, '++++++++++++++++++++++++++++++++++++++++++++++++++++')
                setIsLoaded(true)
            } else {
                console.log('getAllActivatedAssessment error 1: ', response.message)
                getAllActiveAssessments()
            }
        } catch (e) {
            console.log('getAllActivatedAssessment error 2: ', e)
            getAllActiveAssessments()
        }
    }

    // Get all purchaged assessments course code to filter between purchaged and non purchaged assessments
    const getPurchagesItemsCourseCode = async() => {
        try {
            let response = await GetPurchasedCourses(email)
            if (response.status === 200){
                let arr = []
                response.data.map((i)=>{
                    if(i.assessmentCode){
                        arr = [...arr, i.assessmentCode]
                    }
                })
                console.log(arr, 'Purchaged items')
                setAllPurchagedCourses(arr)
            } else {
                console.log('getPurchagesHistory 1', response.message)
            }
        } catch (e) {
            console.log('getPurchagesHistory 2', e)
        }
    }

    // get serached assessments by title
    const searchAsssessment = async() => {
        try {
            let response = await GetSearchedIndependentAssessments(email, query)
            if (response.status === 200){
                setAllData(response.data)
                console.log(response.data)
            } else {
                console.log('getAllActivatedAssessment', response.message)
            }
        } catch (e) {
            console.log('getAllActivatedAssessment', e)
        }
    }

    //Add to cart
    const AddTC = async (code) => {
        try {
          let cart = await AddToCartAssessment(email, code);
          if (cart.status === 200) {
            toast.show({
              description: cart.message,
            });
          } else {
            toast.show({
              description: cart.message,
            });
            console.log(cart.message);
          }
        } catch (e) {
    
        }
    };

    // get All items to render by selecting categories
    const getItems = (selectedCategory) => {
        if(Object.keys(allAssessments).length > 0){
            console.log('selectedCategory', selectedCategory)
            if(selectedCategory !== null){
                let arr = []
                // console.log('selectedCategory', selectedCategory)
                allAssessments.map((i)=>{
                    console.log(i)
                    if(i.catogory === selectedCategory.categoryCode){
                        arr = [...arr, i]
                    }
                })
                console.log(arr, 'get All items to render by selecting categories')
                setAllData(arr)
                // showSelectedCate.gory(arr)
            }
        } else {
            getItems(selectedCategory)
        }
    }

    // render all categories
    const RenderCategory = () => {
        return (
            <View>
                {allCategories === null ? <></> :
                    <>
                    <Text color={'#000'} mt={7} style={{fontSize: 16, fontWeight: 'bold'}}>Categories</Text>
                    {
                        allCategories.map((data, index) => {
                            return (
                              <TouchableOpacity onPress={() => {
                                setSelectedCategory(data)
                                getItems(data)
                              }} key={index}>
                                <HStack style={{padding: 5}} alignItems="center" justifyContent={'space-between'}>
                                  <Text color={'primary.50'} style={{fontWeight: 'bold'}}>{data.categoryName}</Text>
                                  <Ionicons name="chevron-forward-outline" size={20} style={{padding: 5}} color={'#364b5b'}/>
                                </HStack>
                              </TouchableOpacity>
                            );
                        })
                    }
                    </>
                }
            </View>
        )
    }

    //apply filter 
    const applyFilter = () => {
        // console.log(currentSubCategory)
        let subC = null
        allSubCategories.map((i)=>{
            if(i.subCategoryName === currentSubCategory){
                subC = i.subCategoryCode
                console.log(categoryCode, currentSubCategory, i.subCategoryName , '>-------------------------------<')
            }
        })
        setFilter(true)
        let arr = []
        allAssessments.map((item, index)=>{
            if(Object.keys(pricese).length < 2){
                console.log('--------------------------------->', item.category, currentCategory, item.subCategory, currentSubCategory)
                if(currentSubCategory !== null) {
                    if(item.catogory === categoryCode && item.subCategory === subC){
                        console.log(item.subCategory)
                        arr = [...arr, item]
                    }
                } else {
                    if(item.catogory === categoryCode){
                        arr = [...arr, item]
                    }
                }
            } else {
                if (item.fee >= FeeStart && item.fee <= FeeEnd) {
                    if(currentSubCategory !== null) {
                        console.log(item.fee, FeeStart, FeeEnd, categoryCode, 'ITEM===================================')
                        if(item.catogory === categoryCode && item.subCategory === subC){
                            arr = [...arr, item]
                        }
                    } else {
                        if(item.catogory === categoryCode){
                            arr = [...arr, item]
                        }
                    }
                }
            }
        })
        console.log(Object.keys(arr).length)
        console.log(arr)
        setAllData(arr)
    }

    // render current selected category items
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
                    onPress={() => {
                        onOpen(true)
                        setCurrentSubCategory(null)
                    }}
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
                {
                    Object.keys(allData).length > 0 ? 
                    <View>
                        {allData.map((data, index) => {
                        // if(data.catogory === selectedCategory){
                            const currency = data.currency === 'INR' ? '₹' : '$';
                            return (
                                <TouchableOpacity onPress={()=>{console.log(data)}} key={index}>
                                {
                                    data.assessmentStatus === 'ACTIVE' ?
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
                                                    {/* <Image alt="graduate icon" source={require('../../assets/Home/graduate_student.png')} size="3" /> */}
                                                    <Text style={{fontSize: 10, fontWeight: '600'}} color={'greyScale.800'}>By :</Text>
                                                    <Text style={{fontSize: 11, fontWeight: '600'}} color={'greyScale.800'}>{data.instructorName}</Text>
                                                </HStack>
                                            </HStack>
                                            <HStack alignItems="center" justifyContent={'space-between'}>
                                                <HStack space={2}>
                                                    <Text color={'greyScale.800'} style={{fontSize: 10, fontWeight: '600'}}>Fee</Text>
                                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: '#000000'}}>{currency}{data.fee}</Text>
                                                </HStack>
                                            </HStack>
                                        </VStack>
                                        {
                                            allPurchagedCourses.includes(data.assessmentCode) ? null :
                                            <VStack mr={3} alignItems={'center'}>
                                                <Ionicons onPress={()=>AddTC(data.assessmentCode)} name="ios-cart-outline" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={25} />
                                                <Text onPress={()=>{
                                                    dispatch(setBuyNowCourse(data))
                                                    navigation.navigate('BuyNow')
                                                }} noOfLines={1} mt={1} style={{ fontSize: 14, paddingVertical:5, paddingHorizontal:8, backgroundColor: '#F0E1EB', fontWeight: 'bold', color: '#000000', maxWidth: width * 0.75,}}>Buy now</Text>
                                            </VStack>
                                        }
                                    </HStack>
                                    : null
                                }
                                </TouchableOpacity>
                            );
                        // }
                    })}
                    </View>
                    :
                    <View>
                        <Text mt={5} style={{fontSize:13, alignSelf:"center", borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>No Assessment found!</Text>
                    </View>
                }
            </View>
        )
    }

    //render search assessments
    const getSearchedAssessments = () => {
        if(Object.keys(allData).length > 0){
            return (
                allData.map((data, index)=> {
                    return (
                        <TouchableOpacity onPress={()=>{console.log(data)}} key={index}>
                        <>
                        {
                        data.assessmentStatus === 'ACTIVE' ?
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
                            {
                                allPurchagedCourses.includes(data.assessmentCode) ? null :
                                <VStack mr={3} alignItems={'center'}>
                                    <Ionicons onPress={()=>AddTC(data.assessmentCode)} name="ios-cart-outline" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={25} />
                                    <Text onPress={()=>{
                                        dispatch(setBuyNowCourse(data))
                                        navigation.navigate('BuyNow')
                                    }} noOfLines={1} mt={1} style={{ fontSize: 14, paddingVertical:5, paddingHorizontal:8, backgroundColor: '#F0E1EB', fontWeight: 'bold', color: '#000000', maxWidth: width * 0.75,}}>Buy now</Text>
                                </VStack>
                            }
                        </HStack>
                        : null
                        }
                        </>
                        </TouchableOpacity>
                    )
                })
            )
        } else {
            return (
                <VStack mt={5}>
                    <Text style={{fontSize:13, alignSelf:"center", borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>No Assessment found!</Text>
                </VStack>
            )
        }
    }

    
    const AppBarContent = {
        title: '',
        navigation: navigation,
        ArrowVisibility: true,
    };
    
    return (
        <View style={{flex:1}}>
            <AppBar props={AppBarContent} />
            {
                isLoaded ? // checking if all assessmets are loaded or not
                <>
                    <Input onChangeText={(text)=> {
                        setQuery(text.trim())
                    }} placeholder="Search" width="95%" alignSelf={"center"} marginTop={1} borderRadius="4" py="0" px="1" fontSize="11" fontWeight={"500"} InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
                    <ScrollView style={{width:"95%", alignSelf:"center"}}>
                        {query !== '' ? getSearchedAssessments() :
                            <>
                                {
                                    selectedCategory !== null ? 
                                    showAssessmentsForSelectedCategory()
                                    : RenderCategory()
                                }
                            </>
                        }
                    </ScrollView>
                </>
                :
                <View style={{justifyContent:"center", flex:1, alignItems:"center"}}>
                    <Text style={{marginLeft:5, fontSize: 13, fontWeight: 'bold'}}>Loading ...</Text>
                </View>
            }
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
      maxWidth:width*0.58
    },
  });