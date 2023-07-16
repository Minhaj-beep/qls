/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const CoursePurchaseCheck = async (code, email) => {
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
    body: JSON.stringify({
        courseCode: code,
        studentEmail: email
    })
  };
  const response = await fetch(
    BaseURL + 'api/v1/isStudentPurchasedCourseCheck',
    requestOptions,
  );
  return response.json();
};

export {CoursePurchaseCheck};
