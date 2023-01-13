import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
    Instructor:'',
    InstructorCourses:'',
};

export const InstructorSlice = createSlice({
  name: 'Instructor',
  initialState,
  reducers: {
    setInstructor: (state, action) => {
      state.Instructor = action.payload;
    },
    setInstructorCourses: (state, action) => {
      state.InstructorCourses = action.payload;
    },
  },
});

export const {
    setInstructor,
    setInstructorCourses,
} = InstructorSlice.actions;
export default InstructorSlice.reducer;
