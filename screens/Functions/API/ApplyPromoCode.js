/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const ApplyPromoCode = async (email, code) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'STUDENT',
      token: email,
    },
    body:JSON.stringify({
        couponName: code,
    }),
  };
  const response = await fetch(
    BaseURL + 'v1/courseDiscount/applyPromoCode',
    requestOptions,
  )
  return response.json();
};

export {ApplyPromoCode};
