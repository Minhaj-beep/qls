import React, { useState } from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import { View, Button } from 'native-base';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print'
import Icon from 'react-native-vector-icons/Ionicons';
import { DownloadInvoices } from '../Functions/API/DownloadInvoice';
import { useSelector } from 'react-redux';

const Invoice = ({props, orderId}) => {
    const email = useSelector(state => state.Auth.Mail);
    const JWT = useSelector(state => state.Auth.JWT);
    const GUser = useSelector(state => state.Auth.GUser);
    const [pdfUri, setPdfUri] = useState(null);
    const courseList = Array.isArray(props.items) ? props.items : [props.items]
    console.log('All props=================', props, orderId)

  const downloadInvoice = async () => {
    try {
      const blob = await DownloadInvoices(GUser, email, JWT,  orderId)
      await Linking.openURL(`https://api.dev.qlearning.academy/api/v1/order/${orderId}/downloadInvoice`)
      console.log(blob)
      // if (blob.status == 200) {
      //   await Linking.openURL(`https://api.dev.qlearning.academy/api/v1/order/${props.razorpayOrderId}/downloadInvoice`);
      // } 
    } catch (e) {
      console.log(e, ' Server error')
    }
  }

  return (
    <Button color={'gray.900'} onPress={()=>downloadInvoice()}
    style={{paddingTop:10,paddingBottom:10,paddingLeft:20, backgroundColor:"#8C8C8C", paddingRight:35}}
    _pressed={{bg: "#fcfcfc",
      _text:{color: "#3e5160"}
      }}
      startIcon={
        <Icon name="download-outline" size={15} color="#ffffff" />
      }
    >
        Invoice
    </Button>
  );
};

export default Invoice;
