import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
} from 'react-native';
import {
  Image,
  ZStack,
  VStack,
  HStack,
  Button,
  Center,
  Box,
  IconButton,
  Modal,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {BaseURL} from '../../StaticData/Variables';
import {
  setProfileImg,
  setLoading,
  setProfileData,
} from '../../Redux/Features/authSlice';

export default function DashImg() {
  const dispatch = useDispatch();
  const Email = useSelector(state => state.Auth.Mail);
  const ProfileImg = useSelector(state => state.Auth.ProfileImg);
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const [PImage, setPImage] = useState(null);
  const [upImage, setUpImage] = useState(null);
  const [DImage, setDImage] = useState(null);
  const [ShowImgUp, setShowImgUp] = useState(false);

  // console.log(ProfileD.profileImgPath);

  useEffect(() => {
    // console.log(props)
    setPImage(ProfileD.profileImgPath);
    console.log(PImage);
  }, [PImage, ProfileD.profileImgPath]);

  const getProfile = async () => {
    // alert('methods working')
    // console.log('yeet mail:-'+email)
    if (Email === '') {
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
          token: Email,
        },
      };
      // console.log(requestOptions);
      await fetch(BaseURL + 'getStudentByEmail?email=' + Email, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            dispatch(setProfileData(result.data));
            if (result.data.profileImgPath != null) {
              console.log('Updated to the store');
              // dispatch(setUserImage(result.data.profileImgPath))
              dispatch(setProfileImg(true));
            } else {
              console.log('No profile image');
              dispatch(setProfileImg(false));
            }
            // dispatch(setUserImage(result.data.profileImgPath))
            dispatch(setLoading(false));
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

  const uploadImage = async image => {
    const formData = new FormData();
    // var myHeaders = new Headers();
    // myHeaders.append('x-auth-token',Jwt_Token)
    console.log(image);
    let match = /\.(\w+)$/.exec(image);
    let type = match ? `image/${match[1]}` : 'image';
    let filename = image.split('/').pop();
    formData.append('image', {uri: image, name: filename, type});
    // formData.append('image',image[0])

    if (image === '') {
      alert('Something is wrong, please try again');
    } else {
      const requestOptions = {
        method: 'POST',
        // headers:myHeaders,
        headers: {
          // 'Accept': 'application/json',
          // 'Content-Type': 'application/json',
          gmailusertype: 'STUDENT',
          token: Email,
        },
        body: formData,
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'uploadProfileImage', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setShowImgUp(false);
            dispatch(setProfileImg(true));
            getProfile()
            alert('Uploaded Successfully !');
            console.log(result);
          } else if (result.status > 200) {
            setShowImgUp(false);
            alert('Failed: ' + result.message);
            console.log(result);
          }
          // console.log(result);
        })
        .catch(error => {
          setShowImgUp(false);
          console.log('Error:' + error);
          // alert('Error: ' + error);
          uploadImage(image)
        });
    }
  };

  const OpenPhotoLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      enableRotationGesture: true,
    })
      .then(image => {
        setDImage(image.path);
        setShowImgUp(true);
        console.log(image);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View>
      <Modal isOpen={ShowImgUp} onClose={() => setShowImgUp(false)} size="lg">
        <Modal.Content maxWidth="600">
          <Modal.CloseButton />
          {/* <Modal.Header>Verificaton</Modal.Header> */}
          <Modal.Body>
            <VStack>
              <Box
                flex={1}
                p={2}
                w="90%"
                mx="auto"
                justifyContent="center"
                alignContent="center">
                {DImage && (
                  <Image
                    rounded={100}
                    size={150}
                    source={{uri: DImage}}
                    alt="profile-img"
                    mt="50"
                    ml="50"
                    mb="10"
                  />
                )}

                <HStack
                  space={5}
                  mt={4}
                  mb={4}
                  justifyContent="center"
                  alignContent="center">
                  <Button
                    bg="#3e5160"
                    pt={5}
                    pb={5}
                    pl={10}
                    pr={10}
                    onPress={() => {
                      dispatch(setLoading(true));
                      setUpImage(DImage);
                      uploadImage(DImage);
                      dispatch(setLoading(false));
                    }}>
                    Upload
                  </Button>

                  <Button
                    bg="#3e5160"
                    pt={5}
                    pb={5}
                    pl={10}
                    pr={10}
                    onPress={() => {
                      dispatch(setLoading(false));
                      setShowImgUp(false);
                    }}>
                    Cancel
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <ZStack>
        {upImage === null && (
          <Image
            rounded={100}
            size={150}
            source={{uri: PImage}}
            alt="profile-img"
            mt="50"
            ml="50"
          />
        )}
        {upImage && (
          <Image
            rounded={100}
            size={150}
            source={{uri: upImage}}
            alt="profile-img"
            mt="50"
            ml="50"
          />
        )}
        {ProfileImg === false && (
          <Image
            rounded={100}
            size={150}
            source={require('../../../assets/personIcon.png')}
            alt="profile-img"
            mt="50"
            ml="50"
          />
        )}
        <TouchableOpacity onPress={() => OpenPhotoLibrary()}>
          <Image
            size={50}
            resizeMode={'contain'}
            source={require('../../../assets/CameraImg.png')}
            alt="cameraImg"
            mt="150"
            ml="150"
          />
        </TouchableOpacity>
      </ZStack>
    </View>
  );
}

const styles = StyleSheet.create({});
