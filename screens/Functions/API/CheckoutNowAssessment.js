import {BaseURL} from '../../StaticData/Variables';

const CheckoutNowAssessment = async (email, courseCode) => {
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
  const response = await fetch(
    BaseURL + `api/v1/payment/checkout-now?assessmentCode=${courseCode}`,
    requestOptions,
  )
  // .then(res=>console.log(res.status))
  
  return response.json();
};

export {CheckoutNowAssessment};