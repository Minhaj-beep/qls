/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetCourseByCode = async (GUser, email, jwt, code) => {

  const requestOptions = GUser !== true ? {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': jwt,
    },
  } : {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'STUDENT',
      token: email,
    },
  }
  const response = await fetch(
    BaseURL + 'getCourseByCourseCode?courseCode=' + code,
    requestOptions,
  );
  return response.json();
};

export {GetCourseByCode};
