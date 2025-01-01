'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { settingList } from './project-settings';

const Page = ({ params }: { params: { projectId: string } }) => {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/projects/${params.projectId}/${settingList[0].path}`);
  }, []);
  return null;
};

export default Page;
