import {BaseURL} from '../../StaticData/Variables';

const GetSearchedIndependentAssessments = async (email, code) => {
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
    const response = await fetch(BaseURL + 'searchIndependentAssessment?givenAssessmentTitle=' + code, requestOptions)
    return response.json();
}

export default GetSearchedIndependentAssessments;