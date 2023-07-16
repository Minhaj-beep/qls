import {BaseURL} from '../../StaticData/Variables';

const GetAllMessagesFromInstructor = async (GUser, email, JWT, User_ID) => {
  console.log(GUser, email, JWT, User_ID)
    const requestOptions = !GUser ? {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': JWT,
        },
    } : {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        gmailUserType: 'STUDENT',
        token: email,
      },
    }
    const response = await fetch('https://api-uat.qlearning.academy/api/v1/messaging/getAllMessages?userType=STUDENT&userId=' + User_ID, requestOptions)
    return response.json();
}

export default GetAllMessagesFromInstructor;