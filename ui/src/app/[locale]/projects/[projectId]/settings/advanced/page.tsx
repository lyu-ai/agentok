'use client';
import PopupDialog from '@/components/PopupDialog';
import { useProject } from '@/hooks';
import { useState } from 'react';
import { RiSkull2Line } from 'react-icons/ri';

const Page = ({ params }: { params: { projectId: string } }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { project, isLoading } = useProject(params.projectId);

  const handleDelete = () => {
    // Add your delete project logic here
    console.log('Project deleted');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full">
        {/* Other content */}

        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Danger Zone</h2>
          </div>
          <div>
            The operations in this section requires professional knowledge and
            might cause irrrevocable damages.
          </div>
          <div className="flex flex-col p-4 gap-4   border-red-200/40 border rounded-lg bg-red-500/20">
            <div className="font-bold">Delete Project</div>
            <p className="text-sm">
              This action will result in the irrevocable deletion of all data
              associated with the project. Please ensure that you have reviewed
              all related information and have taken any necessary backup
              measures.
            </p>
            <p className="text-sm font-bold">
              Are you absolutely certain you wish to continue with this
              deletion?
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                className="btn btn-sm bg-red-800 px-6 border-red-500 hover:bg-red-600 hover:border-red-400 text-white rounded"
                onClick={() => setShowPrompt(true)}
              >
                Delete [{project.name}]
              </button>
            </div>
          </div>
        </div>
      </div>

      <PopupDialog show={showPrompt}>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">Are you sure?</h3>
          <p className="mt-2">
            This action cannot be undone. This will permanently delete the
            project.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              className="btn btn-sm btn-secondary mr-2"
              onClick={() => setShowPrompt(false)}
            >
              I changed my mind
            </button>
            <button
              className="btn btn-sm bg-red-600 text-white hover:bg-red-400 border-red-500 hover:border-red-400"
              onClick={() => {
                handleDelete();
                setShowPrompt(false);
              }}
            >
              Delete Project
            </button>
          </div>
        </div>
      </PopupDialog>
    </>
  );
};

export default Page;
