// @/lib/features/signinForm/index.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

type FieldErrors = { id?: string; pwd?: string };

export type SignInFormState = {
    identifier: string;
    password: string;
    rememberMe: boolean;
    showPassword: boolean;
    capsLock: boolean;
    fieldErrors: FieldErrors;
};

const initial: SignInFormState = {
    identifier: '',
    password: '',
    rememberMe: true,
    showPassword: false,
    capsLock: false,
    fieldErrors: {},
};

const signinForm = createSlice({
    name: 'signinForm',
    initialState: initial,
    reducers: {
        setField(s, a: PayloadAction<{ field: keyof SignInFormState; value: string | boolean }>) {
            // small convenience cast to keep reducer terse
            (s as any)[a.payload.field] = a.payload.value as any;
        },
        setErrors(s, a: PayloadAction<FieldErrors>) {
            s.fieldErrors = a.payload;
        },
        resetForm() {
            return initial;
        },
    },
});

export const { setField, setErrors, resetForm } = signinForm.actions;
export default signinForm.reducer;

export const selectSignInForm = (s: RootState) => s.signInForm;
