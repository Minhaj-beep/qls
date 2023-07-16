/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const CourseReview = async (GUser, email, JWT, givenRating, givenReviewContent, givenCourseCode) => {
  const requestOptions = {
    method: 'POST',
    headers: !GUser ? {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token':JWT,
    } : {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'STUDENT',
      token: email,
    },
    body: JSON.stringify({
        givenRating: givenRating,
        givenReviewContent: givenReviewContent,
    }),
  };
  const response = await fetch(
    BaseURL + 'api/v1/course/' + givenCourseCode + '/rating',
    // ,
    requestOptions,
  );
  return response.json();
};

export {CourseReview};
