import {BaseURL} from '../../StaticData/Variables';

const SetCourseProgress = async (email, chapterOrder, lessonOrder, courseCode) => {
  const requestOptions = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        gmailUserType: 'STUDENT',
        token: email,
        //   'x-auth-token':UserD.JWT,
    },
    body: JSON.stringify({ 
        chapterOrder: chapterOrder,
        lessonOrder: lessonOrder
    })
  };
  const response = await fetch(
    BaseURL + `api/v1/course/${courseCode}/progress`,
    requestOptions,
  )
  // .then(res=>console.log(res.status))
  
  return response.json();
};

export {SetCourseProgress};