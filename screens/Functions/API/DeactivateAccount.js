/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const DeactivateAccount = async (email) => {
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
    BaseURL + '/deactivateAccount',
    requestOptions,
  );
  return response.json();
};

export {DeactivateAccount};
