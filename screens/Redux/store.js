import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './Features/authSlice';
import CourseSlice from './Features/CourseSlice';
import InstructorSlice from './Features/InstructorSlice';

export const store = configureStore({
    reducer:{
        Auth:AuthSlice,
        Course:CourseSlice,
        Instructor:InstructorSlice,
    },
});
