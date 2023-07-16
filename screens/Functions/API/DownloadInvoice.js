/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';
import { DevBaseURL } from '../../StaticData/Variables';

const DownloadInvoices = async (GUser, email, jwt, orderId) => {
  const requestOptions = {
    method: 'GET',
    headers: GUser ? {
      Accept: 'application/json',
      'Content-Type': 'application/pdf',
      gmailUserType: 'STUDENT',
      token: email,
    } : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': jwt,
      }
  }
  const response = await fetch(
    DevBaseURL + 'api/v1/order/'+ orderId + '/downloadInvoice',
    requestOptions,
  );
  return response.blob();
};

export {DownloadInvoices};
