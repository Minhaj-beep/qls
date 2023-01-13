import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Modal,
  Text,
  Box,
  VStack,
  HStack,
  Input,
  FormControl,
  Button,
  Link,
  Heading,
  Image,
  Container,
  Center,
  IconButton,
  useToast,
} from 'native-base';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {BaseURL} from '../StaticData/Variables';
import {setLoading} from '../Redux/Features/authSlice';
import {setSCData} from '../Redux/Features/CourseSlice';

// export const SLIDER_WIDTH = width;
// export const ITEM_WIDTH = width - 150;

const CourseCard = gestureHandlerRootHOC(items => {
  const email = useSelector(state => state.Auth.Mail);
  const dispatch = useDispatch();
  const toast = useToast();
  const item = items.props;
  const [courseTitle, setCourseTitle] = useState();
  const [currencyType, setCurrencyType] = useState('yeet');
  const [RatingCount, setRatingCount] = useState();
  const currency = item.currency === 'INR' ? '₹' : '$';
  // console.log(item.isLive)

  useEffect(() => {
      let cName = item.courseName;
      let courseT = cName.slice(0, 25);
      if (cName.length > 25) {
        setCourseTitle(courseT + '...');
      } else {
        setCourseTitle(cName);
      }
  }, []);
  // if(item.isLive){
  //   console.log(item)
  // }

  return (
    <View style={styles.coursecard} alignItems="center">
      <VStack space={1} p={2}>
        <Image
          source={{uri: item.thumbNailImagePath}}
          style={styles.courseimg}
          alt="teet"
          fallbackSource={require('../../assets/NoImage.png')}
        />
        <Text style={styles.courseheading}>{courseTitle}</Text>
        <HStack space={1} width={width / 2}>
          <Text style={{color: '#8C8C8C', fontSize: 12}}>By</Text>
          <Text style={{color: '#395061', fontSize: 12}}>
            {item.instructorName}
          </Text>
        </HStack>

        <HStack space={2} style={{alignItems: 'center'}}>
          { RatingCount ?
          <HStack space={1}>
              <HStack space={1}>
                {
              [...Array(RatingCount)].map((e, i) =>{
                  return (
                    <Image
                      key={i}
                      source={require('../../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                  );
                }
              )
            }
            {
              [...Array(5 - RatingCount)].map((e, i) =>{
                  return (
                    <Image
                      key={i}
                      source={require('../../assets/Home/unstar.png')}
                      alt="rating"
                      size="3"
                    />
                  );
                }
              )
            }
              </HStack>
          </HStack>
          :
            <HStack space={1}>
              <Image
                source={require('../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
              <Image
                source={require('../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
              <Image
                source={require('../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
              <Image
                source={require('../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
              <Image
                source={require('../../assets/Home/unstar.png')}
                alt="rating"
                size="3"
              />
            </HStack>
          }

          <Text style={{fontSize: 11}}>
            {item.rating}({item.ratingCount})
          </Text>

          {/* <HStack space={1} alignItems='center'>
                 <Image
                 alt="graduate icon"
                 source={require('../../assets/Home/graduate_student.png')}
                 size="3"
                 />
                 <Text style={{fontSize: 11}}>
                     85 Learners
                 </Text>
             </HStack> */}
        </HStack>
        {/* <HStack justifyContent={'space-between'} alignItems={'center'}> */}
        <HStack style={{justifyContent:"space-between"}}>
          <Text style={{fontSize: 15, color: '#000000', fontWeight: 'bold'}}>
            {currency}{item.fee}
          </Text>
          {item.isLive
            ?
            <Text numberOfLines={2} style={{fontSize: 13, backgroundColor:"#EDAEC0", paddingHorizontal:5, paddingVertical:1, borderRadius:5, bottom:5, color: '#FFF',}} >
              Live
            </Text>
            :
            <></>
          }
        </HStack>
        {/* <IconButton
            icon={<MIcon name="cart-plus" size={20} color={'#395061'} />}
            onPress={() => AddToCart(item.courseCode)}
          />
        </HStack> */}
      </VStack>
    </View>
  );
});

export default CourseCard;

const styles = StyleSheet.create({
  coursecard: {
    width: width / 1.7,
    maxHeight:height / 2.5,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 0.376085489988327,
    },
    shadowRadius: 21.951963424682617,
    shadowOpacity: 1,
    overflow: 'hidden',
    marginLeft: 15,
  },
  courseimg: {
    width: width / 1.85,
    height: height / 7,
    borderRadius: 10,
    backgroundColor: '#C4C4C4',
    alignSelf: 'center',
  },
  courseheading: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    color: '#000000',
  },
});
