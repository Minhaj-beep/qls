import {BaseURL} from '../../StaticData/Variables';

const GetDiscountForBuyNow = async (email, code) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    },
  };
  const response = await fetch(
    BaseURL + `v1/courseDiscount/getDiscountCodeForCourse?courseCode=` + code,
    requestOptions,
  );
  return response.json();
};

export {GetDiscountForBuyNow};