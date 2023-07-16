import { View, Text, Input, Icon, HStack, Center, VStack, Image, Button, IconButton, useDisclose, Actionsheet, FormControl, Select, Box, useToast } from "native-base"
import React, { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppBar from "../components/Navbar";
import GetCategories from "../Functions/API/GetCategories";
import {useDispatch, useSelector} from 'react-redux';
import GetAllCourses from "../Functions/API/GetAllCourses";
import SearchCourseByName from "../Functions/API/searchCourseByName";
import RcCard from "../components/Courses/RCCard";
import { setSCData } from "../Redux/Features/CourseSlice";
import GetSubcategoriesByCategoryCode from "../Functions/API/GetSubCategoriesByCategoryCode";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { setLoading } from "../Redux/Features/authSlice";
import SearchCourseForApp from "../Functions/API/SearchCourseForApp";
const {width, height} = Dimensions.get('window')

const Search = ({navigation}) => {
  const dispatch = useDispatch()
  const email = useSelector(state => state.Auth.Mail);
  const JWT = useSelector(state => state.Auth.JWT);

  const [query, setQuery] = useState('')
  const [allCategories, setAllCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryCode, setCategoryCode] = useState(null)
  const [allCourses, setAllCourses] = useState([])
  const [cardItems, setCardItems] = useState([])
  const [searchItems, setSearchItems] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [allSubCategories, setAllSubCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentSubCategory, setCurrentSubCategory] = useState(null)
  const [pricese, setPriceses] = useState([])
  const [categories, setCategories] = useState([])
  const [FeeStart, setFeeStart] = useState(0);
  const [FeeEnd, setFeeEnd] = useState(0);
  const [filter, setFilter] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclose();
  

  const handleQuery = (q) => {
    setQuery(q)
    if(Object.keys(allCourses).length > 0){
      const filteredNames = allCourses.filter(i => i.courseName.toLowerCase().includes(q.toLowerCase()))
      setCardItems(filteredNames)
    }
  }

  useEffect(()=>{
    getAllCourses()
    getAllCategories()
  },[])

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

        allCourses.map((j)=>{
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

  // get sub categories by category code
  const getSubCategory = async (code) => {
    try {
        let response = await GetSubcategoriesByCategoryCode(email, code)
        if (response.status === 200){
            // console.log(response.data)
            setAllSubCategories(response.data)
                if(response.data !== null){
                    let arr = []
                    response.data.map((i)=>{
                        arr = [...arr, i.subCategoryName]
                    })
                    setSubCategories(arr)
                    console.log(arr)
                }

        } else {
            console.log('getAllActivatedAssessment', response.message)
        }
    } catch (e) {
        console.log('getAllActivatedAssessment', e)
    }
  }

  const getAllCategories = async () => {
    try{
      const result = await GetCategories(email)
      if(result.status === 200) {
        setAllCategories(result.data)
        let arr = []
        result.data.map((i)=>{
            arr = [...arr, i.categoryName]
        })
        setCategories(arr)
        console.log(arr)
      } else {
        console.log('getAllCategories error: 1 ', result)
      }
    } catch (e) {
      console.log('getAllCategories error: 2 ', e)
    }
  }

  const applyFilter = () => {
    // console.log(categoryCode)
    // console.log(currentSubCategory)
    let subC = null
    allSubCategories.map((i)=>{
        if(i.subCategoryName === currentSubCategory){
          subC = i.subCategoryCode
          console.log(i.subCategoryName, currentSubCategory, subC,  '*************************')
        }
    })
    setFilter(true)
    let arr = []
    allCourses.map((item, index)=>{
      if(Object.keys(pricese).length < 2){
            if(currentSubCategory !== null) {
                console.log(item.catogory, categoryCode, item.subCategory, subC)
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
                  if(item.catogory === categoryCode && item.subCategory === subC){
                    console.log(item.catogory, categoryCode, item.subCategory, subC, currentSubCategory, '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    // console.log(Object.keys(arr).length)
    // console.log(arr)
    setCardItems(arr)
  }

  const getAllCourses = async () => {
    dispatch(setLoading(true))
    try{
      const result = await SearchCourseForApp(email)
      if(result) {
        setAllCourses(result)
        setCardItems(result)
        dispatch(setLoading(false))
        console.log(result)
      } else {
        console.log('getAllCategories error: 1 ', result)
        alert('Error! Please try again')
        dispatch(setLoading(false))
      }
    } catch (e) {
      console.log('getAllCategories error: 2 ', e)
      dispatch(setLoading(false))
      alert('Server error! Please try again later.')
    }
  }

  const renderCard = ({item}) => {
    // console.log(item)
        return (
          <TouchableOpacity key={item._id}
            onPress={()=>{
              const DD = { CDD : item, type: 'Search'};
              dispatch(setSCData(DD));
              // if (item.isLive === true) {
              //   navigation.navigate('LiveSCView');
              // } else {
                navigation.navigate('ViewLiveCourse');
              // }
            }}
          >
            {/* {console.log(data, "Single data from result")} */}
            <RcCard props={item} />
            {/* <Text>item.couponName</Text> */}
          </TouchableOpacity>
        )
  };

  // get All items to render by selecting categories
  const getItems = (selectedCategory) => {
    if(Object.keys(allCourses).length > 0){
      const filteredNames = allCourses.filter(i => i.catogory.includes(selectedCategory.categoryCode))
      setCardItems(filteredNames)
    } else {
        getItems(selectedCategory)
    }
  }

  // render all categories
  const RenderCategory = () => {
    return (
        <ScrollView>
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
        </ScrollView>
    )
  }

  const AppBarContent = {
    title: '',
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  return (
    <View style={{flex:1}}>
      <AppBar props={AppBarContent}/>
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
      <FormControl mt={3} mb={1}>
        <Input variant="filled" width={'95%'} alignSelf={'center'} bg="#FCFCFC" borderRadius={7} placeholder="Search" value={query}
          onChangeText={(text)=>handleQuery(text)}
          InputLeftElement={<IconButton icon={<Ionicons name={'search'} size={20} color="#364b5b" />} />}
        />
      </FormControl>
      <View style={{width:"95%", flex:1, alignSelf:"center"}}>
        {
          selectedCategory === null && query.trim() === '' ? null :
          <HStack mb={1} justifyContent={'space-between'}>
            <IconButton icon={<Ionicons name={'filter-outline'} size={15} color="#364b5b" />}
            onPress={onOpen}
            bg={'#FFFF'} mt={2} />
            <TouchableOpacity onPress={() => {
                setSelectedCategory(null)
                setQuery('')
            }} style={{padding: 5, marginTop: 10}}>
                <Text color={'primary.100'} style={{ fontSize: 13, fontWeight: 'bold', textDecorationLine: 'underline',}} alignSelf={'flex-end'}>Clear</Text>
            </TouchableOpacity>
          </HStack>
        }
        {
          query.trim() === '' && selectedCategory === null ? <RenderCategory /> :
          <View style={{flex:1}}>
            {
              Object.keys(allCourses).length > 0 ?
                <FlatList
                  data={cardItems}
                  renderItem={renderCard}
                  keyExtractor={item => item._id}
                  // extraData={selectedId}
                />
              : null
            }
          </View>
        }
      </View>
    </View>
  )
}

export default Search