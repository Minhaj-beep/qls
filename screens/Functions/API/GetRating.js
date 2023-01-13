/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetRating = async (email, code) => {
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
    // BaseURL + 'api/v1/course/' + 'ec7406a1-6ebe-420a-bc9d-4bc5e22370ce' + '/rating',
    BaseURL + 'api/v1/course/' + code + '/rating',
    requestOptions,
  )
  // return 'yessssss';
  return response.json();
};

export {GetRating};
