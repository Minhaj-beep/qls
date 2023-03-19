import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  LoggedIn: false,
  Loading: false,
  GUser: false,
  Mail: '',
  JWT: '',
  ProfileData: '',
  ProfileImg: false,
  NotificationCount: null,
};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.LoggedIn = action.payload;
    },
    setGUser: (state, action) => {
      state.GUser = action.payload;
    },
    setLoading: (state, action) => {
      state.Loading = action.payload;
    },
    setJWT: (state, action) => {
      state.JWT = action.payload;
    },
    setProfileData: (state, action) => {
      state.ProfileData = action.payload;
    },
    setMail: (state, action) => {
      state.Mail = action.payload;
    },
    setProfileImg: (state, action) => {
      state.ProfileImg = action.payload;
    },
    setNotificationCount: (state, action) => {
      state.NotificationCount = action.payload;
    },
  },
});

export const {
  setLiveCourses,
  setFeaturedCourses,
  setPopularCourses,
  setProfileImg,
  setMail,
  setProfileData,
  setJWT,
  setLoggedIn,
  setGUser,
  setLoading,
  setNotificationCount,
} = authSlice.actions;
export default authSlice.reducer;
