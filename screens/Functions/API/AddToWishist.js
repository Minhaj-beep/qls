/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const AddToWishList = async (email, code) => {
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
    body:JSON.stringify({
        courseCode: code,
    }),
  };
  const response = await fetch(
    BaseURL + 'api/v1/wishList',
    requestOptions,
  )
  return response.json();
};

export {AddToWishList};
