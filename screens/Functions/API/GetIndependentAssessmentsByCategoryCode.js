//searchIndependentAssessment?givenCategoryName=

import {BaseURL} from '../../StaticData/Variables';

const GetIndependentAssessmentsByCategoryCode = async (guser, email, jwt, code) => {
  // console.log(jwt, 'and ', courseCode)
  const requestOptions = {
    method: 'GET',
    headers: !guser ? {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // gmailUserType: 'INSTRUCTOR',
      // token: email,
      'x-auth-token': jwt
    } : {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    }
  };
  const response = await fetch(
    BaseURL + `searchIndependentAssessment?givenCategoryName=${code}`,
    requestOptions,
  );
  return response.json();
};

export {GetIndependentAssessmentsByCategoryCode};