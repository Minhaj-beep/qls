import {BaseURL} from '../../StaticData/Variables';

const GetCoursesByCategoryCode = async (guser, email, jwt, courseCode) => {
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
    BaseURL + `searchCourse?givenCategoryName=${courseCode}`,
    requestOptions,
  );
  return response.json();
};

export {GetCoursesByCategoryCode};