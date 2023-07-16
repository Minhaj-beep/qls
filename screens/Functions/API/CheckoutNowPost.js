import {BaseURL} from '../../StaticData/Variables';

const CheckoutNowPost = async (email, courseCode, coupon) => {
  console.log('helooooooooooooooooo', coupon)
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
      courseCode: courseCode,
      couponName: coupon
    })
  };
  const response = await fetch(
    BaseURL + `api/v1/payment/checkout-now`,
    requestOptions,
  )
  // .then(res=>console.log(res.status))
  
  return response.json();
};

export {CheckoutNowPost};