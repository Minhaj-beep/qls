/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetInstructorCourses = async (email, id) => {
  // console.log(email + ' ' + code);
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
    BaseURL + 'getCourseByInstructorId?instructorId=' + id,
    requestOptions,
  );
  return response.json();
};

export {GetInstructorCourses};