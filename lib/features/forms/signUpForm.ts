// @/lib/features/form/index.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

type FieldErrors = {
    first?: string;
    last?: string;
    user?: string;
    mail?: string;
    pwd?: string;
    cpwd?: string;
};

type FormState = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPw: string;
    showPassword: boolean;
    capsLock: boolean;
    fieldErrors: FieldErrors;
};

const initial: FormState = {
    firstName: '', lastName: '', username: '', email: '', password: '', confirmPw: '',
    showPassword: false, capsLock: false,
    fieldErrors: {},
};

const form = createSlice({
    name: 'form',
    initialState: initial,
    reducers: {
        setField(s, a: PayloadAction<{ field: keyof FormState; value: string | boolean }>) {
            // @ts-ignore - simplify for demo
            s[a.payload.field] = a.payload.value;
        },
        setErrors(s, a: PayloadAction<FieldErrors>) { s.fieldErrors = a.payload; },
        resetForm() { return initial; },
    },
});

export const { setField, setErrors, resetForm } = form.actions;
export default form.reducer;

export const selectAuthForm = (s: RootState) => s.signUpForm;
