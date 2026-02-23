// store/slices/auth.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { fetchMe, signIn, signOut, signUp } from './thunks';

export type User = { _id: string; name: string; email: string; roles: string[] };

export type FieldErrors = {
    first?: string; last?: string; user?: string; mail?: string; pwd?: string; cpwd?: string;
};

export type FormState = {
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

const initialForm: FormState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPw: '',
    showPassword: false,
    capsLock: false,
    fieldErrors: {},
};

type AuthState = {
    status: 'unknown' | 'authenticated' | 'anonymous';
    user: User | null;
    loading: boolean;
    error: string | null;
    form: FormState;
};

const initialState: AuthState = {
    status: 'unknown',
    user: null,
    loading: false,
    error: null,
    form: initialForm,
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAnonymous(s) {
            s.status = 'anonymous';
            s.user = null;
            s.error = null;
        },

        hydrateFromServer(s, a: PayloadAction<User>) {
            s.user = a.payload;
            s.status = 'authenticated';
            s.loading = false;
            s.error = null;
        },

        clearError(s) {
            s.error = null;
        },
        setField(s, a: PayloadAction<{ field: keyof FormState; value: string | boolean }>) {
            const { field, value } = a.payload;
            // อนุโลม type ในที่เดียวเพื่อความง่าย
            (s.form as any)[field] = value as any;
        },
        setErrors(s, a: PayloadAction<FieldErrors>) {
            s.form.fieldErrors = a.payload;
        },
        resetForm(s) {
            s.form = initialForm;
        },
    },
    extraReducers: (b) => {
        // fetchMe
        b.addCase(fetchMe.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(fetchMe.fulfilled, (s, a: PayloadAction<User>) => {
            s.loading = false; s.user = a.payload; s.status = 'authenticated';
        });
        b.addCase(fetchMe.rejected, (s) => {
            s.loading = false; s.user = null; s.status = 'anonymous';
        });

        // signIn
        b.addCase(signIn.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(signIn.fulfilled, (s, a) => {
            s.loading = false; s.user = a.payload; s.status = 'authenticated';
        });
        b.addCase(signIn.rejected, (s, a) => {
            s.loading = false; s.user = null; s.status = 'anonymous';
            s.error = (a.payload as string) || 'Sign in failed';
        });

        // signUp
        b.addCase(signUp.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(signUp.fulfilled, (s, a) => {
            s.loading = false; s.user = a.payload; s.status = 'authenticated';
        });
        b.addCase(signUp.rejected, (s, a) => {
            s.loading = false; s.user = null; s.status = 'anonymous';
            s.error = (a.payload as string) || 'Sign up failed';
        });

        // signOut
        b.addCase(signOut.fulfilled, (s) => {
            s.user = null; s.status = 'anonymous';
        });
    },
});

export const {
    setAnonymous,
    hydrateFromServer,
    clearError,
    setField,
    setErrors,
    resetForm,
} = slice.actions;

export default slice.reducer;