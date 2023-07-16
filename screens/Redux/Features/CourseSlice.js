import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  LiveCourses: '',
  FeaturedCourses: '',
  PopularCourses: '',
  SearchData: '',
  SearchA: false,
  SearchT: '',
  SCData: '',
  LiveClassD:'',
  AssessmentData:'',
  FullCourseData: '',
  AttendAssessment:'',
  BuyNowCourse: {},
  ViewIndependentAssessmentCode: '',
  IsRetryIndependentAssessment: false,
  JoinDemoClassData: {},
  LiveObjForToday: {}
};

export const courseSlice = createSlice({
  name: 'Course',
  initialState,
  reducers: {
    setLiveCourses: (state, action) => {
      state.LiveCourses = action.payload;
    },
    setFeaturedCourses: (state, action) => {
      state.FeaturedCourses = action.payload;
    },
    setPopularCourses: (state, action) => {
      state.PopularCourses = action.payload;
    },
    setSearchData: (state, action) => {
      state.SearchData = action.payload;
    },
    setSearchA: (state, action) => {
      state.SearchA = action.payload;
    },
    setSearchT: (state, action) => {
      state.SearchT = action.payload;
    },
    setSCData: (state, action) => {
      state.SCData = action.payload;
    },
    setLiveClassD: (state, action) => {
      state.LiveClassD = action.payload;
    },
    setAssessmentData:(state, action) => {
      state.AssessmentData = action.payload;
    },
    setFullCourseData: (state, action) => {
      state.FullCourseData = action.payload;
    },
    setAttendAssessment: (state, action) => {
      state.AttendAssessment = action.payload;
    },
    setBuyNowCourse: (state, action) => {
      state.BuyNowCourse = action.payload;
    },
    setViewIndependentAssessmentCode: (state, action) => {
      state.ViewIndependentAssessmentCode = action.payload;
    },
    setIsRetryIndependentAssessment: (state, action) => {
      state.IsRetryIndependentAssessment = action.payload;
    },
    setJoinDemoClassData: (state, action) => {
      state.JoinDemoClassData = action.payload;
    },
    setLiveObjForToday: (state, action) => {
      state.LiveObjForToday = action.payload;
    },
  },
});

export const {
  setSearchT,
  setSearchA,
  setLiveCourses,
  setFeaturedCourses,
  setPopularCourses,
  setSearchData,
  setSCData,
  setLiveClassD,
  setAssessmentData,
  setFullCourseData,
  setAttendAssessment,
  setBuyNowCourse,
  setViewIndependentAssessmentCode,
  setIsRetryIndependentAssessment,
  setJoinDemoClassData,
  setLiveObjForToday
} = courseSlice.actions;
export default courseSlice.reducer;
