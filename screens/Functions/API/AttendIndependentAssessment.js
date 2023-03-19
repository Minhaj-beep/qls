/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const AttendIndependentAssessment = async (email, code, body) => {
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
    BaseURL + 'api/v1/assessment/' + code + '/progress',
    requestOptions,
  );
  return response.json();
};

export {AttendIndependentAssessment};
