import React from 'react';
import {BaseURL} from '../../StaticData/Variables';

const AddToCart = async (email, code) => {
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
    body: JSON.stringify({ courseCode: code }),
  };
  const response = await fetch(
    BaseURL + 'api/v1/cart',
    requestOptions,
  );
  return response.json();
};

export {AddToCart};
