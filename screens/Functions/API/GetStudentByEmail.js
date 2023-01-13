/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetStudentByEmail = async (email) => {
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
    BaseURL + 'getStudentByEmail?email=' + email,
    requestOptions,
  );
  return response.json();
};

export {GetStudentByEmail};
