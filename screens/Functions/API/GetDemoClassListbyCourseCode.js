//loginWithMobileNum
/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetDemoReqbyCourseCode = async (jwt, courseCode) => {
  console.log(jwt, 'and ', courseCode)
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // gmailUserType: 'INSTRUCTOR',
      // token: email,
      'x-auth-token': jwt
    },
  };
  const response = await fetch(
    BaseURL + `v1/live/course/getDemoReqbyCourseCode?courseCode=${courseCode}&liveUrl=https://demoTest.com`,
    requestOptions,
  );
  return response.json();
};

export {GetDemoReqbyCourseCode};
