import {BaseURL} from '../../StaticData/Variables';

const CheckoutNowPostAssessment = async (email, courseCode) => {
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
    body: JSON.stringify({ assessmentCode: courseCode })
  };
  const response = await fetch(
    BaseURL + `/api/v1/payment/checkout-now`,
    requestOptions,
  )
  // .then(res=>console.log(res.status))
  
  return response.json();
};

export {CheckoutNowPostAssessment};