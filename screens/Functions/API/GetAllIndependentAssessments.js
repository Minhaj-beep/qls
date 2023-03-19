import {BaseURL} from '../../StaticData/Variables';


//Get all active independent assessments
const getAllIndependentAssessments = async (email) => {
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
    const response = await fetch(BaseURL + 'getAllActivatedAssessment', requestOptions)
    return response.json();
}

export default getAllIndependentAssessments;