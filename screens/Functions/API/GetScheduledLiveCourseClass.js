import {BaseURL} from '../../StaticData/Variables';

const GetScheduledLiveCourseClass = async (GUser, email, JWT, code) => {
    console.log('Ias course code :', GUser)
    const requestOptions = !GUser ? {
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token':JWT,
        },
    } : {
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            gmailUserType: 'STUDENT',
            token: email,
        },
    }
    const response = await fetch(BaseURL + 'getScheduledLiveCourseClass?courseCode=' + code, requestOptions)
    return response.json();
}

export default GetScheduledLiveCourseClass;