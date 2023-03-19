import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import React, {useState, useEffect} from 'react';
import {
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  Box,
  Input,
  FormControl,
  Select,
  useDisclose,
  Actionsheet,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import SVG1 from '../../assets/Search/dev.svg';
import Navbar from '../components/Navbar';
import RCCard from '../components/Courses/RCCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  BaseURL,
  FeeSSearch,
  FeeESearch,
  CatSearch,
  SCatSearch,
  CNSearch,
  CTSearch,
  RatingStart,
} from '../StaticData/Variables';
import {setLoading} from '../Redux/Features/authSlice';
import {setSCData} from '../Redux/Features/CourseSlice';
import {
  setSearchData,
  setSearchA,
  setSearchT,
} from '../Redux/Features/CourseSlice';
import {TextVal} from '../Functions/Validations';

const {width, height} = Dimensions.get('window');

const Search = ({navigation}) => {
  const [CData, setCData] = useState(null);
  const [SubCData, setSubCData] = useState(null);

  const dispatch = useDispatch();

  const [Result, setResult] = useState();
  const [SearchActive, setSearchActive] = useState(false);
  const [FilterModal, setFilterModal] = useState(false);
  const [FeeStart, setFeeStart] = useState(9);
  const [FeeEnd, setFeeEnd] = useState(5000);
  const [CAT, setCAT] = useState('NIL');
  const [SCAT, setSCAT] = useState('NIL');
  const [CNS, setCNS] = useState('');
  const [CTS, setCTS] = useState('NIL');
  const [Rating, setRating] = useState('NIL');
  const [RatingValue, setRatingValue] = useState(0);
  const [API, setAPI] = useState(BaseURL + 'searchCourse?courseFeeStart=' + FeeStart + '&courseFeeEnd=' + FeeEnd);
  const [SearchAPI, setSearchAPI] = useState();
  const email = useSelector(state => state.Auth.Mail);
  const SearchA = useSelector(state => state.Course.SearchA);
  const SearchData = useSelector(state => state.Course.SearchData);
  const [URLString, setURLString] = useState('');


  const SearchURL = new Map();
  console.log(SearchURL, 'SearchURL')

  useEffect(() => {
    GetCategories();
    if (SearchA) {
      setSearchActive(true);
      setResult(SearchData);
    } else {
      setSearchActive(false);
      setResult('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(()=>{
    if(CAT !== 'NIL'){
      GetSubCategories()
    }
  },[CAT])

  const AppBarContent = {
    title: '',
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  const activeChip = {
    color: '#364b5b',
    backgroundColor: '#F0E1EB',
  };
  const NotActiveChip = {
    color: '#FFF',
    backgroundColor: '#364b5b',
  };

  const [R1, setR1] = useState(false);
  const [R2, setR2] = useState(false);
  const [R3, setR3] = useState(false);
  const [R4, setR4] = useState(false);

  const setRate = rate => {
    setRating(rate);
    if (rate === 2) {
      setR1(true);
      setR2(false);
      setR3(false);
      setR4(false);
      setRating(rate);
    } else if (rate === 3) {
      setR1(false);
      setR2(true);
      setR3(false);
      setR4(false);
      setRating(rate);
    } else if (rate === 4) {
      setR1(false);
      setR2(false);
      setR4(false);
      setR3(true);
      setRating(rate);
    } else {
      setR1(false);
      setR2(false);
      setR3(false);
      setR4(true);
      setRating('NIL');
    }
  };

  const ResetFilter = () => {
    setCAT('NIL');
    setSCAT('NIL');
    setRate(0);
    setRatingValue(0);
    setCTS('NIL');
    setAPI(BaseURL + 'searchCourse?courseFeeStart=' + FeeStart + '&courseFeeEnd=' + FeeEnd);
    setURLString('');
    setFeeStart(9);
    setFeeEnd(1000);
  };

  const SetSearcho = async() => {
    console.log('hello')
    setURLString('');
    SearchURL.clear();
    if (CAT !== 'NIL') {
      // let value = SearchAPI + '&' + CatSearch + CAT;
      // setSearchAPI(value);
      SearchURL.set(CatSearch,CAT);
    }
    if (SCAT !== 'NIL') {
      // let value = SearchAPI + '&' + SCatSearch + SCAT;
      // setSearchAPI(value);
      SearchURL.set(SCatSearch,SCAT);

    }
    if (RatingValue !== 0) {
      // let value = SearchAPI + '&' + RatingStart + RatingValue;
      // setSearchAPI(value);
      SearchURL.set(RatingStart,RatingValue);
    }
    if (CNSearch !== '') {
      // let value = SearchAPI + '&' + CNSearch + CNS;
      // setSearchAPI(value);
      SearchURL.set(CNSearch,CNS);
    }
    // console.log(SearchAPI);
    SearchCourse();
  };

  const SearchCourse = () => {
    if (SearchURL.size === 0 || email === '') {
      alert('Something is wrong, please login again');
      dispatch(setLoading(false));
    } else {
      let SVal = [...SearchURL.entries()];
      // console.log(FeeStart, 'FeeStart and ', FeeEnd, 'FeeEnd')
      let MSize = SearchURL.size;
      SearchURL.clear();
      SVal.forEach((data, index)=>{
        if ( MSize === 1 || index === parseInt(MSize) - 1) {
          let SD = URLString + '&' + data[0] + data[1];
          setURLString(SD);
        } else {
          let SD = URLString + '&' + data[0] + data[1] + '&';
          setURLString(SD);
        }
      });

      console.log(URLString, 'URLString -----------------------')
      
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
      };
      console.log(API + URLString);
      fetch(BaseURL + 'searchCourse?courseFeeStart=' + FeeStart + '&courseFeeEnd=' + FeeEnd + URLString, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            dispatch(setLoading(false));
            setResult(result.data);
            console.log('Get Filterd data : ', result.data)
            onClose();
            setURLString('');
            dispatch(setSearchData(result.data));
            dispatch(setSearchA(true));
            setSearchActive(true);
          } else if (result.status > 200) {
            setURLString('');
            dispatch(setLoading(false));
            onClose();
            alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          setFilterModal(false);
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  const SearchCAT = async text => {
    dispatch(setLoading(true));
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
      };
      console.log(requestOptions);
      await fetch(
        BaseURL + 'searchCourse?givenCategoryName=' + text,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            dispatch(setLoading(false));
            setResult(result.data);
            // console.log(result.data);
            dispatch(setSearchData(result.data));
            dispatch(setSearchA(true));
            setSearchActive(true);
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  const GetCategories = async () => {
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
      };
      // console.log(requestOptions);
      await fetch(BaseURL + 'getAllCategory', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            dispatch(setLoading(false));
            setCData(result.data);
            // dispatch(setSearchData(result.data));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  const GetSubCategories = async () => {
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
      };
      // console.log(requestOptions);
      await fetch(
        BaseURL + 'getSubCategorybyCategoryCode?categoryCode=' + CAT,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            dispatch(setLoading(false));
            console.log('Get the categories :', result.data)
            setSubCData(result.data);
            dispatch(setSearchData(result.data));
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('Error:' + error);
          alert('Error: ' + error);
        });
    }
  };

  const RenderCat = () => {
    return CData.map((data, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            let DC = data.categoryCode;
            setCAT(DC);
            SearchCAT(DC);
          }}
          key={index}>
          <HStack
            style={{padding: 5}}
            alignItems="center"
            justifyContent={'space-between'}>
            <Text color={'primary.50'} style={{fontWeight: 'bold'}}>
              {data.categoryName}
            </Text>
            <Icon
              name="chevron-forward-outline"
              size={20}
              style={{padding: 5}}
              color={'#364b5b'}
            />
          </HStack>
        </TouchableOpacity>
      );
    });
  };

  const RenderCard = () => {
    return Result.map((data, index) => {
      console.log(data.isLive);
      return (
        <TouchableOpacity key={index}
        onPress={()=>{
          const DD = { CDD : data, type: 'Search'};
          dispatch(setSCData(DD));
          if (data.isLive === true) {
            navigation.navigate('LiveSCView');
          } else {
            navigation.navigate('SCView');
          }
        }}
        >
          {/* {console.log(data, "Single data from result")} */}
          <RCCard props={data} />
        </TouchableOpacity>
      );
    });
  };

  const {isOpen, onOpen, onClose} = useDisclose();

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar animated={true} backgroundColor="#FCFCFC"/> */}
      <Navbar props={AppBarContent} />
      <ScrollView
        contentContainerStyle={styles.TopContainer}
        nestedScrollEnabled={true}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Box w="100%" px={4} justifyContent="center">
              <Text
                fontSize="16"
                color="gray.500"
                _dark={{
                  color: 'gray.300',
                }}>
                Filter
              </Text>
            </Box>
            <VStack
              alignItems={'center'}
              transparent={true}
              animationType={'fade'}>
              <VStack space={2} w={'90%'} mt={4}>
                {/* <Text
                  color={'greyScale.800'}
                  fontSize={12}
                  style={{fontWeight: 'bold'}}>
                  Course Type
                </Text> */}
                {/* <Select
                  placeholder="Course Type"
                  variant="filled"
                  bg={'greyScale.600'}
                  borderRadius={15}>
                  <Select.Item label="Live Course" value="lc" />
                  <Select.Item label="Recorded Course" value="rc" />
                </Select> */}
                <Text
                  color={'greyScale.800'}
                  fontSize={12}
                  style={{fontWeight: 'bold'}}>
                  Category
                </Text>
                <Select
                  onValueChange={Value => {
                    setCAT(Value);
                  }}
                  defaultValue={CAT}
                  placeholder="Category"
                  variant="filled"
                  bg={'greyScale.600'}
                  borderRadius={15}>
                  <Select.Item label="None" value="NIL" />
                  {CData
                    ? CData.map((data, index) => {
                        return (
                          <Select.Item
                            key={index}
                            label={data.categoryName}
                            value={data.categoryCode}
                          />
                        );
                      })
                    : null}
                </Select>
                <Text
                  color={'greyScale.800'}
                  fontSize={12}
                  style={{fontWeight: 'bold'}}>
                  Sub-Category
                </Text>
                <Select
                  onValueChange={Value => {
                    setSCAT(Value);
                  }}
                  defaultValue={SCAT}
                  placeholder="Sub-Category"
                  variant="filled"
                  bg={'greyScale.600'}
                  borderRadius={15}>
                  <Select.Item label="None" value="NIL" />
                  {SubCData
                    ? SubCData.map((data, index) => {
                        return (
                          <Select.Item
                            key={index}
                            label={data.subCategoryName}
                            value={data.subCategoryCode}
                          />
                        );
                      })
                    : null}
                </Select>
                <Text
                  color={'greyScale.800'}
                  fontSize={12}
                  style={{fontWeight: 'bold'}}>
                  Rating
                </Text>
                <HStack space={2}>
                  <Text
                    style={R1 ? activeChip : NotActiveChip}
                    borderRadius={20}
                    pt={2}
                    pb={2}
                    pl={3}
                    pr={3}
                    fontSize={10}
                    onPress={() => {
                      setRate(2);
                      setRatingValue(2);
                    }}>
                    Above 2.0
                  </Text>
                  <Text
                    style={R2 ? activeChip : NotActiveChip}
                    borderRadius={20}
                    pt={2}
                    pb={2}
                    pl={3}
                    pr={3}
                    fontSize={10}
                    onPress={() => {
                      setRate(3);
                      setRatingValue(3);
                    }}>
                    Above 3.0
                  </Text>
                  <Text
                    style={R3 ? activeChip : NotActiveChip}
                    borderRadius={20}
                    pt={2}
                    pb={2}
                    pl={3}
                    pr={3}
                    fontSize={10}
                    onPress={() => {
                      setRate(4);
                      setRatingValue(4);
                    }}>
                    Above 4.0
                  </Text>
                  <Text
                    style={R4 ? activeChip : NotActiveChip}
                    borderRadius={20}
                    pt={2}
                    pb={2}
                    pl={3}
                    pr={3}
                    fontSize={10}
                    onPress={() => {
                      setRate(0);
                      setRatingValue(0);
                    }}>
                    None
                  </Text>
                </HStack>
                <Text
                  color={'greyScale.800'}
                  fontSize={12}
                  style={{fontWeight: 'bold'}}>
                  Price
                </Text>
                <VStack style={{maxWidth: width / 1}}>
                  <MultiSlider
                    values={[FeeStart, FeeEnd]}
                    min={99}
                    max={5000}
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
                  <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    pr={3}>
                    <Text
                      color={'greyScale.800'}
                      fontSize={12}
                      style={{fontWeight: 'bold'}}>
                      ₹{FeeStart}
                    </Text>
                    <Text
                      color={'greyScale.800'}
                      fontSize={12}
                      style={{fontWeight: 'bold'}}>
                      ₹{FeeEnd}
                    </Text>
                  </HStack>

                  <HStack justifyContent={'space-evenly'} mt={4}>
                    <Button
                      onPress={() => {
                        ResetFilter();
                        setCNS('');
                      }}
                      _text={{color: '#364b5b', fontSize: 12}}
                      bg={'greyScale.600'}
                      pl={10}
                      pr={10}>
                      Clear
                    </Button>
                    <Button
                      onPress={() => {
                        dispatch(setLoading(true));
                        SetSearcho();
                      }}
                      colorScheme={'primary'}
                      _text={{fontSize: 12}}
                      pl={10}
                      pr={10}>
                      Apply
                    </Button>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </Actionsheet.Content>
        </Actionsheet>
        {/* Search bar */}

        <FormControl>
          <Input
            value={CNS}
            onChangeText={text => {
              if (text.length > 2) {
                setCNS(text);
                SetSearcho();
              } else {
                setCNS(text);
                setSearchActive(false);
                // dispatch(setSearchA(false));
                // dispatch(setSearchT(''));
              }
            }}
            variant="filled"
            bg="#FCFCFC"
            borderRadius={7}
            placeholder="Search"
            InputLeftElement={
              <IconButton
                icon={
                  <Icon
                    name={'search'}
                    size={20}
                    style={{paddingLeft: 5}}
                    color="#364b5b"
                  />
                }
              />
            }
          />
        </FormControl>
        {SearchActive ? (
          <HStack justifyContent={'space-between'}>
            <IconButton
              icon={<Icon name={'filter-outline'} size={15} color="#364b5b" />}
              onPress={onOpen}
              bg={'#FFFF'}
              mt={2}
            />
            <TouchableOpacity
              onPress={() => {
                setSearchActive(false);
                ResetFilter();
                setCNS('');
                dispatch(setSearchData(''));
                dispatch(setSearchA(false));
              }}
              style={{padding: 5, marginTop: 10}}>
              <Text
                color={'primary.100'}
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                }}
                alignSelf={'flex-end'}>
                Clear
              </Text>
            </TouchableOpacity>
          </HStack>
        ) : null}

        {SearchActive ? (
          <VStack>{Result ? <RenderCard /> : null}</VStack>
        ) : (
          <View>
            {/* Suggestions */}
            {/* <Text color={'primary.100'} mt={2} style={{fontSize:12, fontWeight:'bold'}}>Suggestions:</Text> */}
            {/* <View style={styles.Suggestions}>
            { CData.map((data,index) => {
                return (
                  <View style={{padding:4}} key={index}>
                    <Text color={'primary.100'} bg={'secondary.50'} pl={2} pr={2} pt={1} pb={1} borderRadius={5} style={{fontSize:11}}>{data}</Text>
                  </View>
                );
              })}
          </View> */}

            {/* Categories */}
            <Text
              color={'#000'}
              mt={7}
              style={{fontSize: 16, fontWeight: 'bold'}}>
              Categories
            </Text>
            <View>{CData !== null ? <RenderCat /> : null}</View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    height: height,
    width: width,
    flex: 1,
  },
  TopContainer: {
    flexGrow: 1,
    paddingBottom: 70,
    padding: 15,
  },
  Suggestions: {
    width: width,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
