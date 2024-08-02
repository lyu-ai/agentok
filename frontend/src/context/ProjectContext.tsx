'use client';
import { createContext, PropsWithChildren, useContext } from 'react';

const ProjectContext = createContext<{ projectId: number }>({ projectId: -1 });

export const ProjectProvider = ({
  projectId,
  children,
}: PropsWithChildren<{ projectId: number }>) => {
  return (
    <ProjectContext.Provider value={{ projectId }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectId = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectId must be used within a ProjectProvider');
  }
  return context;
};
