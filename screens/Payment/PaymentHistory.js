/* eslint-disable no-alert */
import { StyleSheet, View, SafeAreaView, ScrollView,Dimensions,TouchableOpacity } from 'react-native';
import React,{useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import {GetPaymentHistory} from '../Functions/API/GetPaymentHistory';
import {useSelector, useDispatch} from 'react-redux';
import { Text,HStack,VStack, Modal,useToast,Button,Divider } from 'native-base';
import moment from 'moment';
import { setLoading } from '../Redux/Features/authSlice';
import DownloadInvoice from './components/DownloadInvoice';

const {width, height} = Dimensions.get('window');

const PaymentHistory = ({navigation}) => {

  const email = useSelector(state => state.Auth.Mail);
  const [History, setHistory] = useState();
  const [showModal, setShowModal] = useState(false);
  const [ModalData, setModalData] =useState();
  const dispatch = useDispatch()
  const toast = useToast();

  const AppBarContent = {
    title: 'Payment History',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  useEffect(()=>{
    GetPHistory();
  },[]);

  const GetPHistory = async() => {
    dispatch(setLoading(true))
    try {
      let response = await GetPaymentHistory(email);
      if ( response.status === 200 && response.data.length !== 0) {
        setHistory(response.data);
        // console.log(response.data[1]);
      } else {
        // alert("GetPHistory :" + response.message);
        console.log("GetPHistory :" + response.message);
        
      }
    } catch (error) {
      alert("GetPHistory :" + error.message);
      console.log("GetPHistory :" + error.message);
    }
    dispatch(setLoading(false))
  };

  const download = (data) => {
    console.log(data)
    console.log(data.OData.items)
    setShowModal(false);
  }

  const RenderPaymentCard = ({props}) => {
    let time = moment(props.createdTime).format('DD MMM YYYY, hh:mm a');
    let BgColor = props.orderStatus === 'PAYMENT_COMPLETED' ?  '#D4F6E0' : '#FDDDDD';
    let Color = props.orderStatus === 'PAYMENT_COMPLETED' ?  '#29D363' : '#F65656';
    let Status = props.orderStatus === 'PAYMENT_COMPLETED' ?  'Success' : 'In Progress';
    let data = {
      Scolor: Color,
      SStatus: Status,
      background:BgColor,
      OData:props,
    };
    // console.log(props);
    return (
        <TouchableOpacity
       onPress={() => {
        setModalData(data);
        setShowModal(true);
        console.log(data);
      }}
        >
        <HStack style={styles.card} space={1} maxWidth={width / 0.5} justifyContent="space-between">
            <VStack style={{maxWidth:width / 1.5}}>
                <HStack alignItems={'center'} space={1} maxWidth={width / 2.5}>
                  <Text color={'#000'} fontSize={13} fontWeight={'bold'}>Order ID</Text>
                  <Text color={'gray.800'} fontSize={12} fontWeight={'bold'}>#{props.razorpayOrderId}</Text>
                </HStack>
                <Text color={'#000'} fontSize={11} fontWeight={'bold'}>{props.currencyCode} {props.total}</Text>
                <Text color={'#8C8C8C'} fontSize={9}>{time}</Text>
            </VStack>
            <VStack justifyContent={'center'}>
              <Text  textAlign={'center'} bg={BgColor} color={Color} fontSize={11} p={2} borderRadius={20} style={{minWidth:80}}>{Status}</Text>
            </VStack>
          </HStack>
          </TouchableOpacity>
    );
  };

  const RenderPList = () => {
    let items = ModalData.OData.items;
    return (
      items.map((data, index) => {
        return (
          <HStack width={width / 1.1} key={index}>
            <HStack space={1} pl={1}>
              <Text color={'primary.100'} fontWeight={'bold'} fontSize={14}>|</Text>
              <Text color={'greyScale.800'} fontWeight={'bold'} fontSize={12}>{index + 1}.</Text>
            </HStack>
            <HStack  justifyContent={'space-between'} width={width / 1.3} pl={1}>
                <Text noOfLines={2} color={'greyScale.800'} fontWeight={'bold'} fontSize={12} maxWidth={width / 2.5}>{data.hasOwnProperty('courseName') ? data.courseName : data.assessmentTitle}</Text>
                <Text color={'primary.100'} fontWeight={'bold'} fontSize={13}>{ModalData.OData.currencyCode} {data.fee}</Text>
            </HStack>
          </HStack>
        );
      })
    );
  };

  return (
    <View style={styles.container}>
      <Navbar props={AppBarContent} />
      <ScrollView
        contentContainerStyle={styles.TopContainer}
        nestedScrollEnabled={true}>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content width={width / 1.1}>
          <Modal.CloseButton />
          <Modal.Body>
           {ModalData &&
           <VStack space={6}>
            <Text color="primary.100" fontWeight={'bold'} fontSize={17}>Invoice</Text>
            <VStack space={2}>
               <HStack justifyContent="space-between" alignItems={'center'}>
                <Text color="primary.100" fontWeight={'bold'} fontSize={14}>Status</Text>
                <VStack justifyContent={'center'}>
                  <Text  textAlign={'center'} bg={ModalData.Scolor} color={ModalData.background} fontSize={11} p={2} borderRadius={20} style={{minWidth:80}}>{ModalData.SStatus}</Text>
                </VStack>
              </HStack>

              <Text color="primary.100" fontWeight={'bold'} fontSize={14}>Purchase List</Text>

              <ScrollView style={{maxHeight:height / 3}}>
                <RenderPList/>
                <Divider my={2} thickness={1} color={'primary.100'}/>
              </ScrollView>

              <HStack justifyContent="space-between" alignItems={'center'}>
                <Text color="primary.100" fontWeight={'bold'} fontSize={12}>Sub Total</Text>
                <Text fontSize={11} borderRadius={20} fontWeight={'bold'} color="primary.100">{ModalData.OData.currencyCode} {ModalData.OData.subTotal}</Text>
              </HStack>
              <HStack justifyContent="space-between" alignItems={'center'}>
                <Text color="primary.100" fontWeight={'bold'} fontSize={12}>VAT ({ModalData.OData.taxPercentage}%)</Text>
                <Text fontSize={11} borderRadius={20} fontWeight={'bold'} color="primary.100">{ModalData.OData.currencyCode} {ModalData.OData.taxValue}</Text>
              </HStack>
              {
                ModalData.OData.hasOwnProperty('discountValue') && 
                  <HStack justifyContent="space-between" alignItems={'center'}>
                    <Text color="primary.100" fontWeight={'bold'} fontSize={12}>Discount ({ModalData.OData.discountPercentage}%)</Text>
                    <Text fontSize={11} borderRadius={20} fontWeight={'bold'} color="primary.100">{ModalData.OData.currencyCode} {ModalData.OData.discountValue}</Text>
                  </HStack>
              }
              <HStack justifyContent="space-between" alignItems={'center'}>
                <Text color="primary.100" fontWeight={'bold'} fontSize={13}>Total</Text>
                <Text fontSize={13} borderRadius={20} fontWeight={'bold'} color="primary.100">{ModalData.OData.currencyCode} {ModalData.OData.total}</Text>
              </HStack>

            </VStack>
            {/* <Button
              bg="#3e5160"
              colorScheme="blueGray"
              style={styles.cbutton}
              _pressed={{bg: "#fcfcfc",
                _text:{color: "#3e5160"}
                }}
              onPress={()=>{
                download(ModalData)
              }}
            >
              Download Invoice
            </Button> */}
            <DownloadInvoice props={ModalData.OData} />
            </VStack>
            }
          </Modal.Body>
        </Modal.Content>
      </Modal>

        <VStack m={4}>
          {
            History ?
            <VStack space={2}>
              {
                History.map((data, index)=>{
                  return (
                    <View key={index}>
                      <RenderPaymentCard props={data}/>
                    </View>
                  );
                })
              }
            </VStack>
            : <Text alignSelf={'center'} color={'gray.400'} mt={5} fontSize={'xs'} bold>No Payment History found!</Text>
          }
        </VStack>
      </ScrollView>
    </View>
  );
};

export default PaymentHistory;

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
      },
      card:{
        backgroundColor:'#F8F8F8',
        padding:12,
        shadowColor: 'rgba(0, 0, 0, 0.03)',
        shadowOffset: {
          width: 0,
          height: 0.38,
        },
        borderRadius:6,
      },
});
