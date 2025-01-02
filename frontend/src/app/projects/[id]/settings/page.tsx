'use client';
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { settingList } from './project-settings';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const projectId = parseInt(id, 10);
  const router = useRouter();
  useEffect(() => {
    router.replace(`/projects/${projectId}/${settingList[0].path}`);
  }, []);
  return null;
};

export default Page;
