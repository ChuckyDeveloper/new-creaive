import { combineReducers } from '@reduxjs/toolkit';

import settingReducer from './settings/settingSlice';
import authReducer from './auth'
import dashboarReducer from './dashboard/index'
import signInFormReducers from './forms/signInForm'
import signUpFormReducers from './forms/signUpForm'

import productContentForm from './forms/productContentForm/productContentForm'
import brandFilterReducer from './forms/productContentForm/brandFilterSlice'

const rootReducer = combineReducers({
    setting: settingReducer,
    //
    auth: authReducer,
    signInForm: signInFormReducers,
    signUpForm: signUpFormReducers,
    //
    dashboard: dashboarReducer,
    productContentForm: productContentForm,
    brandFilter: brandFilterReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

