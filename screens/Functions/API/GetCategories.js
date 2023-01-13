import {BaseURL} from '../../StaticData/Variables';

const GetCategories = async email => {
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
  const response = await fetch(BaseURL + 'getAllCategory', requestOptions);
  return response.json();
};

export default GetCategories;
