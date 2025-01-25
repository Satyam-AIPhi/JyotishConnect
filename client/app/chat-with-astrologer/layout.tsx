"use client";

import { ReactNode, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, fetchCurrentUser } from '@/redux/userSlice';
import { Loader } from '@/components/loader';

interface ProtectedLayoutProps {
  children: ReactNode;
}

// Child component that handles authentication logic
function AuthChecker() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => {
          const queryString = searchParams ? `?${searchParams.toString()}` : '';
          const fullPath = `${pathname}${queryString}`;

          router.push('/auth/login?redirectUrl=' + encodeURIComponent(fullPath));
        });
    }
  }, [dispatch, user, router, pathname, searchParams]);

  return null; 
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = useAppSelector(selectUser);

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        <AuthChecker />
      </Suspense>
      {children}
    </>
  );
}
