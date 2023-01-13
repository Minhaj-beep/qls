/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetInstructor = async (email, id) => {
  // console.log(email + ' ' + id);
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
  console.log(requestOptions);
  const response = await fetch(
    BaseURL + 'getInstructorById?_id=' + id,
    requestOptions,
  );
  // console.log(response.json());
  return response.json();
};

export {GetInstructor};
