import {BaseURL} from '../../StaticData/Variables';


//Get all active independent assessments
const getIndependentAssessmentByCode = async (email, code) => {
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
    const response = await fetch(BaseURL + 'getAssessmentbyAssessmentCode?assessmentCode=' + code, requestOptions)
    return response.json();
}

export default getIndependentAssessmentByCode;