import React, { useState } from 'react';
import { TouchableOpacity, Platform, PermissionsAndroid, Linking } from 'react-native';
import { View, Button } from 'native-base';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print'
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs'
import {useSelector, useDispatch} from 'react-redux';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import { DocumentDirectoryPath, getRealPathFromURI } from 'react-native-document-picker';
import { DownloadInvoices } from '../../Functions/API/DownloadInvoice';

const DownloadInvoice = ({props}) => {
  const email = useSelector(state => state.Auth.Mail);
  const JWT = useSelector(state => state.Auth.JWT);
  const GUser = useSelector(state => state.Auth.GUser);
  const [pdfUri, setPdfUri] = useState(null);
  const courseList = Array.isArray(props.items) ? props.items : [props.items]
  console.log('courseList', courseList)

  const downloadInvoice = async () => {
    console.log('Props:::::::::::::::::', props.razorpayOrderId)
    try {
      const blob = await DownloadInvoices(GUser, email, JWT,  props.razorpayOrderId)
      await Linking.openURL(`https://api.dev.qlearning.academy/api/v1/order/${props.razorpayOrderId}/downloadInvoice`)
      console.log(blob)
      // if (blob.status == 200) {
      //   await Linking.openURL(`https://api.dev.qlearning.academy/api/v1/order/${props.razorpayOrderId}/downloadInvoice`);
      // } 
    } catch (e) {
      console.log(e, ' Server error')
    }
  }

  // const fetchAndDownloadPDF = () => {
  //   const { fs } = RNFetchBlob;
  //   const downloadsDir = fs.dirs.DownloadDir; // Get the device's downloads directory path
  
  //   const downloadOptions = {
  //     fileCache: true,
  //     indicator: true,
  //     overwrite: true,
  //     addAndroidDownloads: {
  //       mime: 'application/pdf',
  //       notification: true,
  //       mediaScannable: true,
  //       useDownloadManager: true,
  //       path: `${downloadsDir}/invoice.pdf`,
  //       description: 'Downloading invoice...',
  //     },
  //   };
  
  //   RNFetchBlob
  //     .config(downloadOptions)
  //     .fetch('GET', `https://api.dev.qlearning.academy/api/v1/order/${props.razorpayOrderId}/downloadInvoice`, {
  //       'Content-Type': 'application/pdf',
  //       // gmailUserType: 'STUDENT',
  //       // token: email,
  //       'x-auth-token': JWT,
  //       'Cache-Control': 'no-store' 
  //     })
  //     .then((res) => {
  //       if(Platform.OS = 'android') {
  //         android.actionViewIntent(res.path(), 'application/pdf')
  //       }
  //       console.log('Invoice downloaded successfully');
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };

  const downloadFile = (fileUrl, fileName) => {
    const { fs } = RNFetchBlob;
    const downloadsDir = fs.dirs.DownloadDir; // Get the device's downloads directory path
  
    const downloadOptions = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${downloadsDir}/${fileName}`,
        description: 'Downloading file...',
      },
    };
  
    RNFetchBlob
      .config(downloadOptions)
      .fetch('GET', fileUrl)
      .then((res) => {
        // File downloaded successfully
        console.log('File downloaded:', res.path());
      })
      .catch((error) => {
        // Error occurred while downloading the file
        console.error('Error:', error);
      });
  };

  const generateInvoice = async () => {
    const htmlContent = `
    <html>
        <head>
            <style>
                body {
                font-family: Helvetica;
                }
                span {
                display: block;
                }
                tr {
                border-bottom: 1px solid lightgray;
                }
                tr.last:last-child {
                border-bottom-width: 1.4px;
                }
                .courses th,
                .courses td {
                padding: 10px 14px;
                font-size: 14px;
                }
                .amount tr {
                border: none;
                }
                td {
                  color: #000000
                }
                tbody {
                justify-content: center;
                }
                .amount th,
                .amount td {
                padding: 2px 14px;
                font-size: 11px;
                }
            </style>
        </head>
        <body>
            <div
            style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            "
            >
            <span style="font-size: 25px; color: #a9a9a9">Invoice</span>
            <div
                style="
                display: flex;
                justify-content: flex-end;
                background-color: #36454f;
                padding: 15px;
                "
            >
                <img
                src="https://ik.imagekit.io/42vct06fb/web_site/Group_1_7bAeFZnvQ.png?ik-sdk-version=javascript-1.4.3&updatedAt=1674044447460"
                alt="rupee"
                style="width: 80px"
                />
            </div>
            </div>
            <table
            class="courses"
            style="width: 100%; margin-top: 20px; border-collapse: collapse"
            >
            <tbody>
            <tr style="background-color: #36454f; color: #fff; border: none">
                <th style="width: 80%;  padding: 10px 14px">Course Name</th>
                <th style="width: 20%; text-align: center; padding: 10px 14px">Price</th>
            </tr>
            ${
                courseList.map((i)=> {
                    return (
                        `
                        <tr style="border-bottom: 1px solid lightgray">
                            <td style="width: 80%; color: black; padding: 10px 14px">${i.courseName ? i.courseName : i.assessmentTitle}</td>
                            <td style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 10px 14px">
                            <img
                                src="https://static.thenounproject.com/png/591777-200.png"
                                style="width: 22px; display: block; padding: 0; margin: 0"
                                alt="Rupee"
                            />
                            <span style="display: block; color: black; padding: 0; margin: 0; ">
                            ${i.fee}
                            </span>
                            </td>
                        </tr>
                        `
                    )
                })
            }
            </tbody>
            </table>
            <table class="amount" style="width: 100%; margin-top: 12px;">
            <tbody>
            <tr style="border-bottom: 1px solid lightgray">
                <td style="width: 80%; color: black; padding: 0px 14px">Subtotal</td>
                <td style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 0px 14px">
                <img
                    src="https://static.thenounproject.com/png/591777-200.png"
                    style="width: 22px; display: block; padding: 0; margin: 0"
                    alt="Rupee"
                />
                <span style="display: block; color: black; padding: 0; margin: 0; margin-left: -5px">
                ${ props.subTotal}
                </span>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid lightgray">
                <td style="width: 80%; color: black; padding: 0px 14px ">Discount ${props.subTotalWithDiscount !== 0 ? props.discountPercentage : 0}%</td>
                <td style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 0px 14px">
                <img
                    src="https://static.thenounproject.com/png/591777-200.png"
                    style="width: 22px; display: block; padding: 0; margin: 0"
                    alt="Rupee"
                />
                <span style="display: block; color: black; padding: 0; margin: 0; margin-left: -5px">
                ${props.subTotalWithDiscount !== 0 ? props.discountValue : 0}
                </span>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid lightgray">
                <td style="width: 80%; color: black; padding: 0px 14px ">Tax ${props.taxPercentage}%</td>
                <td style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 0px 14px">
                <img
                    src="https://static.thenounproject.com/png/591777-200.png"
                    style="width: 22px; display: block; padding: 0; margin: 0"
                    alt="Rupee"
                />
                <span style="display: block; color: black; padding: 0; margin: 0; margin-left: -5px">
                ${props.taxValue}
                </span>
                </td>
            </tr>
            <tr style="border-bottom: 1px solid lightgray">
                <td style="width: 80%; color: black; padding: 0px 14px ">Total</td>
                <td style="display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 0px 14px">
                <img
                    src="https://static.thenounproject.com/png/591777-200.png"
                    style="width: 22px; display: block; padding: 0; margin: 0"
                    alt="Rupee"
                />
                <span style="display: block; color: black; padding: 0; margin: 0; margin-left: -5px">
                ${props.total}
                </span>
                </td>
            </tr>
            
            
            </tbody>
            </table>
            <div style="background-color: #36454F; padding: 1px; margin-top: 8px;"></div>
            <span style="font-size: 12px; color: gray; padding-top: 10px;">Notes, any relevant info, terms, payment instructions, e.t.c</span>
        </body>
    </html>
    `

    const options = {
      html: htmlContent,
      fileName: 'invoice',
      directory: 'Documents',
      height: 842,
      width: 595,
      padding: 24,
      base64: true
    };

    const pdf = await RNHTMLtoPDF.convert(options);

    // const localDir = `${RNFS.ExternalDirectoryPath}`; //files are saving in this path but not in RNFS.DownloadDirectoryPath
    // const path = `${RNFS.DownloadDirectoryPath}/${options.fileName}.pdf`;

    // RNFetchBlob.fs.writeFile(path, pdf.base64, 'base64')
    // .then(res =>{
    //     console.log(res, 'Success')
    //     console.log('File saved at:', path);
    // })
    // .catch (e => console.log(e, 'Error'))

    const downloadPath = Platform.select({
        android: `${RNFetchBlob.fs.dirs.DownloadDir}/invoice.pdf`,
        ios: `${RNFS.DocumentDirectoryPath}/invoice.pdf`,
      });
    
      const saveFile = async () => {
        try {
          await RNFS.writeFile(downloadPath, pdf.base64, 'base64');
          console.log('Success');
          console.log('File saved at:', downloadPath);
        } catch (error) {
          console.log(error);
        }
      };
    
      const copyToDownloadFolder = async () => {
        try {
          await saveFile();
          await RNFS.mkdir(RNFS.DownloadDirectoryPath);
          await RNFS.copyFile(downloadPath, `${RNFS.DownloadDirectoryPath}/invoice.pdf`);
          console.log('File copied to Download folder');
        } catch (error) {
          console.log(error);
        }
      };
    
      copyToDownloadFolder();
    };

    // downloadFile('https://ql-files.s3.ap-south-1.amazonaws.com/course/video-1686652644071-maxresdefault.jpg', 'image.jpg')

  return (
    <Button  onPress={()=>downloadInvoice()}
    style={{paddingTop:10,paddingBottom:10,paddingLeft:20, paddingRight:35}}
    _pressed={{bg: "#fcfcfc",
      _text:{color: "#3e5160"}
      }}
      startIcon={
        <Icon name="download-outline" size={15} color="#ffffff" />
      }
    >
        Download Invoice
    </Button>
  );
};

export default DownloadInvoice;
