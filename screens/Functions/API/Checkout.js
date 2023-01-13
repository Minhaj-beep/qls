/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const Checkout = async (email) => {
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
  };
  const response = await fetch(
    BaseURL + 'api/v1/payment/checkout',
    requestOptions,
  );
  return response.json();
};

export {Checkout};
