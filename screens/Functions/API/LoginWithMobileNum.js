//loginWithMobileNum
/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const LoginWithMobileNum = async (mobileNumber, userType, accountId, email) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    },
    body: JSON.stringify({
        mobileNumber: mobileNumber,
        userType: userType,
        accountId: accountId,
        email: email
    }),
  };
  const response = await fetch(
    BaseURL + 'loginWithMobileNum',
    requestOptions,
  );
  return response.json();
};

export {LoginWithMobileNum};
