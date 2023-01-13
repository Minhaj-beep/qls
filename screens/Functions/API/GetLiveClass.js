import {BaseURL} from '../../StaticData/Variables';

const GetLiveClass = async (email, code) => {
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
  // console.log(requestOptions);
  const response = await fetch(
    BaseURL + '/getAllLiveClassByCourseCode?courseCode=' + code,
    requestOptions,
  );
//   console.log(response);
  return response.json();
};

export {GetLiveClass};
