// getAllCourse

import {BaseURL} from '../../StaticData/Variables';


//Get all active independent assessments
const GetAllCourses = async (email) => {
    let data
    const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
    };
    const response = await fetch(BaseURL + 'getAllCourse', requestOptions)
    return response.json();
}

export default GetAllCourses;