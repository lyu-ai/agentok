'use client';
import { useProject } from '@/hooks';
import { Project } from '@/store/projects';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = ({ params }: { params: { projectId: string } }) => {
  const { project, isLoading, updateProject } = useProject(params.projectId);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const fetchSettings = (project?: Project) => {
    if (!project) return;
    setName(project.name);
    setDescription(project.description || '');
  };
  useEffect(() => {
    fetchSettings(project);
  }, [project]);
  const onApplyChanges = async () => {
    if (!project) return;
    const updatedProject = await updateProject({
      name,
      description,
    });

    toast.success('Project info updated');
  };
  return (
    <div className="flex flex-col w-full gap-2 text-sm">
      <h1 className="text-lg font-bold">General Settings</h1>
      <div className="flex flex-col p-4 gap-4 border rounded-lg border-base-content/20">
        <div className="flex items-center gap-2">
          <span>Project Name</span>
          <input
            className="input input-sm input-bordered rounded"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 ">
          <span>Project Description</span>
          <textarea
            rows={3}
            className="textarea textarea-sm textarea-bordered rounded"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 ">
          <button className="btn btn-sm btn-primary" onClick={onApplyChanges}>
            Apply Changes
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => fetchSettings(project)}
          >
            Revert
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
