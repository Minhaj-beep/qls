/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const MarkAllAsRead = async (email, id) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'STUDENT',
      token: email,
    },
    body: JSON.stringify({
        userID: id,
    }),
  };
  const response = await fetch(
    BaseURL + '/v1/notifications/markAllAsRead',
    requestOptions,
  )
  return response.json();
};

export {MarkAllAsRead};
