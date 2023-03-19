import {BaseURL} from '../../StaticData/Variables';

const GetSearchedCourses = async (email, code) => {
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
    const response = await fetch(BaseURL + 'searchCourse', requestOptions)
    return response.json();
}

export default GetSearchedCourses;