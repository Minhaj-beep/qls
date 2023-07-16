//searchCourse
import {BaseURL} from '../../StaticData/Variables';

const SearchCourseByName = async (jwt, name) => {
    let data
    const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': jwt
          // gmailUserType: 'STUDENT',
          // token: email,
        },
        // body: JSON.stringify({
        //   liveUrl: true
        // }),
      };
    const response = await fetch(BaseURL + 'suggestCourseByName?givenCourseName=' + name, requestOptions)
    return response.json();
}

export default SearchCourseByName;