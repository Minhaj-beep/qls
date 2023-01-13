/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetPurchasedCourses = async (email) => {
  // console.log(email + ' Rating ' + code);
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
    BaseURL + 'api/v1/purchaseHistory',
    requestOptions,
  );

  return response.json();
};

export {GetPurchasedCourses};
