'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMe } from '../features/auth/thunks';
import { AppDispatch } from '../features';

export default function useAuthBootstrap() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => { dispatch(fetchMe()); }, [dispatch]);
}