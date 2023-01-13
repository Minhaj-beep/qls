import React from 'react';
import axios from 'axios';

export const FetchPost = async (header, body, API) => {
  const BaseURL = 'https://api.dev.qlearning.academy/';
  const API_URL = BaseURL + API;

  const requestOptions = {
    // method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // 'gmailUserType':'INSTRUCTOR',
      // 'token':Email
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await axios.post(API_URL, requestOptions);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    alert('Error: ' + error.message);
  }

  // console.log(requestOptions);
  //  fetch(API_URL, requestOptions)
  //   .then(response => response.json())
  //   .then(result =>{
  //     // console.log(result);
  //     if (result.status === 200){
  //       console.log(result);
  //       return result;
  //     } else if (result.status > 200){
  //       return null;
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //     alert(' API Error:', error);
  // });
};

export const FetchGet = (header, body) => {
  const API = 'https://api.dev.qlearning.academy/';

  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // 'gmailUserType':'INSTRUCTOR',
      // 'token':Email
    },
  };

  console.log(requestOptions);
  fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      return result;
    })
    .catch(error => {
      console.error('Error:', error);
      alert(' API Error:', error);
    });
};
