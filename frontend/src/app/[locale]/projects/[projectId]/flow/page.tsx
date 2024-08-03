"use client";

import { ReactFlowProvider } from "reactflow";
import Flow from "./components/Flow";
import { useProjects } from "@/hooks";
import { useEffect } from "react";

const Page = ({ params }: { params: { projectId: string } }) => {
  const projectId = parseInt(params.projectId, 10);
  const { activeProjectId, setActiveProjectId } = useProjects();
  useEffect(() => {
    if (projectId !== activeProjectId) {
      setActiveProjectId(projectId);
    }
  }, [projectId]);
  return (
    <ReactFlowProvider key="agentok-reactflow">
      <Flow projectId={projectId} />
    </ReactFlowProvider>
  );
};

export default Page;
