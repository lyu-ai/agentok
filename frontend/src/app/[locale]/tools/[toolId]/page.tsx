"use client";
import ToolDetail from "./components/Detail";

const Page = ({ params }: { params: { toolId: string } }) => {
  const toolId = parseInt(params.toolId, 10);

  if (!toolId) {
    return null;
  }
  return <ToolDetail toolId={toolId} />;
};

export default Page;
