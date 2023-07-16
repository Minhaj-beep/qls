//loginWithMobileNum
/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const RequestDemoClass = async (email, courseCode) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
      // 'x-auth-token':JWT,
    },
    body: JSON.stringify({
        courseCode: courseCode,
    }),
  };
  const response = await fetch(
    BaseURL + 'v1/live/course/demoRequest',
    requestOptions,
  );
  return response.json();
};

export {RequestDemoClass};
