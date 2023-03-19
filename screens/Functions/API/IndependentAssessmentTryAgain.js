/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const IndependentAssessmentTryAgain = async (email, code) => {
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
  };
  const response = await fetch(
    BaseURL + 'api/v1/assessment/' + code + '/delete-progress',
    requestOptions,
  );
  return response.json();
};

export {IndependentAssessmentTryAgain};
