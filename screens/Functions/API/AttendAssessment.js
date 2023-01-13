/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const AttendAssessment = async (email, code, body) => {
  // console.log(email, code, body);
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
    body:JSON.stringify(body),
  };
  const response = await fetch(
    BaseURL + 'api/v1/course/' + code + '/progress',
    requestOptions,
  );
  return response.json();
};

export {AttendAssessment};
