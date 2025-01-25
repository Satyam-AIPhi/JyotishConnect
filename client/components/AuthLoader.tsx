"use client";
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { fetchCurrentUser } from '@/redux/userSlice';

const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthLoader;
