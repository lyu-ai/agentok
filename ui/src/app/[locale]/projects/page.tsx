'use client';

import { useRouter } from 'next/navigation';
import ProjectList from '../components/ProjectList';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { RiSwap3Line, RiShoppingBag4Line } from 'react-icons/ri';
import Link from 'next/link';
import TemplateList from '../components/TemplateList';

const Page = () => {
  const t = useTranslations('page.Projects');
  const router = useRouter();
  const { createProject } = useProjects();
  const onCreateProject = async () => {
    const project = await createProject();
    if (!project) {
      toast.error('Failed to create project');
      return;
    }
    toast.success('Project created. Now jumping to project page.');
    router.push(`/projects/${project.id}`);
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <title>Projects | Agentok Studio</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm p-2">
        <span className="text-5xl font-bold p-4">{t('tagline')}</span>
        <span className="text-lg p-4">{t('projects-description')}</span>
        <button onClick={onCreateProject} className="btn btn-lg btn-primary">
          <RiSwap3Line className="w-7 h-7" />
          {t('create-project')}
        </button>
      </div>
      <ProjectList />
      <div className="divider text-2xl">Or</div>
      <div className="flex flex-col items-center justify-center gap-2 text-sm py-8 mb-12">
        <RiShoppingBag4Line className="w-12 h-12" />
        <span className="text-2xl p-4">{t('start-from-template')}</span>
        <TemplateList maxCount={3} />
        <Link
          href="/marketplace"
          className="flex flex-col items-center link link-lg link-primary py-8 gap-4 text-2xl"
        >
          {t('discover-marketplace')}
        </Link>
      </div>
    </div>
  );
};

export default Page;
