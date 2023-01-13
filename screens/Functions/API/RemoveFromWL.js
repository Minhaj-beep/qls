/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const RemoveFromWL = async (email,code) => {
  const requestOptions = {
    method: 'DELETE',
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
  console.log(requestOptions);
  const response = await fetch(
    BaseURL + 'api/v1/wishList/' + code,
    requestOptions,
  );
  return response.json();
};

export {RemoveFromWL};
