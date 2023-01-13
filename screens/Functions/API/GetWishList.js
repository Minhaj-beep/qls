/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetWishList = async (email) => {
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
    BaseURL + 'api/v1/wishList',
    requestOptions,
  )
  return response.json();
};

export {GetWishList};
