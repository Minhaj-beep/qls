/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const PaymentVerification = async (email, oi, pi,sign) => {
  // console.log(email + ' ' + code);
  const requestOptions = {
    method: 'POST',
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
    body: JSON.stringify({
      razorpay_order_id: oi,
      razorpay_payment_id:pi,
      razorpay_signature:sign,
    }),
  };
  console.log(requestOptions);
  const response = await fetch(
    BaseURL + 'api/v1/payment/verification',
    requestOptions,
  );
  return response.json();
};

export {PaymentVerification};
