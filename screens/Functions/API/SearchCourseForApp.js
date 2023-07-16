import {BaseURL} from '../../StaticData/Variables';

const SearchCourseForApp = async (email) => {
    const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'STUDENT',
          token: email,
        },
      };
    const response = await fetch(BaseURL + 'appSearchCourse?givenCourseName=', requestOptions)
    return response.json();
}

export default SearchCourseForApp;