/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetCourseByCode = async (jwt, code) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': jwt
      // gmailUserType: 'STUDENT',
      // token: email,
    },
    // body: JSON.stringify({
    //   liveUrl: true
    // }),
  };
  const response = await fetch(
    BaseURL + 'getCourseByCourseCode?courseCode=' + code,
    requestOptions,
  );
  return response.json();
};

export {GetCourseByCode};
