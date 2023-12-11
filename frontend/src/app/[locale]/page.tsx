'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/flow');
  }, [router]);

  return null; // or a loading indicator if preferred
};

export default HomePage;
