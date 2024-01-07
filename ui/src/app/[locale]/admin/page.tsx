'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/api-keys');
  }, [router]);

  return null; // or a loading indicator if preferred
};

export default Page;
