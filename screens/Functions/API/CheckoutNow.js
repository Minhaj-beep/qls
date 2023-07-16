import {BaseURL} from '../../StaticData/Variables';

const CheckoutNow = async (email, courseCode, couponName) => {
  const requestOptions = {
    method: 'GET',
    // headers:{
    //   'Accept': 'application/json',
    //   'Content-Type': 'application/json',
    //   'x-auth-token':JWT,
    // },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'STUDENT',
      token: email,
    },
  };
  const response = await fetch(
    BaseURL + `api/v1/payment/checkout-now?courseCode=${courseCode}&couponName=${couponName}`,
    requestOptions,
  )
  // .then(res=>console.log(res.status))
  
  return response.json();
};

export {CheckoutNow};