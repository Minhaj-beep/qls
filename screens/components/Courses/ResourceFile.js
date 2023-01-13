import { StyleSheet, View,TouchableOpacity,Linking,Dimensions} from 'react-native';
import React,{ useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { HStack,IconButton,Text,VStack, useToast } from 'native-base';

const {width, height} = Dimensions.get('window');

const ResoucreFile = ({props}) => {
    const data = props;
    const url = props.resourcePath;
    console.log(props);
    const toast = useToast();

    const OpenDoc = async(link) =>{
        console.log(link);
        const supported = await Linking.canOpenURL(link);
        if (supported) {
          await Linking.openURL(link);
        } else {
            toast.show({
                description: 'Unable to open URL, Please try again later!',
            });
        }
    };
  return (
    <View>
        <VStack
            ml={5} mt={5}
        >
        <TouchableOpacity>
            <HStack space={3}>
                <IconButton
                    icon={<Icon name="cloud-download-outline"/>}
                    borderRadius="full"
                    bg="#F0E1EB"
                    _pressed={{
                        bg: '#fcfcfc',
                        _text:{color: '#3e5160'},
                    }}
                    _icon={{color: '#8C8C8C',size: 'lg'}}
                    alignSelf="center"
                    onPress={() => OpenDoc(url)}
                />
                <Text
                    alignSelf="center"
                    onPress={() => OpenDoc(url)}
                    style={{width: width / 2}}
                >{data.resourceName}</Text>
            </HStack>
        </TouchableOpacity>
        </VStack>
    </View>
  );
};

export default ResoucreFile;

const styles = StyleSheet.create({});
